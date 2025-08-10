import { Suspense } from 'react'
import { StartupContent } from '@/components/startup-content'
import { StartupSkeleton } from '@/components/startup-skeleton'

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  return (
    <Suspense fallback={<StartupSkeleton />}>
      <StartupContent name={name} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  
  return {
    title: `${name} - AI Generated Startup`,
    description: `Explore the AI-generated startup concept for ${name}`,
  }
}
