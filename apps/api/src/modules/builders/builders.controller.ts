import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { BuildersService } from './builders.service'

@ApiTags('Builders')
@Controller('builders')
export class BuildersController {
  constructor(private readonly buildersService: BuildersService) {}

  @Get()
  @ApiOperation({ summary: 'List all builders with optional filters' })
  @ApiQuery({ name: 'transparencyGrade', required: false, enum: ['A_PLUS', 'A', 'B', 'C', 'D'] })
  @ApiQuery({ name: 'q', required: false, description: 'Search by name' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['score', 'projects', 'name'] })
  findAll(
    @Query('transparencyGrade') transparencyGrade?: string,
    @Query('q') q?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.buildersService.findAll({
      transparencyGrade,
      q,
      page: +page,
      limit: Math.min(+limit, 50),
      sortBy,
    })
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get builder detail by slug' })
  findOne(@Param('slug') slug: string) {
    return this.buildersService.findBySlug(slug)
  }

  @Get(':slug/projects')
  @ApiOperation({ summary: 'Get all projects by a builder' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getProjects(
    @Param('slug') slug: string,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.buildersService.getProjects(slug, status, +page, +limit)
  }

  @Get(':slug/scorecard')
  @ApiOperation({ summary: 'Get transparency scorecard breakdown for a builder' })
  getScorecard(@Param('slug') slug: string) {
    return this.buildersService.getScorecard(slug)
  }
}
