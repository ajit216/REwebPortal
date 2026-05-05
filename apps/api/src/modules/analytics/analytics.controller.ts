import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('market-overview')
  @Public()
  @ApiOperation({ summary: 'Platform-wide snapshot: projects by status, city, grievance counts' })
  getMarketOverview() {
    return this.analyticsService.getMarketOverview()
  }

  @Get('delays')
  @Public()
  @ApiOperation({ summary: 'Delay analysis: avg by builder, distribution, worst projects' })
  @ApiQuery({ name: 'city', required: false, enum: ['Mumbai', 'Thane'] })
  @ApiQuery({ name: 'builderId', required: false })
  @ApiQuery({ name: 'year', required: false, type: Number })
  getDelayAnalytics(
    @Query('city') city?: string,
    @Query('builderId') builderId?: string,
    @Query('year') year?: number,
  ) {
    return this.analyticsService.getDelayAnalytics(city, builderId, year ? +year : undefined)
  }

  @Get('grievances')
  @Public()
  @ApiOperation({ summary: 'Grievance analytics: top categories, 12-month trend, top projects' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'year', required: false, type: Number })
  getGrievanceAnalytics(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('year') year?: number,
  ) {
    return this.analyticsService.getGrievanceAnalytics(city, category, year ? +year : undefined)
  }

  @Get('builders/comparison')
  @Public()
  @ApiOperation({ summary: 'Side-by-side builder comparison (max 3 builders)' })
  @ApiQuery({ name: 'builderIds', required: true, description: 'Comma-separated builder IDs (max 3)' })
  compareBuilders(@Query('builderIds') builderIds: string) {
    const ids = builderIds.split(',').slice(0, 3).map((id) => id.trim())
    return this.analyticsService.compareBuilders(ids)
  }
}
