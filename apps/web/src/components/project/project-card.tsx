import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Flag, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TransparencyScoreBadge } from './transparency-score-badge'
import { RedFlagAlert } from './red-flag-alert'
import { statusLabel, statusVariant, formatPriceRange } from '@/lib/utils'
import type { Project, RedFlag } from '@rewebportal/types'

interface ProjectCardProps {
  project: Project
  redFlags?: RedFlag[]
}

export function ProjectCard({ project, redFlags = [] }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-primary-200 transition-all overflow-hidden"
      aria-label={`View ${project.name} project details`}
    >
      {/* Cover Image */}
      <div className="relative h-44 bg-neutral-200 overflow-hidden">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={`${project.name} project image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            <span className="text-sm">No image</span>
          </div>
        )}
        {/* Overlaid badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <Badge variant={statusVariant(project.status)}>
            {statusLabel(project.status)}
          </Badge>
          {project.transparencyScore !== null && project.transparencyGrade !== null && (
            <TransparencyScoreBadge
              score={project.transparencyScore}
              grade={project.transparencyGrade}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-base text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-sm text-neutral-500 mt-0.5">by {project.builderName}</p>

        <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{project.locality}, {project.city}</span>
        </div>

        {/* Stats Row */}
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${project.delayMonths > 0 ? 'text-danger-600' : 'text-success-600'}`}>
            <Clock className="h-3 w-3" aria-hidden="true" />
            {project.delayMonths > 0 ? `${project.delayMonths}mo delay` : 'On time'}
          </span>
          {project.openGrievances > 0 && (
            <span className={`flex items-center gap-1 ${project.openGrievances > 20 ? 'text-danger-600' : 'text-warning-600'}`}>
              <Flag className="h-3 w-3" aria-hidden="true" />
              {project.openGrievances} complaints
            </span>
          )}
        </div>

        {/* Red Flags compact */}
        {redFlags.length > 0 && (
          <div className="mt-3">
            <RedFlagAlert flags={redFlags} compact />
          </div>
        )}

        {/* Price */}
        <p className="mt-3 text-sm font-semibold text-neutral-700">
          {formatPriceRange(project.priceRangeLow, project.priceRangeHigh)}
        </p>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-xs text-neutral-400">{project.reraNumber}</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-primary-500 group-hover:gap-2 transition-all">
            View Project <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
