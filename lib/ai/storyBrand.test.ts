import { describe, it, expect } from 'vitest'

describe('storyBrand integration', () => {
  it('generates StoryBrand content matching the expected shape', async () => {
    process.env.AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/functions-do'
    const { storyBrand } = await import('./storyBrand')

    const result = await storyBrand('A productivity app for teams', 'Keep it concise.')
    const obj = result.object as Record<string, unknown>

    expect(obj).toBeTruthy()
    expect(typeof obj.character).toBe('string')
    expect(typeof obj.problem).toBe('string')
    expect(typeof obj.guide).toBe('string')
    expect(typeof obj.plan).toBe('string')
    expect(typeof obj.callToAction).toBe('string')
    expect(typeof obj.success).toBe('string')
    expect(typeof obj.failure).toBe('string')
  })
})
