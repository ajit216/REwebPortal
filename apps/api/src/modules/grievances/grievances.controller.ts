import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { GrievancesService } from './grievances.service'

@ApiTags('Grievances')
@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Get('project/:projectId/summary')
  @ApiOperation({ summary: 'Get aggregated grievance summary for a project (public)' })
  getProjectSummary(@Param('projectId') projectId: string) {
    return this.grievancesService.getProjectSummary(projectId)
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'File a new grievance (auth required)' })
  create(@Body() body: any) {
    return this.grievancesService.create(body)
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s grievances' })
  getMyGrievances() {
    return { data: [] }
  }
}
