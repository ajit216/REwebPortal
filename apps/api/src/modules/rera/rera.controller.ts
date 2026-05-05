import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { RERAService } from './rera.service'

// Guards are defined in common/guards — wired up after those are created
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN)

@ApiTags('RERA')
@Controller()
export class RERAController {
  constructor(private readonly reraService: RERAService) {}

  // ─── Public endpoints ───────────────────────────────────────────────────────

  @Get('projects/:slug/rera')
  @ApiOperation({ summary: 'Get RERA compliance data for a project (public)' })
  async getProjectRERA(@Param('slug') slug: string) {
    // Returns the committed RERARecord — the staged diff is admin-only
    // TODO: delegate to RERAService once query methods are added
    return { data: null, message: 'RERA data endpoint — implementation pending' }
  }

  // ─── Admin endpoints (RERA Sync) ────────────────────────────────────────────

  @Post('admin/rera/sync/:projectId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Trigger RERA data fetch from MahaRERA portal' })
  async stageFetch(@Param('projectId') projectId: string) {
    const diff = await this.reraService.stageFetch(projectId)
    return {
      success: true,
      data: {
        projectId: diff.projectId,
        reraNumber: diff.reraNumber,
        changes: diff.changes,
        redFlagCandidates: diff.redFlagCandidates,
        fetched: diff.fetched,
        fetchedAt: diff.fetchedAt,
      },
    }
  }

  @Get('admin/rera/sync/:projectId/staged')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get currently staged RERA diff awaiting approval' })
  async getStagedDiff(@Param('projectId') projectId: string) {
    const diff = this.reraService.getStagedDiff(projectId)
    if (!diff) return { success: false, error: { code: 'NO_STAGED_DIFF', message: 'No staged diff found — trigger sync first' } }
    return { success: true, data: diff }
  }

  @Post('admin/rera/sync/:projectId/approve')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Approve and commit staged RERA diff to database' })
  async commitDiff(
    @Param('projectId') projectId: string,
    @Body() body: { adminUserId: string; note: string; publishRedFlags: boolean[] },
  ) {
    await this.reraService.commitStagedDiff(
      projectId,
      body.adminUserId,
      body.note,
      body.publishRedFlags ?? [],
    )
    return { success: true, data: { committed: true } }
  }
}
