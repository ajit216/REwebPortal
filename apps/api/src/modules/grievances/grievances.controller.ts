import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { GrievancesService } from './grievances.service'
import { CreateGrievanceDto, UpdateGrievanceStatusDto } from './dto/grievances.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('Grievances')
@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Get('project/:projectId/summary')
  @Public()
  @ApiOperation({ summary: 'Get aggregated grievance summary for a project (public, no private details)' })
  getProjectSummary(@Param('projectId') projectId: string) {
    return this.grievancesService.getProjectSummary(projectId)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'File a new grievance (auth required)' })
  create(@Request() req: any, @Body() dto: CreateGrievanceDto) {
    return this.grievancesService.create(req.user.userId, dto)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's grievances" })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMyGrievances(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.grievancesService.getMyGrievances(req.user.userId, status, +page, +limit)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a grievance by ID (owner or admin only)' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.grievancesService.findOne(id, req.user.userId, req.user.role)
  }

  @Patch(':id/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upvote a grievance (verified buyer of same project only)' })
  upvote(@Request() req: any, @Param('id') id: string) {
    return this.grievancesService.upvote(id, req.user.userId)
  }
}
