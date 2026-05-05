import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published projects with filters and pagination' })
  @ApiQuery({ name: 'city', required: false, enum: ['Mumbai', 'Thane'] })
  @ApiQuery({ name: 'locality', required: false })
  @ApiQuery({ name: 'status', required: false, description: 'Comma-separated ProjectStatus values' })
  @ApiQuery({ name: 'builderId', required: false })
  @ApiQuery({ name: 'minScore', required: false, type: Number })
  @ApiQuery({ name: 'hasRedFlags', required: false, type: Boolean })
  @ApiQuery({ name: 'bhkType', required: false, enum: ['1BHK', '2BHK', '3BHK', '4BHK'] })
  @ApiQuery({ name: 'priceMin', required: false, type: Number })
  @ApiQuery({ name: 'priceMax', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false, description: 'Full-text search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'score', 'delay', 'grievances', 'reraExpiry'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  findAll(
    @Query('city') city?: string,
    @Query('locality') locality?: string,
    @Query('status') status?: string,
    @Query('builderId') builderId?: string,
    @Query('minScore') minScore?: number,
    @Query('hasRedFlags') hasRedFlags?: string,
    @Query('bhkType') bhkType?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('q') q?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.projectsService.findAll({
      city,
      locality,
      status,
      builderId,
      minScore: minScore ? +minScore : undefined,
      hasRedFlags: hasRedFlags === 'true',
      bhkType,
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
      q,
      page: +page,
      limit: Math.min(+limit, 50),
      sortBy,
      sortOrder,
    })
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get project detail by slug' })
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug)
  }

  @Get(':slug/rera')
  @ApiOperation({ summary: 'Get RERA compliance data for a project' })
  getRERA(@Param('slug') slug: string) {
    return this.projectsService.getRERA(slug)
  }

  @Get(':slug/grievances')
  @ApiOperation({ summary: 'Get public grievance summary for a project (aggregated, no private details)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getGrievances(
    @Param('slug') slug: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.projectsService.getGrievances(slug, status, category, +page, +limit)
  }

  @Get(':slug/community/threads')
  @ApiOperation({ summary: 'Get community forum threads for a project' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['recent', 'popular'] })
  getThreads(
    @Param('slug') slug: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortBy') sortBy = 'recent',
  ) {
    return this.projectsService.getCommunityThreads(slug, +page, +limit, sortBy)
  }

  @Get(':slug/timeline')
  @ApiOperation({ summary: 'Get construction timeline and delay data for a project' })
  getTimeline(@Param('slug') slug: string) {
    return this.projectsService.getTimeline(slug)
  }

  @Get(':slug/analytics')
  @ApiOperation({ summary: 'Get per-project analytics: grievance breakdown and trends' })
  getAnalytics(@Param('slug') slug: string) {
    return this.projectsService.getAnalytics(slug)
  }
}
