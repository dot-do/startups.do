import { describe, it, expect } from 'vitest'

describe('marketAnalysis integration', () => {
  it('produces market analysis with expected keys', async () => {
    const { marketAnalysis } = await import('./marketAnalysis')

    const result = await marketAnalysis('AI-powered contract review for SMBs', 'Keep numbers realistic.')
    const obj = result.object as Record<string, unknown>

    expect(obj).toBeTruthy()
    const marketSize = obj.marketSize as Record<string, unknown>
    expect(marketSize).toBeTruthy()
    expect(typeof marketSize.tam).toBe('string')
    expect(typeof marketSize.sam).toBe('string')
    expect(typeof marketSize.som).toBe('string')

    expect(Array.isArray(obj.targetCustomers as unknown[])).toBe(true)
    expect(Array.isArray(obj.competitors as unknown[])).toBe(true)
    expect(Array.isArray(obj.competitiveLandscape as unknown[])).toBe(true)
    expect(Array.isArray(obj.differentiation as unknown[])).toBe(true)
    expect(Array.isArray(obj.trends as unknown[])).toBe(true)
    expect(Array.isArray(obj.risks as unknown[])).toBe(true)
  })
})
