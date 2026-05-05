import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private client: Redis

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.config.get<string>('REDIS_URL', 'redis://localhost:6379')
    this.client = new Redis(redisUrl, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
    })

    this.client.on('error', (err) => {
      this.logger.warn(`Redis error: ${err.message}`)
    })

    this.client.on('connect', () => {
      this.logger.log('Redis connected')
    })

    this.client.connect().catch(() => {
      this.logger.warn('Redis unavailable — cache/session features degraded')
    })
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key)
    } catch {
      return null
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds)
      } else {
        await this.client.set(key, value)
      }
    } catch (err) {
      this.logger.warn(`Redis set failed for key ${key}: ${(err as Error).message}`)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (err) {
      this.logger.warn(`Redis del failed for key ${key}: ${(err as Error).message}`)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1
    } catch {
      return false
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds)
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  // OTP helpers
  async storeOTPCode(phone: string, otp: string, ttlSeconds = 300): Promise<void> {
    await this.set(`otp:${phone}`, otp, ttlSeconds)
  }

  async getOTPCode(phone: string): Promise<string | null> {
    return this.get(`otp:${phone}`)
  }

  async deleteOTPCode(phone: string): Promise<void> {
    await this.del(`otp:${phone}`)
  }

  // JWT refresh token helpers
  async storeRefreshToken(userId: string, tokenId: string, ttlSeconds: number): Promise<void> {
    await this.set(`refresh:${userId}:${tokenId}`, '1', ttlSeconds)
  }

  async isRefreshTokenValid(userId: string, tokenId: string): Promise<boolean> {
    return this.exists(`refresh:${userId}:${tokenId}`)
  }

  async invalidateRefreshToken(userId: string, tokenId: string): Promise<void> {
    await this.del(`refresh:${userId}:${tokenId}`)
  }

  // JWT access token blacklist (for logout)
  async blacklistAccessToken(jti: string, ttlSeconds: number): Promise<void> {
    await this.set(`blacklist:${jti}`, '1', ttlSeconds)
  }

  async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
    return this.exists(`blacklist:${jti}`)
  }

  // Cache helpers
  async cacheResponse(key: string, data: unknown, ttlSeconds: number): Promise<void> {
    await this.setJson(`cache:${key}`, data, ttlSeconds)
  }

  async getCachedResponse<T>(key: string): Promise<T | null> {
    return this.getJson<T>(`cache:${key}`)
  }

  async invalidateCache(keyPattern: string): Promise<void> {
    await this.del(`cache:${keyPattern}`)
  }
}
