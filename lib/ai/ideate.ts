import { promises as fs } from 'node:fs'
import path from 'node:path'
import { leanCanvas } from './leanCanvas'

type NaicsRow = { naics: string; industry: string }
type OccupationRow = { code: string; name: string; description: string; displayLevel: string; selectable: string; sortSequence: string }

export type IdeateOptions = {
  naicsPath?: string
  occupationsPath?: string
  naicsMinDepth?: number
  naicsMaxDepth?: number
  occupationSelectableOnly?: boolean
  maxIndustries?: number
  maxOccupations?: number
  maxIdeas?: number
  additionalContext?: string
}

export type IdeatedIdea = {
  naics: NaicsRow
  occupation: OccupationRow
  canvas: Awaited<ReturnType<typeof leanCanvas>>
}

const DEFAULT_NAICS = path.resolve(process.cwd(), 'datasets', 'naics.tsv')
const DEFAULT_OCCS = path.resolve(process.cwd(), 'datasets', 'occupations.tsv')

function parseTsv<T = Record<string, string>>(text: string): T[] {
  const lines = text.split(/\r?\n/).filter(l => l.length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split('\t')
  const rows = lines.slice(1).map(line => {
    const cols = line.split('\t')
    const obj: Record<string, string> = {}
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i].trim()] = (cols[i] ?? '').trim()
    }
    return obj as T
  })
  return rows
}

export async function ideate(opts: IdeateOptions = {}): Promise<IdeatedIdea[]> {
  const {
    naicsPath = DEFAULT_NAICS,
    occupationsPath = DEFAULT_OCCS,
    naicsMinDepth = 2,
    naicsMaxDepth = 6,
    occupationSelectableOnly = true,
    maxIndustries,
    maxOccupations,
    maxIdeas,
    additionalContext,
  } = opts

  const [naicsTxt, occsTxt] = await Promise.all([
    fs.readFile(naicsPath, 'utf8'),
    fs.readFile(occupationsPath, 'utf8'),
  ])

  const naicsRows = parseTsv<NaicsRow>(naicsTxt).filter(r => {
    const len = r.naics ? r.naics.length : 0
    return len >= naicsMinDepth && len <= naicsMaxDepth
  })

  const occRows = parseTsv<OccupationRow>(occsTxt).filter(r => {
    return occupationSelectableOnly ? r.selectable === 'T' : true
  })

  const limitedNaics = typeof maxIndustries === 'number' ? naicsRows.slice(0, maxIndustries) : naicsRows
  const limitedOccs = typeof maxOccupations === 'number' ? occRows.slice(0, maxOccupations) : occRows

  const results: IdeatedIdea[] = []
  let total = 0

  for (const n of limitedNaics) {
    for (const o of limitedOccs) {
      if (typeof maxIdeas === 'number' && total >= maxIdeas) break
      const idea = `${o.name} solutions for ${n.industry} (NAICS ${n.naics})`
      const ctxParts = []
      if (additionalContext) ctxParts.push(additionalContext)
      if (o.description) ctxParts.push(`Occupation description: ${o.description}`)
      const ctx = ctxParts.join('\n')
      const canvas = await leanCanvas(idea, ctx.length > 0 ? ctx : undefined)
      results.push({ naics: n, occupation: o, canvas })
      total++
    }
    if (typeof maxIdeas === 'number' && total >= maxIdeas) break
  }

  return results
}
