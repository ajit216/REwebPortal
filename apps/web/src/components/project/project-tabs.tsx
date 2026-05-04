'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RERAStatusCard } from '@/components/project/rera-status-card'
import { TimelineChart } from '@/components/project/timeline-chart'
import { ThreadCard } from '@/components/community/thread-card'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Flag } from 'lucide-react'
import type { RERARecord, ProjectTimeline, Thread, GrievanceCategorySummary } from '@rewebportal/types'

interface ProjectTabsProps {
  projectSlug: string
  reraRecord?: RERARecord
  timeline: ProjectTimeline[]
  threads: Thread[]
  openGrievances: number
  grievanceCategorySummary: GrievanceCategorySummary[]
}

export function ProjectTabs({
  projectSlug,
  reraRecord,
  timeline,
  threads,
  openGrievances,
  grievanceCategorySummary,
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
        {/* Placeholder — overview content rendered server-side in parent */}
        <p className="text-sm text-neutral-500">See project details above.</p>
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
            <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
              Grievance Summary — {openGrievances} Open Complaints
            </h2>
            <div className="space-y-3">
              {grievanceCategorySummary.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-neutral-700 font-medium">
                      {item.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-neutral-500">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Grievance descriptions are private. Only aggregated patterns are shown publicly.
            </p>
            <Button asChild>
              <Link href="/login?next=/grievances/new">
                <Flag className="h-4 w-4" />
                File a Grievance
              </Link>
            </Button>
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
