'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
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

  const toSlug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const derivedHref = item.href ?? `/${toSlug(item.name)}`

  // Match Navbar's deterministic variant styling based on the URL segment (slug)
  const logoVariantIndex = React.useMemo(() => {
    const s = toSlug(item.name || '')
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
    return s ? h % 6 : 0
  }, [item.name])

  const baseLogoClass = 'uppercase font-normal tracking-[0.2em] text-[1.1em]'
  const logoVariants = [
    '',
    'normal-case font-thin tracking-[0] text-[1.9em]',
    'normal-case font-bold tracking-[-0.05em] text-[1.7em]',
    'font-mono uppercase tracking-[0.3em] text-[1.15em]',
    'normal-case italic underline-offset-4 tracking-[0.05em] text-[1.4em]',
    'bg-gradient-to-r from-primary to-primary/40 text-transparent bg-clip-text font-extrabold tracking-tight text-[1.6em]',
  ]
  const nameClass = cn(baseLogoClass, logoVariants[logoVariantIndex])

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    if (derivedHref && isCoarse && !revealed) {
      e.preventDefault()
      setRevealed(true)
      onReveal?.(item.id)
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (!derivedHref) return
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).click()
    }
  }

  const handleMouseLeave = () => setRevealed(false)

  return (
    <Link
      href={derivedHref}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
      className='group group/item block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md'
      aria-label={item.ariaLabel || item.name}
    >
      <Card className='relative min-h-[260px] rounded-md border bg-card/60 transition-colors hover:bg-card overflow-hidden motion-safe:group-hover:scale-[1.01] motion-reduce:transition-none'>
        {/* randomized text effect */}
        <div className='absolute inset-0 flex items-center justify-center p-4 text-center'>
          <div className={nameClass}>{item.name}</div>
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
    </Link>
  )
}

export default StartupCard
