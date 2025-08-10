import { dump as yamlDump } from 'js-yaml'

const DEVIN_API_BASE = 'https://api.devin.ai/v1'

export type CreateDevinSessionParams = {
  prompt: string
  snapshot_id?: string | null
  unlisted?: boolean | null
  idempotent?: boolean
  max_acu_limit?: number
  secret_ids?: string[]
  knowledge_ids?: string[]
  tags?: string[]
  title?: string
}

export type CreateDevinSessionResponse = {
  session_id: string
  url: string
  is_new_session?: boolean
}

type DevinApiError = {
  status: number
  message: string
  code?: string
  details?: unknown
}

function getAuthToken(): string {
  const token = process.env.DEVIN_API_KEY
  if (!token) {
    throw { status: 0, message: 'DEVIN_API_KEY is required' } as DevinApiError
  }
  return token
}

export async function createDevinSession(params: CreateDevinSessionParams, init?: RequestInit): Promise<CreateDevinSessionResponse> {
  const token = getAuthToken()
  const url = `${DEVIN_API_BASE}/sessions`

  const mergedHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined)
  }

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      ...init,
      headers: mergedHeaders,
      body: JSON.stringify(params)
    })
  } catch (e) {
    const err = e as Error
    throw { status: 0, message: err.message } as DevinApiError
  }

  const text = await res.text()
  let data: unknown = undefined
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    data = undefined
  }

  if (!res.ok) {
    const body = (data && typeof data === 'object' ? (data as Record<string, unknown>) : undefined) || undefined
    const message =
      (body?.message as string | undefined) || (body?.error as string | undefined) || (body?.reason as string | undefined) || res.statusText || 'Request failed'

    const error: DevinApiError = {
      status: res.status,
      message,
      code: (body?.code as string | undefined) || undefined,
      details: data
    }
    throw error
  }

  const body = data && typeof data === 'object' ? (data as Record<string, unknown>) : undefined
  const sessionId = body?.session_id
  const urlVal = body?.url
  const isNew = body?.is_new_session

  if (!body || typeof sessionId !== 'string' || typeof urlVal !== 'string') {
    throw { status: res.status, message: 'Unexpected response from Devin API', details: data } as DevinApiError
  }

  return {
    session_id: sessionId,
    url: urlVal,
    is_new_session: typeof isNew === 'boolean' ? isNew : undefined
  }
}

/**
 * Creates a Devin session to create or update an MDX file for a startup at `startups/[startupName].mdx`.
 *
 * If `context` is an object, it will be stringified to YAML and included as the file's frontmatter.
 * If `context` is a string, it will be included as freeform context within the prompt instructions.
 *
 * Example:
 *   await createStartupDevinSession('acme-claims', {
 *     name: 'Acme Claims',
 *     domain: 'acmeclaims.com',
 *     summary: 'AI-native claims processing and subrogation for P&C carriers.'
 *   })
 *
 * @param startupName - The name/slug used to build the path `startups/[startupName].mdx`.
 * @param context - Either a string to pass verbatim in the prompt, or an object to convert to YAML frontmatter.
 * @returns Devin session response with `session_id`, `url`, and `is_new_session`.
 */

export async function createStartupDevinSession(startupName: string, context: string | Record<string, unknown>): Promise<CreateDevinSessionResponse> {
  const filePath = `startups/${startupName}.mdx`

  const isStringContext = typeof context === 'string'
  const yamlFrontmatter = !isStringContext ? yamlDump((context as Record<string, unknown>) ?? {}, { lineWidth: 120 }).trim() : ''
  const freeformContext = isStringContext ? String(context).trim() : ''

  const parts: string[] = []
  parts.push(`Create or update the MDX file at "${filePath}".`)
  parts.push(`The file must be valid MDX and include YAML frontmatter when provided.`)
  parts.push('')
  parts.push(`File: ${filePath}`)

  if (yamlFrontmatter.length > 0) {
    parts.push('---')
    parts.push(yamlFrontmatter)
    parts.push('---')
    parts.push('')
    parts.push('After the frontmatter, include relevant MDX content sections as appropriate.')
  } else if (freeformContext.length > 0) {
    parts.push('')
    parts.push('Context:')
    parts.push(freeformContext)
    parts.push('')
    parts.push('Use the context above to create or update the MDX file. If applicable, include YAML frontmatter between --- markers.')
  }

  parts.push('')
  parts.push('Notes:')
  parts.push('- If the file already exists, update it without losing meaningful data.')
  parts.push('- Keep the structure consistent with other files in the startups/ directory.')

  const prompt = parts.join('\n')

  return createDevinSession({
    prompt,
    title: `Startup: ${startupName}`,
    tags: ['startup', 'mdx', 'frontmatter']
  })
}
