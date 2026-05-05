import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '../../../common/redis/redis.service'

export interface JwtPayload {
  sub: string       // userId
  role: string      // UserRole
  verificationStatus: string
  jti?: string      // JWT token ID for blacklisting
  type?: 'access' | 'refresh' | 'admin'
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'dev-secret-change-in-production'),
      passReqToCallback: false,
    })
  }

  async validate(payload: JwtPayload) {
    // Check blacklist for logged-out tokens
    if (payload.jti) {
      const blacklisted = await this.redis.isAccessTokenBlacklisted(payload.jti)
      if (blacklisted) {
        throw new UnauthorizedException('Token has been revoked')
      }
    }

    return {
      userId: payload.sub,
      role: payload.role,
      verificationStatus: payload.verificationStatus,
      jti: payload.jti,
    }
  }
}
