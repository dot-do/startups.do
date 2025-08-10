import { describe, it, expect } from 'vitest'

describe('leanCanvas integration', () => {
  it('generates a Lean Canvas with expected keys', async () => {
    process.env.AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/functions-do'
    const { leanCanvas } = await import('./leanCanvas')

    const result = await leanCanvas('A B2B service for automated compliance audits', 'Keep outputs concise.')
    const obj = result.object as Record<string, unknown>

    expect(obj).toBeTruthy()
    expect(typeof obj.businessName).toBe('string')
    expect(Array.isArray(obj.problemStatement as unknown[])).toBe(true)
    expect(Array.isArray(obj.customerSegments as unknown[])).toBe(true)
    expect(typeof obj.uniqueValueProposition).toBe('string')
    expect(Array.isArray(obj.solution as unknown[])).toBe(true)
    expect(Array.isArray(obj.keyFeatures as unknown[])).toBe(true)
    expect(Array.isArray(obj.channels as unknown[])).toBe(true)
    expect(Array.isArray(obj.revenueStreams as unknown[])).toBe(true)
    expect(Array.isArray(obj.costStructure as unknown[])).toBe(true)
    expect(Array.isArray(obj.keyMetrics as unknown[])).toBe(true)
    expect(Array.isArray(obj.keyPartners as unknown[])).toBe(true)
    expect(Array.isArray(obj.keyActivities as unknown[])).toBe(true)
    expect(Array.isArray(obj.keyResources as unknown[])).toBe(true)
    expect(typeof obj.unfairAdvantage).toBe('string')
    expect(typeof obj.marketSize).toBe('string')
    expect(Array.isArray(obj.competitiveAnalysis as unknown[])).toBe(true)
  })
})
