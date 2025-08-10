import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function badgeVariants({ variant = 'secondary' }: { variant?: 'default' | 'secondary' | 'outline' } = {}) {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium'
  const variantClass =
    variant === 'default'
      ? 'bg-primary text-primary-foreground border-transparent'
      : variant === 'secondary'
        ? 'bg-secondary text-secondary-foreground border-transparent'
        : 'text-foreground'
  return cn(base, variantClass)
}

export function Badge({ className, variant = 'secondary', ...props }: BadgeProps) {
  const classes = badgeVariants({ variant })

  return <div className={cn(classes, className)} {...props} />
}

export default Badge
