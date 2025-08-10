import * as React from 'react'
import type { StartupItem } from '@/types/startup'
import { StartupCard } from '@/components/startup-card'

export function StartupGrid({ items }: { items: StartupItem[] }) {
  return (
    <section className='mt-8'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6'>
        {items.map((item) => (
          <StartupCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default StartupGrid
