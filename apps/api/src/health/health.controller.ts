import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/v1/health
   * Used by: Better Uptime monitoring, Railway health checks, CI smoke tests
   * Expected response time: <200ms (cached)
   */
  @Get()
  @ApiOperation({ summary: 'Platform health check — returns DB + service status' })
  async check() {
    let dbStatus: 'connected' | 'error' = 'error'

    try {
      await this.prisma.$queryRaw`SELECT 1`
      dbStatus = 'connected'
    } catch {
      // DB unreachable — still return 200 so uptime monitors can distinguish
      // app-level issues from infra issues
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      db: dbStatus,
    }
  }
}
