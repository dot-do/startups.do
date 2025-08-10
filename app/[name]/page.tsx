import { Suspense } from 'react'
import { StartupContent } from '@/components/startup-content'
import { StartupSkeleton } from '@/components/startup-skeleton'
import { Navbar } from '@/components/landing/navbar'
import { Hero1 } from '@/components/landing/hero-1'
import { Features2 } from '@/components/landing/features-2'
import { Pricing } from '@/components/landing/pricing'
import { Faq } from '@/components/landing/faqs'
import { Cta } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  return (
    <>
      <div className="mx-auto px-6 lg:px-8">
        <Navbar />
      </div>
      <Hero1 />
      <main className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* <Suspense fallback={<StartupSkeleton />}>
          <StartupContent name={name} />
        </Suspense> */}
        <section id="features">
          <Features2 />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <Faq />
        <section id="contact">
          <Cta />
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  
  return {
    title: `${name} - AI Generated Startup`,
    description: `Explore the AI-generated startup concept for ${name}`,
  }
}
