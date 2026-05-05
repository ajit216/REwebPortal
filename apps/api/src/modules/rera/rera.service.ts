import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { PrismaService } from '../../prisma/prisma.service'
import * as cheerio from 'cheerio'
import { firstValueFrom } from 'rxjs'

export interface RERAFetchResult {
  reraNumber: string
  status: string
  registrationDate: string | null
  originalExpiryDate: string | null
  currentExpiryDate: string | null
  promoterName: string | null
  worksDonePercentage: number | null
  carpetAreaSoldPct: number | null
  violations: string[]
}

export interface RERAStagedDiff {
  projectId: string
  reraNumber: string
  fetched: RERAFetchResult
  current: Partial<RERAFetchResult> | null
  changes: Array<{ field: string; from: string | null; to: string | null }>
  redFlagCandidates: Array<{
    flagType: string
    severity: 'WARNING' | 'CRITICAL'
    title: string
    description: string
  }>
  fetchedAt: Date
}

@Injectable()
export class RERAService {
  private readonly logger = new Logger(RERAService.name)

  // In-memory staged diffs awaiting admin approval
  // In production at scale, persist to Redis with TTL
  private stagedDiffs = new Map<string, RERAStagedDiff>()

  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Fetch live RERA data from MahaRERA portal for a project.
   * Returns a staged diff for admin review — nothing committed to DB yet.
   */
  async stageFetch(projectId: string): Promise<RERAStagedDiff> {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: {
        reraRecords: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    const reraNumber = project.reraNumber
    this.logger.log(`Fetching MahaRERA data for RERA number: ${reraNumber}`)

    const url = `https://maharera.mahaonline.gov.in/Modules/PublicUser/Registration/Project_Detail/${reraNumber}`

    let html = ''
    try {
      const response = await firstValueFrom(
        this.http.get<string>(url, { responseType: 'text' })
      )
      html = response.data
    } catch (err) {
      this.logger.error(`Failed to fetch MahaRERA page for ${reraNumber}`, err)
      throw new Error(`MahaRERA fetch failed: ${(err as Error).message}`)
    }

    const fetched = this.parseRERAHtml(html, reraNumber)
    const current = project.reraRecords[0] ?? null

    const changes = this.computeDiff(current, fetched)
    const redFlagCandidates = this.detectRedFlags(fetched, project)

    const diff: RERAStagedDiff = {
      projectId,
      reraNumber,
      fetched,
      current: current
        ? {
            reraNumber: current.reraNumber,
            status: current.status,
            currentExpiryDate: current.currentExpiryDate?.toISOString() ?? null,
            worksDonePercentage: current.worksDonePercentage ?? null,
            carpetAreaSoldPct: current.carpetAreaSoldPct ?? null,
          }
        : null,
      changes,
      redFlagCandidates,
      fetchedAt: new Date(),
    }

    this.stagedDiffs.set(projectId, diff)
    return diff
  }

  /**
   * Commit the staged diff to the database after admin approval.
   */
  async commitStagedDiff(
    projectId: string,
    adminUserId: string,
    note: string,
    publishRedFlags: boolean[],
  ): Promise<{ committed: boolean }> {
    const diff = this.stagedDiffs.get(projectId)
    if (!diff) throw new Error('No staged RERA diff found for this project. Please re-trigger sync.')

    const { fetched } = diff

    await this.prisma.$transaction(async (tx) => {
      // Upsert RERARecord
      await tx.rERARecord.upsert({
        where: {
          projectId_reraNumber: { projectId, reraNumber: fetched.reraNumber },
        },
        create: {
          projectId,
          reraNumber: fetched.reraNumber,
          status: fetched.status as any,
          registrationDate: fetched.registrationDate
            ? new Date(fetched.registrationDate)
            : new Date(),
          originalExpiryDate: fetched.originalExpiryDate
            ? new Date(fetched.originalExpiryDate)
            : new Date(),
          currentExpiryDate: fetched.currentExpiryDate
            ? new Date(fetched.currentExpiryDate)
            : new Date(),
          promoterName: fetched.promoterName ?? '',
          worksDonePercentage: fetched.worksDonePercentage,
          carpetAreaSoldPct: fetched.carpetAreaSoldPct,
          lastSyncedAt: new Date(),
          syncedByAdminId: adminUserId,
        },
        update: {
          status: fetched.status as any,
          currentExpiryDate: fetched.currentExpiryDate
            ? new Date(fetched.currentExpiryDate)
            : undefined,
          worksDonePercentage: fetched.worksDonePercentage,
          carpetAreaSoldPct: fetched.carpetAreaSoldPct,
          lastSyncedAt: new Date(),
          syncedByAdminId: adminUserId,
        },
      })

      // Create approved red flags
      for (let i = 0; i < diff.redFlagCandidates.length; i++) {
        if (publishRedFlags[i]) {
          const candidate = diff.redFlagCandidates[i]
          await tx.projectRedFlag.create({
            data: {
              projectId,
              flagType: candidate.flagType,
              severity: candidate.severity,
              title: candidate.title,
              description: candidate.description,
              isActive: true,
            },
          })
        }
      }

      // Log admin action
      await tx.adminAction.create({
        data: {
          adminId: adminUserId,
          actionType: 'RERA_SYNC_COMMITTED',
          entityType: 'Project',
          entityId: projectId,
          notes: note,
          metadata: {
            reraNumber: fetched.reraNumber,
            changesCount: diff.changes.length,
          },
        },
      })
    })

    this.logger.log(`RERA sync committed for project ${projectId} by admin ${adminUserId}`)
    this.stagedDiffs.delete(projectId)

    return { committed: true }
  }

  getStagedDiff(projectId: string): RERAStagedDiff | undefined {
    return this.stagedDiffs.get(projectId)
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private parseRERAHtml(html: string, reraNumber: string): RERAFetchResult {
    const $ = cheerio.load(html)

    const getText = (selector: string): string | null => {
      const text = $(selector).first().text().trim()
      return text.length > 0 ? text : null
    }

    const parseDate = (raw: string | null): string | null => {
      if (!raw) return null
      const parts = raw.split('/')
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString()
      }
      return null
    }

    const parsePercent = (raw: string | null): number | null => {
      if (!raw) return null
      const num = parseFloat(raw.replace('%', '').trim())
      return isNaN(num) ? null : num
    }

    // NOTE: Selectors are illustrative. MahaRERA portal HTML must be inspected
    // and selectors updated to match the live DOM structure.
    return {
      reraNumber,
      status: getText('.rera-status-label') ?? 'REGISTERED',
      registrationDate: parseDate(getText('.rera-reg-date')),
      originalExpiryDate: parseDate(getText('.rera-original-expiry')),
      currentExpiryDate: parseDate(getText('.rera-current-expiry')),
      promoterName: getText('.rera-promoter-name'),
      worksDonePercentage: parsePercent(getText('.rera-works-done')),
      carpetAreaSoldPct: parsePercent(getText('.rera-carpet-sold')),
      violations: [],
    }
  }

  private computeDiff(
    current: any | null,
    fetched: RERAFetchResult,
  ): Array<{ field: string; from: string | null; to: string | null }> {
    const changes: Array<{ field: string; from: string | null; to: string | null }> = []
    const fields: Array<keyof RERAFetchResult> = [
      'status',
      'currentExpiryDate',
      'worksDonePercentage',
      'carpetAreaSoldPct',
    ]

    for (const field of fields) {
      const fromVal = current ? String(current[field] ?? '') : null
      const toVal = String(fetched[field] ?? '')
      if (fromVal !== toVal) {
        changes.push({ field, from: fromVal, to: toVal })
      }
    }

    return changes
  }

  private detectRedFlags(
    fetched: RERAFetchResult,
    project: any,
  ): RERAStagedDiff['redFlagCandidates'] {
    const candidates: RERAStagedDiff['redFlagCandidates'] = []

    if (fetched.status === 'LAPSED') {
      candidates.push({
        flagType: 'rera_lapsed',
        severity: 'CRITICAL',
        title: 'RERA Registration Lapsed',
        description: `This project's RERA registration (${fetched.reraNumber}) has lapsed and has not been renewed. Buyers have legal rights under Section 18 of RERA.`,
      })
    }

    if (fetched.status === 'EXTENDED') {
      candidates.push({
        flagType: 'rera_extended',
        severity: 'WARNING',
        title: 'RERA Extension Obtained — Revised Deadline Applies',
        description: `The builder has obtained a RERA extension. The revised completion deadline is now ${fetched.currentExpiryDate ?? 'updated'}.`,
      })
    }

    return candidates
  }
}
