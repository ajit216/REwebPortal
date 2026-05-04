'use client'

import { getScoreCircleColor, gradeLabel } from '@/lib/utils'
import type { TransparencyGrade } from '@rewebportal/types'
import { cn } from '@/lib/utils'

interface TransparencyScoreBadgeProps {
  score: number
  grade: TransparencyGrade
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeConfig = {
  sm: { outer: 48, inner: 36, text: 'text-xs', label: 'text-xs' },
  md: { outer: 72, inner: 56, text: 'text-sm', label: 'text-sm' },
  lg: { outer: 104, inner: 82, text: 'text-xl', label: 'text-sm' },
}

export function TransparencyScoreBadge({
  score,
  grade,
  size = 'md',
  showLabel = false,
}: TransparencyScoreBadgeProps) {
  const cfg = sizeConfig[size]
  const color = getScoreCircleColor(score)
  const circumference = 2 * Math.PI * ((cfg.outer - 8) / 2)
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
        <svg
          width={cfg.outer}
          height={cfg.outer}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={(cfg.outer - 8) / 2}
            stroke="#E2E8F0"
            strokeWidth={6}
            fill="none"
          />
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={(cfg.outer - 8) / 2}
            stroke={color}
            strokeWidth={6}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold font-heading leading-none', cfg.text)} style={{ color }}>
            {gradeLabel(grade)}
          </span>
          <span className="text-[10px] text-neutral-500 leading-none mt-0.5">{score}</span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-neutral-500 font-medium', cfg.label)}>Score</span>
      )}
    </div>
  )
}
