import path from 'node:path'
import { promises as fs } from 'node:fs'

const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')

type ListOpts = {
  offset?: number
  limit?: number
}

function hashSeed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return h >>> 0
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleSeeded<T>(arr: T[], seedStr: string): T[] {
  const prng = mulberry32(hashSeed(seedStr))
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function listStartups(opts: ListOpts = {}): Promise<string[]> {
  const { offset = 0, limit = 24 } = opts
  try {
    const files = await fs.readdir(STARTUPS_DIR)
    const mdxFiles = files.filter((f) => f.endsWith('.mdx'))
    const slugs = mdxFiles.map((file) => path.basename(file, '.mdx'))

    const todaySeed = new Date().toISOString().slice(0, 10)
    const shuffled = shuffleSeeded(slugs, todaySeed)

    const sliced = shuffled.slice(offset, offset + limit)
    return sliced
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException
    if (e && e.code === 'ENOENT') {
      throw new Error(`Startups directory not found: ${STARTUPS_DIR}`)
    }
    throw err
  }
}
