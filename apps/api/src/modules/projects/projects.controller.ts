import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published projects with optional filters' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city (Mumbai|Thane)' })
  @ApiQuery({ name: 'status', required: false, description: 'Comma-separated ProjectStatus values' })
  @ApiQuery({ name: 'q', required: false, description: 'Full-text search query' })
  @ApiQuery({ name: 'builderId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('city') city?: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('builderId') builderId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.projectsService.findAll({ city, status, q, builderId, page: +page, limit: +limit })
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single project by slug' })
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug)
  }
}
