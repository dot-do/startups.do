import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('lib/ai/index integration', () => {
  it('can perform a minimal structured generation using the gateway', async () => {
    process.env.AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/functions-do'
    const { generateObject } = await import('ai')
    const { openai } = await import('./index')

    const result = await generateObject({
      model: openai.responses('gpt-5'),
      prompt: 'Return a JSON object for the given schema only. The field acknowledgement should be a short string.',
      schema: z.object({ acknowledgement: z.string() })
    })

    expect(result).toBeTruthy()
    expect(result.object).toBeTruthy()
    expect(typeof result.object.acknowledgement).toBe('string')
    expect(result.object.acknowledgement.length).toBeGreaterThan(0)
  })
})
