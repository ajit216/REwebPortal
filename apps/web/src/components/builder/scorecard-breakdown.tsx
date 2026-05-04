'use client'

import { getScoreCircleColor, gradeLabel } from '@/lib/utils'
import type { BuilderScorecard } from '@rewebportal/types'
import { TransparencyScoreBadge } from '@/components/project/transparency-score-badge'

interface ScorecardBreakdownProps {
  scorecard: BuilderScorecard
}

const BREAKDOWN_LABELS: Record<string, string> = {
  reraCompliance: 'RERA Compliance',
  deliveryTrack: 'Delivery Track Record',
  grievanceRate: 'Grievance Rate',
  transparency: 'Information Transparency',
  buyerSentiment: 'Buyer Sentiment',
}

export function ScorecardBreakdown({ scorecard }: ScorecardBreakdownProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center gap-6 mb-6">
        <TransparencyScoreBadge score={scorecard.overallScore} grade={scorecard.grade} size="lg" showLabel />
        <div>
          <h3 className="font-heading text-lg font-semibold text-neutral-900">
            Transparency Scorecard
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Grade: <strong>{gradeLabel(scorecard.grade)}</strong> · Score: <strong>{scorecard.overallScore}/100</strong>
          </p>
          <p className="text-xs text-neutral-400 mt-1">Last updated: {scorecard.lastUpdated}</p>
        </div>
      </div>

      {/* Score Bars */}
      <div className="space-y-4">
        {(Object.entries(scorecard.breakdown) as [string, { score: number; weight: number }][]).map(
          ([key, val]) => {
            const color = getScoreCircleColor(val.score)
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">{BREAKDOWN_LABELS[key] ?? key}</span>
                    <span className="text-xs text-neutral-400">({val.weight}% weight)</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color }}>{val.score}/100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${val.score}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          }
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-500">
        ⚠️ Transparency scores are computed from publicly available RERA data and buyer-reported information. 
        They reflect data transparency and compliance patterns — not an editorial opinion or financial recommendation.
      </div>
    </div>
  )
}
