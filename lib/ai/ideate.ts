import { promises as fs } from 'node:fs'
import path from 'node:path'
import PQueue from 'p-queue'
import { leanCanvas } from './leanCanvas'
import { setStartup } from '../startups/setStartup'
import type { StartupDocInput } from '../startups/setStartup'
import { agenticServices } from './agenticServices'
import { storyBrand } from './storyBrand'
import { landingPage } from './landingPage'

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
  maxServicesPerMarket?: number
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
const STARTUPS_DIR = path.resolve(process.cwd(), 'startups')

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


function kebabCase(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base
  let i = 2
  while (true) {
    try {
      const filePath = path.join(STARTUPS_DIR, `${candidate}.mdx`)
      await fs.access(filePath)
      candidate = `${base}-${i}`
      i++
    } catch {
      return candidate
    }
  }
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

  const shuffledNaics = [...naicsRows].sort(() => Math.random() - 0.5)
  const shuffledOccs = [...occRows].sort(() => Math.random() - 0.5)
  
  const limitedNaics = typeof maxIndustries === 'number' ? shuffledNaics.slice(0, maxIndustries) : shuffledNaics
  const limitedOccs = typeof maxOccupations === 'number' ? shuffledOccs.slice(0, maxOccupations) : shuffledOccs

  const results: IdeatedIdea[] = []
  const queue = new PQueue({ concurrency: 20 })
  const taskPromises: Promise<void>[] = []

  console.log(`Starting ideation process...`)
  console.log(`Processing ${limitedNaics.length} industries and ${limitedOccs.length} occupations`)

  for (let industryIndex = 0; industryIndex < limitedNaics.length; industryIndex++) {
    const n = limitedNaics[industryIndex]
    console.log(`Processing industry ${industryIndex + 1}/${limitedNaics.length}: ${n.industry} (NAICS ${n.naics})`)
    const asResult = await agenticServices({
      industry: n.industry,
      additionalContext: additionalContext && additionalContext.length > 0 ? `Context: ${additionalContext}` : undefined,
    })
    const services = (asResult.object as { services?: Array<Record<string, unknown>> }).services ?? []
    console.log(`Generated ${services.length} services for ${n.industry}`)
    const limitedServices =
      typeof opts.maxServicesPerMarket === 'number' ? services.slice(0, opts.maxServicesPerMarket) : services

    for (let serviceIndex = 0; serviceIndex < limitedServices.length; serviceIndex++) {
      const svc = limitedServices[serviceIndex]
      taskPromises.push(queue.add(async () => {
        const title = String((svc as any).title ?? 'AI Service')
        const description = String((svc as any).description ?? '')
        const serviceIdea = `${title} — AI service for ${n.industry} (NAICS ${n.naics})`
        console.log(`  Processing service ${serviceIndex + 1}/${limitedServices.length}: ${title}`)
        const ctx = [
          additionalContext ? `Context: ${additionalContext}` : null,
          description ? `Service description: ${description}` : null,
        ]
          .filter(Boolean)
          .join('\n')

        console.log(`    Generating lean canvas for: ${title}`)
        const canvas = await leanCanvas(serviceIdea, ctx)
        console.log(`    Generating story brand for: ${title}`)
        const sb = await storyBrand(serviceIdea, ctx)
        console.log(`    Generating landing page for: ${title}`)
        const lp = await landingPage(serviceIdea, ctx)

        const businessName = canvas.object.businessName
        const baseSlug = kebabCase(businessName)
        const slug = persist ? await ensureUniqueSlug(baseSlug) : baseSlug
        results.push({ kind: 'industry', naics: n, canvas, slug })

        if (persist) {
          const frontmatter = {
            name: businessName,
            slug,
            naics: { primary: n.naics, occupations: [] as string[] },
            service: svc,
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
            storyBrand: (sb as any).object,
            landingPage: (lp as any).object,
          }
          const content = `# ${businessName}

Generated for NAICS ${n.naics} — ${n.industry}.
Service: ${title}
`
          const doc: StartupDocInput<typeof frontmatter> = { data: frontmatter, content }
          await setStartup(slug, doc)
          console.log(`    Saved startup: ${slug}`)
        }
      }))
    }
  }

  for (let occupationIndex = 0; occupationIndex < limitedOccs.length; occupationIndex++) {
    const o = limitedOccs[occupationIndex]
    console.log(`Processing occupation ${occupationIndex + 1}/${limitedOccs.length}: ${o.name} (${o.code})`)
    const asResult = await agenticServices({
      occupation: o.name,
      additionalContext: [
        additionalContext ? additionalContext : null,
        o.description ? `Occupation description: ${o.description}` : null,
      ]
        .filter(Boolean)
        .join('\n') || undefined,
    })
    const services = (asResult.object as { services?: Array<Record<string, unknown>> }).services ?? []
    console.log(`Generated ${services.length} services for ${o.name}`)
    const limitedServices =
      typeof opts.maxServicesPerMarket === 'number' ? services.slice(0, opts.maxServicesPerMarket) : services

    for (let serviceIndex = 0; serviceIndex < limitedServices.length; serviceIndex++) {
      const svc = limitedServices[serviceIndex]
      taskPromises.push(queue.add(async () => {
        const title = String((svc as any).title ?? 'AI Service')
        const description = String((svc as any).description ?? '')
        const serviceIdea = `${title} — AI copilot for ${o.name}`
        console.log(`  Processing service ${serviceIndex + 1}/${limitedServices.length}: ${title}`)
        const ctx = [
          additionalContext ? `Context: ${additionalContext}` : null,
          o.description ? `Occupation description: ${o.description}` : null,
          description ? `Service description: ${description}` : null,
        ]
          .filter(Boolean)
          .join('\n')

        console.log(`    Generating lean canvas for: ${title}`)
        const canvas = await leanCanvas(serviceIdea, ctx)
        console.log(`    Generating story brand for: ${title}`)
        const sb = await storyBrand(serviceIdea, ctx)
        console.log(`    Generating landing page for: ${title}`)
        const lp = await landingPage(serviceIdea, ctx)

        const businessName = canvas.object.businessName
        const baseSlug = kebabCase(businessName)
        const slug = persist ? await ensureUniqueSlug(baseSlug) : baseSlug
        results.push({ kind: 'occupation', occupation: o, canvas, slug })

        if (persist) {
          const frontmatter = {
            name: businessName,
            slug,
            naics: { primary: '', occupations: [o.name] },
            service: svc,
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
            storyBrand: (sb as any).object,
            landingPage: (lp as any).object,
          }
          const content = `# ${businessName}

Generated for Occupation ${o.code} — ${o.name}.
Service: ${title}
`
          const doc: StartupDocInput<typeof frontmatter> = { data: frontmatter, content }
          await setStartup(slug, doc)
          console.log(`    Saved startup: ${slug}`)
        }
      }))
    }
  }

  await Promise.all(taskPromises)
  console.log(`Ideation complete! Generated ${results.length} total ideas`)
  return results
}
