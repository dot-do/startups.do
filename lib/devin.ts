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
      (body?.message as string | undefined) ||
      (body?.error as string | undefined) ||
      (body?.reason as string | undefined) ||
      res.statusText ||
      'Request failed'

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
