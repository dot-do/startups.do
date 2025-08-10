import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const EXCLUDED_SUBDOMAINS = new Set(['www'])

function getHost(req: NextRequest): string {
  const host = req.headers.get('host') || req.nextUrl.hostname
  return host.split(':')[0]
}

function extractSubdomain(host: string): string | null {
  if (host.endsWith('.localhost')) {
    const parts = host.split('.')
    if (parts.length >= 2) {
      const sub = parts.slice(0, -1).join('.')
      return EXCLUDED_SUBDOMAINS.has(sub) ? null : sub
    }
    return null
  }

  const parts = host.split('.')
  if (parts.length <= 2) {
    return null
  }
  const sub = parts[0]
  if (!sub || EXCLUDED_SUBDOMAINS.has(sub)) {
    return null
  }
  return sub
}

export function middleware(req: NextRequest) {
  const host = getHost(req)
  const sub = extractSubdomain(host)

  if (!sub) {
    return NextResponse.next()
  }

  const { pathname, search } = req.nextUrl

  if (pathname.startsWith(`/${sub}/`) || pathname === `/${sub}`) {
    return NextResponse.next()
  }

  const url = new URL(req.url)
  url.pathname = `/${sub}${pathname}`
  url.search = search

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|images|fonts).*)'],
}
