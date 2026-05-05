'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { grievanceCategoryLabel } from '@/lib/utils'
import type { GrievanceCategorySummary } from '@rewebportal/types'

interface GrievanceDonutChartProps {
  data: GrievanceCategorySummary[]
  totalCount: number
  openCount: number
}

const COLORS = ['#EF4444', '#EAB308', '#0EA5E9', '#22C55E', '#F97316', '#A855F7', '#64748B', '#EC4899', '#06B6D4']

export function GrievanceDonutChart({ data, totalCount, openCount }: GrievanceDonutChartProps) {
  const chartData = data.map((item, i) => ({
    name: grievanceCategoryLabel(item.category),
    value: item.count,
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-full sm:w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2">
          {data.map((item, i) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span className="text-neutral-700 text-xs">{grievanceCategoryLabel(item.category)}</span>
                </div>
                <span className="text-xs text-neutral-500">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-neutral-100 text-sm">
        <div>
          <p className="text-xs text-neutral-500">Total Filed</p>
          <p className="font-heading font-bold text-neutral-900">{totalCount}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Open</p>
          <p className="font-heading font-bold text-danger-600">{openCount}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Resolved</p>
          <p className="font-heading font-bold text-success-600">{totalCount - openCount}</p>
        </div>
      </div>
    </div>
  )
}
