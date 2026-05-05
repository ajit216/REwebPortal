import { Module } from '@nestjs/common'
import { LegalController } from './legal.controller'
import { LegalService } from './legal.service'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  controllers: [LegalController],
  providers: [LegalService, PrismaService],
  exports: [LegalService],
})
export class LegalModule {}
