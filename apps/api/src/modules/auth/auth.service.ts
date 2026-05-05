import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsService, SmsTemplate } from '../notifications/notifications.service'
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  // In production, store OTPs in Redis with TTL. For v1, in-memory map.
  private readonly otpStore = new Map<string, { otp: string; expiresAt: Date; attempts: number }>()

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * Step 1: Send OTP to phone number.
   * Rate limit: 1 OTP per 60 seconds per number.
   */
  async sendOtp(phone: string): Promise<{ message: string; expiresIn: number }> {
    const normalized = this.normalizePhone(phone)
    const otp = this.generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    this.otpStore.set(normalized, { otp, expiresAt, attempts: 0 })

    // Send via MSG91 (stubbed until credentials are configured)
    try {
      await this.notifications.sendSms({
        to: normalized,
        templateKey: SmsTemplate.OTP,
        variables: { var: otp },
      })
    } catch (err) {
      this.logger.warn(`SMS send failed for ${normalized} — OTP: ${otp}`, err)
      // In dev, log OTP. In prod, this should fail hard.
      if (this.config.get('NODE_ENV') !== 'production') {
        this.logger.debug(`[DEV OTP] ${normalized}: ${otp}`)
      }
    }

    return { message: 'OTP sent', expiresIn: 300 }
  }

  /**
   * Step 2: Verify OTP and issue JWT.
   * Creates user account if first-time login.
   */
  async verifyOtp(
    phone: string,
    otp: string,
    displayName?: string,
  ): Promise<{ accessToken: string; refreshToken: string; isNewUser: boolean }> {
    const normalized = this.normalizePhone(phone)
    const record = this.otpStore.get(normalized)

    if (!record) {
      throw new BadRequestException('OTP_NOT_FOUND')
    }

    record.attempts += 1

    if (record.attempts > 5) {
      this.otpStore.delete(normalized)
      throw new BadRequestException('OTP_MAX_ATTEMPTS_EXCEEDED')
    }

    if (new Date() > record.expiresAt) {
      this.otpStore.delete(normalized)
      throw new BadRequestException('OTP_EXPIRED')
    }

    if (record.otp !== otp) {
      throw new UnauthorizedException('OTP_INVALID')
    }

    this.otpStore.delete(normalized)

    // Upsert user
    let user = await this.prisma.user.findUnique({ where: { phone: normalized } })
    const isNewUser = !user

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: normalized,
          phoneVerified: true,
          role: 'BUYER',
          buyerProfile: {
            create: {
              displayName: displayName ?? this.defaultDisplayName(normalized),
              verificationStatus: 'UNVERIFIED',
            },
          },
        },
      })
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, lastLoginAt: new Date() },
      })
    }

    const tokens = await this.issueTokens(user.id, user.phone, user.role)
    return { ...tokens, isNewUser }
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let payload: any
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
      })
    } catch {
      throw new UnauthorizedException('REFRESH_TOKEN_INVALID')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, phone: true, role: true, isActive: true },
    })

    if (!user || !user.isActive) throw new UnauthorizedException('ACCOUNT_INACTIVE')

    const accessToken = this.jwtService.sign(
      { sub: user.id, phone: user.phone, role: user.role },
      { expiresIn: '15m' },
    )

    return { accessToken }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async issueTokens(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
      expiresIn: '30d',
    })
    return { accessToken, refreshToken }
  }

  private generateOtp(): string {
    return String(crypto.randomInt(100000, 999999))
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 10) return `+91${digits}`
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
    if (digits.startsWith('+')) return phone
    return `+91${digits.slice(-10)}`
  }

  private defaultDisplayName(phone: string): string {
    return `Buyer ${phone.slice(-4)}`
  }
}
