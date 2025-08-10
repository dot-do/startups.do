import { describe, it, expect } from 'vitest'

describe('productRequirementsDocument integration', () => {
  it('creates a PRD with expected structure', async () => {
    process.env.AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/functions-do'
    const { productRequirementsDocument } = await import('./productRequirementsDocument')

    const result = await productRequirementsDocument('A mobile app for micro-learning', 'Focus on MVP scope.')
    const obj = result.object as Record<string, unknown>

    expect(obj).toBeTruthy()
    expect(typeof obj.summary).toBe('string')
    expect(Array.isArray(obj.objectives as unknown[])).toBe(true)
    expect(Array.isArray(obj.scopeMVP as unknown[])).toBe(true)
    expect(Array.isArray(obj.nonFunctionalRequirements as unknown[])).toBe(true)
    expect(Array.isArray(obj.successMetrics as unknown[])).toBe(true)
    expect(Array.isArray(obj.assumptions as unknown[])).toBe(true)
    expect(Array.isArray(obj.outOfScope as unknown[])).toBe(true)
  })
})
