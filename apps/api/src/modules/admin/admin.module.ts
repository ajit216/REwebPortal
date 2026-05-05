import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { GrievancesModule } from '../grievances/grievances.module'
import { RERAModule } from '../rera/rera.module'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [GrievancesModule, RERAModule, NotificationsModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
