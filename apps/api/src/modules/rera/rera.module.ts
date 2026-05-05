import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { RERAController } from './rera.controller'
import { RERAService } from './rera.service'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000, // MahaRERA portal can be slow
      maxRedirects: 3,
      headers: {
        // Mimic browser to avoid trivial bot blocking
        'User-Agent': 'Mozilla/5.0 (compatible; REwebPortal/1.0; +https://rewebportal.in)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    }),
  ],
  controllers: [RERAController],
  providers: [RERAService, PrismaService],
  exports: [RERAService],
})
export class RERAModule {}
