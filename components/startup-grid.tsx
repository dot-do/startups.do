'use client'

import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { StartupItem } from '@/types/startup'
import { StartupCard } from '@/components/startup-card'

type Props = {
  initialItems: StartupItem[]
  pageSize?: number
}

export function StartupGrid({ initialItems, pageSize = 24 }: Props) {
  const [items, setItems] = useState<StartupItem[]>(initialItems)
  const [offset, setOffset] = useState<number>(initialItems.length)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetch(`/api/startups?offset=${offset}&limit=${pageSize}`)
      if (!res.ok) throw new Error('Failed to load startups')
      const data = await res.json()
      const newItems: StartupItem[] = data.items || []
      setItems(prev => [...prev, ...newItems])
      setOffset(data.nextOffset ?? offset + newItems.length)
      setHasMore(Boolean(data.hasMore))
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, offset, pageSize])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          loadMore()
        }
      }
    }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore])

  return (
    <section className='mt-8'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6'>
        {items.map((item) => (
          <StartupCard key={`${item.id}-${item.name}`} item={item} />
        ))}
      </div>
      <div ref={sentinelRef} className='h-10' />
      {!hasMore && (
        <div className='text-center text-muted-foreground text-sm py-4'>No more results</div>
      )}
    </section>
  )
}

export default StartupGrid
