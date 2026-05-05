import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

export class ReviewVerificationDto {
  @IsBoolean()
  approved: boolean

  @IsString()
  @IsOptional()
  adminNote: string
}

export class ResolveRedFlagDto {
  @IsString()
  evidence: string
}

export class TogglePublishDto {
  @IsBoolean()
  isPublished: boolean
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ─────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: '[Admin] Platform health dashboard' })
  getDashboard() {
    return this.adminService.getDashboardStats()
  }

  // ─── Projects ──────────────────────────────────────────────────────────────

  @Get('projects')
  @ApiOperation({ summary: '[Admin] List all projects (published + unpublished)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false })
  listProjects(
    @Query('page') page?: string,
    @Query('q') q?: string,
  ) {
    return this.adminService.listProjects(page ? +page : 1, 20, q)
  }

  @Patch('projects/:id/publish')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Toggle project published status' })
  togglePublish(@Param('id') id: string, @Body() dto: TogglePublishDto) {
    return this.adminService.toggleProjectPublished(id, dto.isPublished)
  }

  // ─── Buyer Verifications ───────────────────────────────────────────────────

  @Get('verifications')
  @ApiOperation({ summary: '[Admin] List pending buyer verification requests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  listVerifications(@Query('page') page?: string) {
    return this.adminService.listPendingVerifications(page ? +page : 1)
  }

  @Post('verifications/:id/review')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Approve or reject a buyer verification request' })
  reviewVerification(
    @Param('id') id: string,
    @Body() dto: ReviewVerificationDto,
    @Request() req: any,
  ) {
    return this.adminService.reviewVerification(id, dto.approved, dto.adminNote ?? '', req.user.id)
  }

  // ─── Grievances ────────────────────────────────────────────────────────────

  @Get('grievances')
  @ApiOperation({ summary: '[Admin] List grievances with optional status filter' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  listGrievances(
    @Query('status') status?: string,
    @Query('page') page?: string,
  ) {
    return this.adminService.listGrievances(status, page ? +page : 1)
  }

  @Post('grievances/:id/acknowledge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Acknowledge a grievance' })
  acknowledgeGrievance(@Param('id') id: string, @Request() req: any) {
    return this.adminService.acknowledgeGrievance(id, req.user.id)
  }

  // ─── Red Flags ─────────────────────────────────────────────────────────────

  @Get('red-flags')
  @ApiOperation({ summary: '[Admin] List active red flags across all projects' })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  listRedFlags(@Query('active') active?: string) {
    return this.adminService.listRedFlags(active !== 'false')
  }

  @Post('red-flags/:id/resolve')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Mark a red flag as resolved' })
  resolveRedFlag(
    @Param('id') id: string,
    @Body() dto: ResolveRedFlagDto,
    @Request() req: any,
  ) {
    return this.adminService.resolveRedFlag(id, dto.evidence, req.user.id)
  }
}
