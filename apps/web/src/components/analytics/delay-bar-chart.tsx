'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface DelayBarChartProps {
  data: Array<{ builderName: string; avgDelayMonths: number }>
}

export function DelayBarChart({ data }: DelayBarChartProps) {
  const sorted = [...data].sort((a, b) => b.avgDelayMonths - a.avgDelayMonths)

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 16, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
        <XAxis
          type="number"
          dataKey="avgDelayMonths"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94A3B8', fontSize: 11 }}
          label={{ value: 'Avg Delay (months)', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#94A3B8' }}
        />
        <YAxis
          type="category"
          dataKey="builderName"
          width={130}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#475569', fontSize: 11 }}
        />
        <Tooltip
          cursor={{ fill: '#F1F5F9' }}
          formatter={(value: number) => [`${value} months`, 'Avg Delay']}
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
        />
        <Bar dataKey="avgDelayMonths" radius={[0, 4, 4, 0]}>
          {sorted.map((entry, index) => (
            <Cell
              key={entry.builderName}
              fill={entry.avgDelayMonths >= 10 ? '#EF4444' : entry.avgDelayMonths >= 6 ? '#EAB308' : '#22C55E'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
