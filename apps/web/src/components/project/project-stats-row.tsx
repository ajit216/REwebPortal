import { Building, Clock, Flag, Users } from 'lucide-react'

interface ProjectStatsRowProps {
  totalUnits: number
  delayMonths: number
  openGrievances: number
  verifiedBuyerCount: number
}

export function ProjectStatsRow({
  totalUnits,
  delayMonths,
  openGrievances,
  verifiedBuyerCount,
}: ProjectStatsRowProps) {
  const stats = [
    {
      icon: Building,
      label: 'Total Units',
      value: totalUnits.toLocaleString('en-IN'),
      color: 'text-info-500',
      bg: 'bg-info-50',
    },
    {
      icon: Clock,
      label: 'Delay',
      value: delayMonths > 0 ? `${delayMonths} mo.` : 'On Time',
      color: delayMonths > 0 ? 'text-danger-500' : 'text-success-500',
      bg: delayMonths > 0 ? 'bg-danger-50' : 'bg-success-50',
    },
    {
      icon: Flag,
      label: 'Open Grievances',
      value: openGrievances.toString(),
      color: openGrievances > 20 ? 'text-danger-500' : openGrievances > 5 ? 'text-warning-500' : 'text-success-500',
      bg: openGrievances > 20 ? 'bg-danger-50' : openGrievances > 5 ? 'bg-warning-50' : 'bg-success-50',
    },
    {
      icon: Users,
      label: 'Verified Buyers',
      value: verifiedBuyerCount.toString(),
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-xl border border-neutral-200 bg-white p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
            </div>
          </div>
          <p className={`text-xl font-bold font-heading ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
