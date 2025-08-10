import path from 'node:path'
import { promises as fs } from 'node:fs'
import matter from 'gray-matter'

export type StartupDoc<T = Record<string, unknown>> = {
  data: T
  content: string
}

const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')

export async function getStartup<T = Record<string, unknown>>(slug: string): Promise<StartupDoc<T>> {
  const filePath = path.join(STARTUPS_DIR, `${slug}.mdx`)
  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf8')
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException
    if (e && e.code === 'ENOENT') {
      throw new Error(`Startup MDX not found: ${filePath}`)
    }
    throw err
  }

  try {
    const parsed = matter(raw)
    return { data: parsed.data as T, content: parsed.content }
  } catch (e: unknown) {
    const msg = (e as Error)?.message ?? String(e)
    throw new Error(`Failed to parse frontmatter for ${filePath}: ${msg}`)
  }
}
