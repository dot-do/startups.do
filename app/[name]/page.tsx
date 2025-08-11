export const revalidate = 86400

import { Navbar } from '@/components/landing/navbar'
import { Hero1 } from '@/components/landing/hero-1'
import { Features2 } from '@/components/landing/features-2'
import { Pricing } from '@/components/landing/pricing'
import { Faq } from '@/components/landing/faqs'
import { Cta } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { getStartup, listStartups } from '@/lib/startups'
import type { StartupDoc } from '@/lib/startups'

import { generateLandingSections } from '@/lib/ai'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'

const cachedSectionsFor = (name: string, idea: string, ctx: string) =>
  unstable_cache(
    async () => generateLandingSections(idea, ctx),
    ['landing-sections', name],
    { revalidate }
  )()

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  let doc: StartupDoc<Record<string, unknown>>
  try {
    doc = await getStartup<Record<string, unknown>>(name)
  } catch {
    doc = { data: {} as Record<string, unknown>, content: '' }
  }

  const businessIdea =
    (doc.data?.['name'] as string) || `AI-powered startup called "${name}"`

  const additionalContext = [
    typeof (doc.data as any)?.tagline === 'string' ? `Tagline: ${(doc.data as any).tagline}` : null,
    typeof (doc.data as any)?.description === 'string' ? `Description: ${(doc.data as any).description}` : null,
    Array.isArray((doc.data as any)?.problem) ? `Problem:\n${((doc.data as any).problem as string[]).join('\n')}` : null,
    Array.isArray((doc.data as any)?.solution) ? `Solution:\n${((doc.data as any).solution as string[]).join('\n')}` : null
  ]
    .filter(Boolean)
    .join('\n')

  const sections = await cachedSectionsFor(name, businessIdea, additionalContext)

  return (
    <>
      <div className="mx-auto px-6 lg:px-8">
        <Navbar />
      </div>
      <Hero1 {...(sections.hero || {})} />
      <main className="mx-auto max-w-7xl px-6 lg:px-8">
        <section id="features">
          {/* <Features2 {...(sections.features2 || {})} /> */}
        </section>
        <section id="pricing">
          <Pricing {...(sections.pricing || {})} />
        </section>
        <Faq {...(sections.faq || {})} />
        <section id="contact">
          <Cta {...(sections.cta || {})} />
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  const names = await listStartups()
  return names.slice(0, 10).map((name) => ({ name }))
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params
  let title = name
  let desc = `Explore the AI-generated startup concept for ${title}`
  
  try {
    const doc = await getStartup<Record<string, unknown>>(name)
    // Get the actual startup name from the frontmatter
    const startupName = doc.data?.name as string
    if (startupName) {
      title = startupName
    }
    // Get tagline for description
    const tagline = (doc.data as any)?.tagline || (doc.data as any)?.service?.title
    if (tagline) {
      desc = tagline
    } else {
      desc = `Explore the AI-generated startup concept for ${title}`
    }
  } catch (error) {
    // If startup document not found, use the slug as fallback
    title = name.charAt(0).toUpperCase() + name.slice(1)
  }
  
  return {
    title,
    description: desc
  }
}
