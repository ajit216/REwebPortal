'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        destructive: 'bg-danger-500 text-white hover:bg-danger-700',
        outline: 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100',
        secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        ghost: 'text-neutral-800 hover:bg-neutral-100',
        link: 'text-primary-500 underline-offset-4 hover:underline',
        success: 'bg-success-500 text-white hover:bg-success-700',
        warning: 'bg-warning-500 text-white hover:bg-warning-700',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        default: 'px-5 py-2.5',
        lg: 'px-8 py-3.5 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
