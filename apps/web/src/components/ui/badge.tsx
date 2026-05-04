'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 bg-neutral-100 text-neutral-800',
        success: 'border-success-500 bg-success-50 text-success-700',
        warning: 'border-warning-500 bg-warning-50 text-warning-700',
        danger: 'border-danger-500 bg-danger-50 text-danger-700',
        info: 'border-info-500 bg-info-50 text-info-700',
        verified: 'border-success-500 bg-success-50 text-success-700',
        outline: 'border-current bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
