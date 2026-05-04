import { Module } from '@nestjs/common'
import { GrievancesController } from './grievances.controller'
import { GrievancesService } from './grievances.service'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  controllers: [GrievancesController],
  providers: [GrievancesService, PrismaService],
  exports: [GrievancesService],
})
export class GrievancesModule {}
