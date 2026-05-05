import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Platform-wide statistics snapshot' })
  getStats() {
    return this.analyticsService.getPlatformStats()
  }

  @Get('delays/by-builder')
  @ApiOperation({ summary: 'Delay metrics per builder, sorted by avg delay' })
  getDelaysByBuilder() {
    return this.analyticsService.getDelaysByBuilder()
  }

  @Get('grievances/trends')
  @ApiOperation({ summary: 'Grievance filing trends by month' })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Lookback window in months (default 12)' })
  getGrievanceTrends(@Query('months') months?: string) {
    return this.analyticsService.getGrievanceTrends(months ? +months : 12)
  }

  @Get('scores/distribution')
  @ApiOperation({ summary: 'Distribution of transparency grades across all projects' })
  getScoreDistribution() {
    return this.analyticsService.getScoreDistribution()
  }
}
