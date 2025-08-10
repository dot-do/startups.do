import path from 'node:path'
import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import yaml from 'js-yaml'

export type StartupDocInput<T = Record<string, unknown>> = {
  data: T
  content: string
}

const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')

export async function setStartup<T = Record<string, unknown>>(slug: string, doc: StartupDocInput<T>): Promise<void> {
  const filePath = path.join(STARTUPS_DIR, `${slug}.mdx`)
  await fs.mkdir(STARTUPS_DIR, { recursive: true })
  const fileContents = matter.stringify(doc.content, doc.data as Record<string, unknown>, {
    language: 'yaml',
    engines: {
      yaml: {
        parse: (input: string) => (yaml.load(input) as Record<string, unknown>),
        stringify: (obj: unknown) => yaml.dump(obj as Record<string, unknown>, { lineWidth: 120 })
      }
    }
  })
  await fs.writeFile(filePath, fileContents, 'utf8')
}
