import { promises as fs } from 'node:fs'
import path from 'node:path'
import { leanCanvas } from './leanCanvas'
import { setStartup } from '../startups/setStartup'
import type { StartupDocInput } from '../startups/setStartup'

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
  additionalContext?: string
  persist?: boolean
}

export type IdeatedIdea =
  | {
      kind: 'industry'
      naics: NaicsRow
      canvas: Awaited<ReturnType<typeof leanCanvas>>
      slug: string
    }
  | {
      kind: 'occupation'
      occupation: OccupationRow
      canvas: Awaited<ReturnType<typeof leanCanvas>>
      slug: string
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

type Frontmatter = {
  name: string
  slug: string
  naics: { primary: string; occupations: string[] }
  leanCanvas: {
    problem: string[]
    solution: string[]
    uniqueValueProp: string
    unfairAdvantage: string
    customerSegments: string[]
    channels: string[]
    revenueStreams: string[]
    costStructure: string[]
    keyMetrics: string[]
  }
}

function kebabCase(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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
    additionalContext,
    persist = true,
  } = opts

  const [naicsTxt, occsTxt] = await Promise.all([fs.readFile(naicsPath, 'utf8'), fs.readFile(occupationsPath, 'utf8')])

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

  for (const n of limitedNaics) {
    const idea = `AI-native solutions for the ${n.industry} industry (NAICS ${n.naics})`
    const canvas = await leanCanvas(
      idea,
      additionalContext && additionalContext.length > 0 ? `Context: ${additionalContext}` : undefined
    )
    const businessName = canvas.object.businessName
    const slug = `${n.naics}-${kebabCase(businessName)}`
    results.push({ kind: 'industry', naics: n, canvas, slug })

    if (persist) {
      const frontmatter = {
        name: businessName,
        slug,
        naics: { primary: n.naics, occupations: [] as string[] },
        leanCanvas: {
          problem: canvas.object.problemStatement,
          solution: canvas.object.solution,
          uniqueValueProp: canvas.object.uniqueValueProposition,
          unfairAdvantage: canvas.object.unfairAdvantage,
          customerSegments: canvas.object.customerSegments,
          channels: canvas.object.channels,
          revenueStreams: canvas.object.revenueStreams,
          costStructure: canvas.object.costStructure,
          keyMetrics: canvas.object.keyMetrics,
        },
      }
      const content = `# ${businessName}

Generated from NAICS ${n.naics} — ${n.industry}.
`
      const doc: StartupDocInput<Frontmatter> = { data: frontmatter, content }
      await setStartup(slug, doc)
    }
  }

  for (const o of limitedOccs) {
    const idea = `AI-native copilot for ${o.name}`
    const ctxParts = []
    if (additionalContext) ctxParts.push(additionalContext)
    if (o.description) ctxParts.push(`Occupation description: ${o.description}`)
    const canvas = await leanCanvas(idea, ctxParts.length ? ctxParts.join('\n') : undefined)
    const businessName = canvas.object.businessName
    const slug = `${o.code}-${kebabCase(businessName)}`
    results.push({ kind: 'occupation', occupation: o, canvas, slug })

    if (persist) {
      const frontmatter = {
        name: businessName,
        slug,
        naics: { primary: '', occupations: [o.name] },
        leanCanvas: {
          problem: canvas.object.problemStatement,
          solution: canvas.object.solution,
          uniqueValueProp: canvas.object.uniqueValueProposition,
          unfairAdvantage: canvas.object.unfairAdvantage,
          customerSegments: canvas.object.customerSegments,
          channels: canvas.object.channels,
          revenueStreams: canvas.object.revenueStreams,
          costStructure: canvas.object.costStructure,
          keyMetrics: canvas.object.keyMetrics,
        },
      }
      const content = `# ${businessName}

Generated from Occupation ${o.code} — ${o.name}.
`
      const doc: StartupDocInput<Frontmatter> = { data: frontmatter, content }
      await setStartup(slug, doc)
    }
  }

  return results
}
