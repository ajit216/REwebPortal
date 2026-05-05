import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { PrismaService } from './prisma/prisma.service'
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
import { HealthController } from './health/health.controller'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor'

@Module({
  imports: [
    // Config — must be first so all other modules can access env vars
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — 60 requests per minute per user (overridden per route group)
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),

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
  ],
  controllers: [HealthController],
  providers: [
    PrismaService,

    // Global exception handler — normalises all errors to API envelope
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },

    // Global response transformer — wraps all responses in { success, data }
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
