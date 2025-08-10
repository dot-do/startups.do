import { describe, it, expect } from 'vitest'

describe('storyBrand integration', () => {
  it('generates StoryBrand content matching the expected shape', async () => {
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
