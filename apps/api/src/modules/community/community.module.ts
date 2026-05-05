import { Module } from '@nestjs/common'
import { CommunityController } from './community.controller'
import { CommunityService } from './community.service'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [NotificationsModule],
  controllers: [CommunityController],
  providers: [CommunityService, PrismaService],
  exports: [CommunityService],
})
export class CommunityModule {}
