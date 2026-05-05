import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { BuildersService } from './builders.service'

@ApiTags('Builders')
@Controller('builders')
export class BuildersController {
  constructor(private readonly buildersService: BuildersService) {}

  @Get()
  @ApiOperation({ summary: 'List all builders with optional search' })
  @ApiQuery({ name: 'q', required: false, description: 'Search by builder name' })
  findAll(@Query('q') q?: string) {
    return this.buildersService.findAll(q)
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get builder profile with all projects' })
  findOne(@Param('slug') slug: string) {
    return this.buildersService.findBySlug(slug)
  }

  @Get(':slug/scorecard')
  @ApiOperation({ summary: 'Get transparency scorecard for a builder' })
  getScorecard(@Param('slug') slug: string) {
    return this.buildersService.getScorecard(slug)
  }
}
