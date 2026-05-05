import { Module } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { BuildersController } from './builders.controller'
import { BuildersService } from './builders.service'

@Module({
  controllers: [BuildersController],
  providers: [BuildersService, PrismaService],
  exports: [BuildersService],
})
export class BuildersModule {}
