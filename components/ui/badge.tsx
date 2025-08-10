import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'secondary', ...props }: BadgeProps) {
  const variantClass =
    variant === 'default'
      ? 'bg-primary text-primary-foreground border-transparent'
      : variant === 'secondary'
        ? 'bg-secondary text-secondary-foreground border-transparent'
        : 'text-foreground'

  return <div className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variantClass, className)} {...props} />
}

export default Badge
