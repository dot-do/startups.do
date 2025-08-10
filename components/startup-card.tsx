'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { StartupItem } from '@/types/startup'

export function StartupCard({ item, onReveal }: { item: StartupItem; onReveal?: (id: string) => void }) {
  const [revealed, setRevealed] = useState(false)
  const [isCoarse, setIsCoarse] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCoarse(window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)
    }
  }, [])

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    if (item.href && isCoarse && !revealed) {
      e.preventDefault()
      setRevealed(true)
      onReveal?.(item.id)
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (!item.href) return
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).click()
    }
  }

  const handleMouseLeave = () => setRevealed(false)

  const Wrapper: any = item.href ? 'a' : 'div'
  const wrapperProps: any = item.href
    ? { href: item.href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': item.ariaLabel || item.name }
    : { role: 'button', tabIndex: 0, 'aria-label': item.ariaLabel || item.name }

  return (
    <Wrapper onClick={handleClick} onKeyDown={handleKeyDown} onMouseLeave={handleMouseLeave} className='group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md' {...wrapperProps}>
      <Card className='relative min-h-[160px] rounded-md border bg-card/60 transition-colors hover:bg-card overflow-hidden motion-safe:group-hover:scale-[1.01] motion-reduce:transition-none'>    
        
        {/* add dynamic text effect */}
        <div className='absolute inset-0 flex items-center justify-center p-4 text-center'>
          <div className='text-sm font-medium'>{item.name}</div>
        </div>

        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-background/95 p-4 text-center backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100',
            revealed && 'opacity-100 pointer-events-auto'
          )}
        >
          <p
            className='text-sm text-muted-foreground'
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}
          >
            {item.description}
          </p>
          <Badge variant='secondary' className='uppercase'>
            {item.category}
          </Badge>
        </div>
      </Card>
    </Wrapper>
  )
}

export default StartupCard
