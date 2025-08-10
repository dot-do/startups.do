import path from 'node:path'
import { promises as fs } from 'node:fs'

const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')

export async function listStartups(): Promise<string[]> {
  try {
    const files = await fs.readdir(STARTUPS_DIR)
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => path.basename(file, '.mdx'))
      .sort()
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException
    if (e && e.code === 'ENOENT') {
      throw new Error(`Startups directory not found: ${STARTUPS_DIR}`)
    }
    throw err
  }
}
