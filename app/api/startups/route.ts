import { NextResponse } from 'next/server'
import { listStartups, getStartup } from '@/lib/startups'
import type { StartupItem } from '@/types/startup'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const offset = Number(searchParams.get('offset') || '0')
  const limit = Number(searchParams.get('limit') || '24')

  const slugs = await listStartups({ offset, limit })

  const items: StartupItem[] = []
  for (const slug of slugs) {
    const doc = await getStartup<any>(slug)
    const rawName = (doc.data?.name as string) || slug
    const baseName = (rawName.split(/[-–—]/)[0] || rawName).trim()
    const name = baseName.split(/[\s-]+/).slice(0, 4).join(' ')
    const description =
      (doc.data?.description as string) ||
      (doc.data?.service?.description as string) ||
      ''
    const category = (doc.data?.category as string) || 'service'

    items.push({
      id: slug,
      name,
      description,
      category,
    })
  }

  const next = await listStartups({ offset: offset + slugs.length, limit: 1 })
  const hasMore = next.length > 0

  return NextResponse.json({
    items,
    nextOffset: offset + slugs.length,
    hasMore,
  })
}
