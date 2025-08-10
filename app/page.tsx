
import Navbar from '@/components/navbar'
import Hero from '@/components/hero' 
import StartupGrid from '@/components/startup-grid'
import type { StartupItem } from '@/types/startup'
import { listStartups, getStartup } from '@/lib/startups'

const PAGE_SIZE = 24

export default async function Home() {
  const slugs = await listStartups({ offset: 0, limit: PAGE_SIZE })

  const items: StartupItem[] = []
  for (const slug of slugs) {
    const doc = await getStartup<any>(slug)
    const name = (doc.data?.name as string) || slug
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

  return (
    <div className='min-h-svh bg-background text-foreground'>
      <Navbar githubUrl='https://github.com/dot-do/startups.do' />
      <main className='mx-auto px-4 max-w-screen-2xl'>
        <Hero title='Do Business-as-Code' subtitle='Build autonomous businesses. Deliver agentic workflows with Services-as-Software.' />
        <StartupGrid items={items} />
      </main>
    </div>
  )
}
