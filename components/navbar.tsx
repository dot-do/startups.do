import * as React from 'react'
import { Github } from 'lucide-react'

export function Navbar({ githubUrl }: { githubUrl: string }) {
  return (
    <nav className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-4'>
        <div className='text-sm font-medium'>Startups.do</div>
        <a
          href={githubUrl}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='GitHub'
          className='inline-flex h-9 w-9 items-center justify-center rounded-md border text-foreground/80 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <Github aria-hidden className='h-4 w-4' />
        </a>
      </div>
    </nav>
  )
}

export default Navbar
