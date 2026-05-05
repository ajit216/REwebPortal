import { Module } from '@nestjs/common'
import { BuildersController } from './builders.controller'
import { BuildersService } from './builders.service'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  controllers: [BuildersController],
  providers: [BuildersService, PrismaService],
  exports: [BuildersService],
})
export class BuildersModule {}
