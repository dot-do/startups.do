import { createDevinSession } from '../lib/devin'

async function main() {
  const apiKey = process.env.DEVIN_API_KEY
  if (!apiKey || apiKey.trim().length === 0) {
    console.error('Error: DEVIN_API_KEY is required in process.env')
    process.exitCode = 1
    return
  }

  try {
    const res = await createDevinSession({
      prompt: 'Health check: please acknowledge this test session.'
    })

    if (!res?.session_id || !res?.url) {
      console.error('Error: Unexpected response from createDevinSession', res)
      process.exitCode = 1
      return
    }

    console.log('Success: Devin session created')
    console.log(`session_id=${res.session_id}`)
    console.log(`url=${res.url}`)
    if (typeof res.is_new_session === 'boolean') {
      console.log(`is_new_session=${res.is_new_session}`)
    }
  } catch (err) {
    const anyErr = err as { status?: number; message?: string; code?: string } | unknown
    if (anyErr && typeof anyErr === 'object' && ('status' in anyErr || 'message' in anyErr)) {
      const e = anyErr as { status?: number; message?: string; code?: string }
      const status = e.status ?? 0
      const code = e.code ? ` code=${e.code}` : ''
      console.error(`API Error: status=${status}${code} message=${e.message ?? 'Unknown error'}`)
    } else {
      console.error('Error:', anyErr)
    }
    process.exitCode = 1
  }
}

void main()
