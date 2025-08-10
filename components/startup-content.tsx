import { MDXRemote } from 'next-mdx-remote-client/rsc'
import { generateStartup } from '@/lib/ai/generateStartup'
import { getStartup } from '@/lib/startups/getStartup'
import { Hero } from './hero'

const components = {
  Hero,
}

export async function StartupContent({ name }: { name: string }) {
  let doc
  
  try {
    doc = await getStartup(name)
  } catch {
    doc = await generateStartup(name)
  }

  const data = doc.data as Record<string, unknown>

  return (
    <main className="container mx-auto max-w-3xl py-8 space-y-4">
      <Hero 
        title={(data?.['name'] as string) ?? name}
        subtitle={(data?.hero as any)?.subtitle ?? 'AI-generated startup'}
      />
      
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={doc.content} components={components} />
      </div>
      
      {data && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            View Generated Data
          </summary>
          <pre className="mt-2 text-xs bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </main>
  )
}
