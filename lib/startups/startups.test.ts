import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { getStartup } from './getStartup'
import { setStartup } from './setStartup'

const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')
const tmpSlug = 'tmp-devin-test'

async function cleanupTmp() {
  const file = path.join(STARTUPS_DIR, `${tmpSlug}.mdx`)
  try {
    await fs.unlink(file)
  } catch {}
}

beforeEach(async () => {
  await cleanupTmp()
})

afterEach(async () => {
  await cleanupTmp()
})

describe('getStartup', () => {
  it('reads the sample startup and returns data and content', async () => {
    const doc = await getStartup('acme-claims')
    expect(doc).toBeTruthy()
    expect(typeof doc.content).toBe('string')
    expect(doc.content.length).toBeGreaterThan(0)
    expect(doc.data).toBeTypeOf('object')
  })

  it('throws on missing file', async () => {
    await expect(getStartup('does-not-exist')).rejects.toThrow(/not found/i)
  })
})

describe('setStartup', () => {
  it('writes and reads back the same data and content', async () => {
    const payload = {
      data: { name: 'TmpCo', tagline: 'We test MDX', features: ['a', 'b'] },
      content: '# Hello\n\nThis is a test.'
    }
    await setStartup(tmpSlug, payload)
    const readBack = await getStartup<typeof payload.data>(tmpSlug)
    expect(readBack.content.trim()).toBe(payload.content.trim())
    expect(readBack.data).toEqual(payload.data)
  })

  it('fails when frontmatter is invalid YAML on read', async () => {
    const bad = `---
name: "Broken
---
Content`
    const file = path.join(STARTUPS_DIR, 'invalid-yaml.mdx')
    await fs.mkdir(STARTUPS_DIR, { recursive: true })
    await fs.writeFile(file, bad, 'utf8')
    await expect(getStartup('invalid-yaml')).rejects.toThrow(/parse frontmatter/i)
    await fs.unlink(file)
  })
})
