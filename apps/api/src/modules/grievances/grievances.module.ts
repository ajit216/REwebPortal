import { Module } from '@nestjs/common'
import { GrievancesController } from './grievances.controller'
import { GrievancesService } from './grievances.service'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [NotificationsModule],
  controllers: [GrievancesController],
  providers: [GrievancesService, PrismaService],
  exports: [GrievancesService],
})
export class GrievancesModule {}
