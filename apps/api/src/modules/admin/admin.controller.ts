import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { AdminService } from './admin.service'
import { GrievancesService } from '../grievances/grievances.service'
import { RERAService } from '../rera/rera.service'
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateBuilderDto,
  UpdateBuilderDto,
  CreateRedFlagDto,
} from './dto/admin.dto'
import { UpdateGrievanceStatusDto } from '../grievances/dto/grievances.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly grievancesService: GrievancesService,
    private readonly reraService: RERAService,
  ) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: '[Admin] Platform health dashboard stats' })
  getDashboard() {
    return this.adminService.getDashboardStats()
  }

  // ─── Project management ───────────────────────────────────────────────────

  @Get('projects')
  @ApiOperation({ summary: '[Admin] List all projects (published + unpublished)' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'builderId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listProjects(
    @Query('city') city?: string,
    @Query('builderId') builderId?: string,
    @Query('status') status?: string,
    @Query('isPublished') isPublished?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.listProjects(+page, +limit, {
      city,
      builderId,
      status,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
    })
  }

  @Post('projects')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Create a new project' })
  createProject(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.adminService.createProject(req.user.userId, dto)
  }

  @Patch('projects/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update project fields' })
  updateProject(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.adminService.updateProject(req.user.userId, id, dto)
  }

  @Post('projects/:id/publish')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Publish a project (make publicly visible)' })
  publishProject(@Request() req: any, @Param('id') id: string) {
    return this.adminService.publishProject(req.user.userId, id)
  }

  @Delete('projects/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Soft-delete (unpublish) a project' })
  deleteProject(@Request() req: any, @Param('id') id: string) {
    return this.adminService.deleteProject(req.user.userId, id)
  }

  // ─── Builder management ───────────────────────────────────────────────────

  @Get('builders')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] List all builders' })
  listBuilders(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.listBuilders(+page, +limit)
  }

  @Post('builders')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Create a new builder profile' })
  createBuilder(@Request() req: any, @Body() dto: CreateBuilderDto) {
    return this.adminService.createBuilder(req.user.userId, dto)
  }

  @Patch('builders/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Update a builder profile' })
  updateBuilder(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateBuilderDto) {
    return this.adminService.updateBuilder(req.user.userId, id, dto)
  }

  // ─── RERA Sync ────────────────────────────────────────────────────────────

  @Post('rera/sync/:projectId')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Trigger RERA data fetch from MahaRERA portal for review' })
  stageRERASyncFetch(@Param('projectId') projectId: string) {
    return this.reraService.stageFetch(projectId)
  }

  @Get('rera/sync/:projectId/staged')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Get staged RERA diff awaiting approval' })
  getStagedDiff(@Param('projectId') projectId: string) {
    const diff = this.reraService.getStagedDiff(projectId)
    if (!diff) {
      return { success: false, error: { code: 'NO_STAGED_DIFF', message: 'No staged diff — trigger sync first' } }
    }
    return { success: true, data: diff }
  }

  @Post('rera/sync/:projectId/approve')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Approve and commit staged RERA diff to database' })
  approveRERASync(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body() body: { note?: string; publishRedFlags?: boolean[] },
  ) {
    return this.reraService.commitStagedDiff(
      projectId,
      req.user.userId,
      body.note ?? '',
      body.publishRedFlags ?? [],
    )
  }

  // ─── Grievance management ─────────────────────────────────────────────────

  @Get('grievances')
  @ApiOperation({ summary: '[Admin] List all grievances with filters' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listGrievances(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('projectId') projectId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.grievancesService.adminListGrievances({ status, severity, projectId, page: +page, limit: +limit })
  }

  @Patch('grievances/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Update grievance status (acknowledge, escalate, resolve)' })
  updateGrievanceStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateGrievanceStatusDto,
  ) {
    return this.grievancesService.updateStatus(id, req.user.userId, dto)
  }

  // ─── Red Flags ────────────────────────────────────────────────────────────

  @Post('projects/:id/red-flags')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Create a red flag for a project' })
  createRedFlag(@Request() req: any, @Param('id') id: string, @Body() dto: CreateRedFlagDto) {
    return this.adminService.createRedFlag(req.user.userId, id, dto)
  }

  @Patch('projects/:id/red-flags/:flagId/resolve')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Mark a red flag as resolved' })
  resolveRedFlag(
    @Request() req: any,
    @Param('id') id: string,
    @Param('flagId') flagId: string,
    @Body() body: { resolutionNote: string },
  ) {
    return this.adminService.resolveRedFlag(req.user.userId, id, flagId, body.resolutionNote)
  }

  // ─── Buyer Verification ───────────────────────────────────────────────────

  @Get('verification/queue')
  @ApiOperation({ summary: '[Admin] Get pending buyer ownership verification requests' })
  getVerificationQueue(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getVerificationQueue(+page, +limit)
  }

  @Patch('verification/:linkId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Approve a buyer ownership verification' })
  approveVerification(@Request() req: any, @Param('linkId') linkId: string) {
    return this.adminService.approveVerification(req.user.userId, linkId)
  }

  @Patch('verification/:linkId/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Reject a buyer ownership verification' })
  rejectVerification(
    @Request() req: any,
    @Param('linkId') linkId: string,
    @Body() body: { reason: string },
  ) {
    return this.adminService.rejectVerification(req.user.userId, linkId, body.reason)
  }

  // ─── Moderation ────────────────────────────────────────────────────────────

  @Get('moderation/queue')
  @ApiOperation({ summary: '[Admin] Get content moderation queue (flagged posts)' })
  getModerationQueue(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getModerationQueue(+page, +limit)
  }

  @Patch('moderation/threads/:id/hide')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin/Moderator] Hide a forum thread' })
  hideThread(@Request() req: any, @Param('id') id: string) {
    return this.adminService.hideThread(req.user.userId, id)
  }

  @Patch('moderation/replies/:id/hide')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin/Moderator] Hide a forum reply' })
  hideReply(@Request() req: any, @Param('id') id: string) {
    return this.adminService.hideReply(req.user.userId, id)
  }

  // ─── Audit Log ────────────────────────────────────────────────────────────

  @Get('audit-log')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Immutable audit log of all admin actions' })
  getAuditLog(
    @Query('adminId') adminId?: string,
    @Query('actionType') actionType?: string,
    @Query('entityType') entityType?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.adminService.getAuditLog(+page, +limit, { adminId, actionType, entityType })
  }
}
