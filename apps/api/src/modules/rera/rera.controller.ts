import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { RERAService } from './rera.service'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('RERA')
@Controller()
export class RERAController {
  constructor(private readonly reraService: RERAService) {}

  @Get('projects/:slug/rera')
  @Public()
  @ApiOperation({ summary: 'Get RERA compliance record for a project (public)' })
  async getProjectRERA(@Param('slug') slug: string) {
    // Public RERA data is served via ProjectsService.getRERA()
    // This endpoint is a convenience alias kept for backwards compatibility
    return { message: 'Use GET /projects/:slug/rera' }
  }
}
