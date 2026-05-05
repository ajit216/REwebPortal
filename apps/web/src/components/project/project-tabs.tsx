'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RERAStatusCard } from '@/components/project/rera-status-card'
import { TimelineChart } from '@/components/project/timeline-chart'
import { ThreadCard } from '@/components/community/thread-card'
import { GrievanceDonutChart } from '@/components/grievance/grievance-donut-chart'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Flag, Shield } from 'lucide-react'
import type { RERARecord, ProjectTimeline, Thread, GrievanceCategorySummary } from '@rewebportal/types'

interface ProjectTabsProps {
  projectSlug: string
  reraRecord?: RERARecord
  timeline: ProjectTimeline[]
  threads: Thread[]
  openGrievances: number
  grievanceCategorySummary: GrievanceCategorySummary[]
  totalGrievances?: number
}

export function ProjectTabs({
  projectSlug,
  reraRecord,
  timeline,
  threads,
  openGrievances,
  grievanceCategorySummary,
  totalGrievances,
}: ProjectTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <div className="overflow-x-auto">
        <TabsList className="flex w-max gap-1 mb-6 bg-neutral-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rera">RERA & Compliance</TabsTrigger>
          <TabsTrigger value="community">Community Forum</TabsTrigger>
          <TabsTrigger value="grievances">Grievances</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          Project details, unit types, location, and quick actions are displayed in the section above.
          Use the other tabs to explore RERA compliance, community discussions, grievances, and construction timeline.
        </div>
      </TabsContent>

      <TabsContent value="rera">
        {reraRecord ? (
          <RERAStatusCard reraRecord={reraRecord} />
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
            <p>RERA data for this project is being collected.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="community">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-neutral-900">Community Forum</h2>
            <Button asChild>
              <Link href="/login?next=/community/new">Post a Thread</Link>
            </Button>
          </div>
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} projectSlug={projectSlug} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="grievances">
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-heading text-base font-semibold text-neutral-900">
                Grievance Summary
              </h2>
              <Button asChild>
                <Link href="/login?next=/grievances/new">
                  <Flag className="h-4 w-4" />
                  File a Grievance
                </Link>
              </Button>
            </div>
            <GrievanceDonutChart
              data={grievanceCategorySummary}
              totalCount={totalGrievances ?? openGrievances}
              openCount={openGrievances}
            />
          </div>

          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 flex items-start gap-3">
            <Shield className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-neutral-600">
              Grievance descriptions and evidence are private — only visible to the filer and platform admins.
              Only aggregated patterns are shown publicly to protect buyer privacy while maintaining transparency.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="timeline">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-6">
            Construction Milestones
          </h2>
          {timeline.length > 0 ? (
            <TimelineChart milestones={timeline} />
          ) : (
            <p className="text-sm text-neutral-500">Timeline data not yet available for this project.</p>
          )}
          <div className="mt-6">
            <DataDisclaimer lastUpdated="28 Apr 2025" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
