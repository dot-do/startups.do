import path from 'node:path'
import { promises as fs } from 'node:fs'

const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')

type ListOpts = {
  offset?: number
  limit?: number
}

export async function listStartups(opts: ListOpts = {}): Promise<string[]> {
  const { offset = 0, limit = 24 } = opts
  try {
    const files = await fs.readdir(STARTUPS_DIR)
    const mdxFiles = files.filter((f) => f.endsWith('.mdx'))

    const withStats = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(STARTUPS_DIR, file)
        const stat = await fs.stat(filePath)
        return { slug: path.basename(file, '.mdx'), mtimeMs: stat.mtimeMs }
      })
    )

    const sorted = withStats.sort((a, b) => b.mtimeMs - a.mtimeMs)
    const sliced = sorted.slice(offset, offset + limit)
    return sliced.map((x) => x.slug)
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException
    if (e && e.code === 'ENOENT') {
      throw new Error(`Startups directory not found: ${STARTUPS_DIR}`)
    }
    throw err
  }
}
