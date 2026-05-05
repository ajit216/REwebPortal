import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'
import { NotificationsService } from '../notifications/notifications.service'
import { SmsTemplate } from '../notifications/notifications.service'
import type { JwtPayload } from './strategies/jwt.strategy'

const OTP_TTL_SECONDS = 300   // 5 minutes
const OTP_MAX_ATTEMPTS = 3
const ACCESS_TOKEN_TTL = 15 * 60        // 15 minutes
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60  // 30 days
const ADMIN_ACCESS_TTL = 8 * 60 * 60   // 8 hours

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── OTP Send ──────────────────────────────────────────────────────────────

  async sendOTP(phone: string): Promise<{ expiresIn: number }> {
    // Rate limit check — max 3 OTPs per phone per 10 minutes (enforced by throttler at controller level)
    // Invalidate any existing unused OTP for this phone
    await this.prisma.oTPRecord.updateMany({
      where: { phone, used: false },
      data: { used: true },
    })

    // Generate 6-digit OTP using crypto (not Math.random)
    const otpPlain = crypto.randomInt(100000, 999999).toString()
    const otpHash = await bcrypt.hash(otpPlain, 10)

    await this.prisma.oTPRecord.create({
      data: {
        phone,
        otpHash,
        expiresAt: new Date(Date.now() + OTP_TTL_SECONDS * 1000),
        attempts: 0,
        used: false,
      },
    })

    // Send SMS via MSG91
    await this.notifications.sendOTP(phone, otpPlain)

    this.logger.log(`OTP sent to ${this.maskPhone(phone)}`)
    return { expiresIn: OTP_TTL_SECONDS }
  }

  // ─── OTP Verify + Login/Register ───────────────────────────────────────────

  async verifyOTP(phone: string, otp: string) {
    // Find valid OTP record
    const record = await this.prisma.oTPRecord.findFirst({
      where: {
        phone,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!record) {
      throw new BadRequestException('OTP_EXPIRED')
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.oTPRecord.update({
        where: { id: record.id },
        data: { used: true },
      })
      throw new BadRequestException('OTP_MAX_ATTEMPTS')
    }

    const valid = await bcrypt.compare(otp, record.otpHash)

    if (!valid) {
      await this.prisma.oTPRecord.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      })
      throw new BadRequestException('OTP_INVALID')
    }

    // Mark OTP as used
    await this.prisma.oTPRecord.update({
      where: { id: record.id },
      data: { used: true },
    })

    // Clean up expired OTPs
    await this.prisma.oTPRecord.deleteMany({
      where: { phone, expiresAt: { lt: new Date() } },
    }).catch(() => {/* non-critical cleanup */})

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone }, include: { buyerProfile: true } })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          phoneVerified: true,
          role: 'BUYER',
          isActive: true,
          lastLoginAt: new Date(),
        },
        include: { buyerProfile: true },
      })
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, lastLoginAt: new Date() },
      })
    }

    return this.issueTokens(user)
  }

  // ─── Token Refresh ─────────────────────────────────────────────────────────

  async refreshToken(refreshToken: string) {
    let payload: JwtPayload
    try {
      payload = this.jwt.verify<JwtPayload>(refreshToken)
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Not a refresh token')
    }

    const tokenId = payload.jti
    if (!tokenId) throw new UnauthorizedException('Malformed refresh token')

    const valid = await this.redis.isRefreshTokenValid(payload.sub, tokenId)
    if (!valid) throw new UnauthorizedException('Refresh token has been revoked')

    // Rotate — invalidate old, issue new
    await this.redis.invalidateRefreshToken(payload.sub, tokenId)

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { buyerProfile: true },
    })
    if (!user || !user.isActive) throw new UnauthorizedException('Account not found or inactive')

    return this.issueTokens(user)
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string, accessJti?: string, refreshJti?: string): Promise<void> {
    if (accessJti) {
      await this.redis.blacklistAccessToken(accessJti, ACCESS_TOKEN_TTL)
    }
    if (refreshJti) {
      await this.redis.invalidateRefreshToken(userId, refreshJti)
    }
  }

  // ─── Admin Login ───────────────────────────────────────────────────────────

  async adminLogin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { buyerProfile: true },
    })

    if (!user || !user.passwordHash || !['ADMIN', 'MODERATOR'].includes(user.role)) {
      throw new UnauthorizedException('Invalid admin credentials')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive')
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid admin credentials')
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const jti = crypto.randomUUID()
    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        role: user.role,
        verificationStatus: user.buyerProfile?.verificationStatus ?? 'UNVERIFIED',
        jti,
        type: 'access',
      } satisfies JwtPayload,
      { expiresIn: ADMIN_ACCESS_TTL },
    )

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async issueTokens(user: any) {
    const accessJti = crypto.randomUUID()
    const refreshJti = crypto.randomUUID()

    const verificationStatus = user.buyerProfile?.verificationStatus ?? 'UNVERIFIED'

    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        role: user.role,
        verificationStatus,
        jti: accessJti,
        type: 'access',
      } satisfies JwtPayload,
      { expiresIn: ACCESS_TOKEN_TTL },
    )

    const refreshToken = this.jwt.sign(
      {
        sub: user.id,
        role: user.role,
        verificationStatus,
        jti: refreshJti,
        type: 'refresh',
      } satisfies JwtPayload,
      { expiresIn: REFRESH_TOKEN_TTL },
    )

    // Store refresh token ID in Redis
    await this.redis.storeRefreshToken(user.id, refreshJti, REFRESH_TOKEN_TTL)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
        verificationStatus,
        hasProfile: !!user.buyerProfile,
      },
    }
  }

  private maskPhone(phone: string): string {
    return phone.length >= 10 ? `${phone.slice(0, 3)}XXXXXXX${phone.slice(-2)}` : '***'
  }
}
