import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './modules/auth/auth.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { BuildersModule } from './modules/builders/builders.module'
import { GrievancesModule } from './modules/grievances/grievances.module'
import { CommunityModule } from './modules/community/community.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { LegalModule } from './modules/legal/legal.module'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    AuthModule,
    ProjectsModule,
    BuildersModule,
    GrievancesModule,
    CommunityModule,
    AnalyticsModule,
    LegalModule,
    AdminModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
