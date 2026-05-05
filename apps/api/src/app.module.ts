import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { PrismaService } from './prisma/prisma.service'
import { RedisModule } from './common/redis/redis.module'

// Feature modules
import { AuthModule } from './modules/auth/auth.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { BuildersModule } from './modules/builders/builders.module'
import { GrievancesModule } from './modules/grievances/grievances.module'
import { CommunityModule } from './modules/community/community.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { LegalModule } from './modules/legal/legal.module'
import { AdminModule } from './modules/admin/admin.module'
import { RERAModule } from './modules/rera/rera.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { UsersModule } from './modules/users/users.module'

// Common
import { HealthController } from './health/health.controller'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor'

@Module({
  imports: [
    // Config — must be first so all modules can access env vars
    ConfigModule.forRoot({ isGlobal: true }),

    // Global Redis — available everywhere
    RedisModule,

    // Rate limiting — defaults: 60 requests per minute per IP
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),

    // Feature modules
    AuthModule,
    ProjectsModule,
    BuildersModule,
    GrievancesModule,
    CommunityModule,
    AnalyticsModule,
    LegalModule,
    AdminModule,
    RERAModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [
    PrismaService,

    // Global exception handler
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },

    // Global response transformer
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
