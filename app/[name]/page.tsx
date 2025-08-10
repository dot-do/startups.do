import { getStartup } from '@/lib/startups'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  try {
    const doc = await getStartup(name)
    const data = doc.data as Record<string, unknown>

    return (
      <main className="container mx-auto max-w-3xl py-8 space-y-4">
        <h1 className="text-3xl font-semibold">{(data?.['name'] as string) ?? name}</h1>
        {data && data['domain'] ? <p className="text-gray-500">{String(data['domain'])}</p> : null}
        <section className="prose">
          <h2>Frontmatter</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <h2>Content</h2>
          <pre>{doc.content}</pre>
        </section>
      </main>
    )
  } catch {
    notFound()
  }
}
