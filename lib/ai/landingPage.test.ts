import { describe, it, expect } from 'vitest'

describe('landingPage integration', () => {
  it('generates landing page blocks with expected structure', async () => {
    process.env.AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/functions-do'
    const { landingPage } = await import('./landingPage')

    const result = await landingPage('A SaaS for automated invoices', 'Short, actionable copy.')
    const obj = result.object as Record<string, unknown>

    expect(obj).toBeTruthy()
    const hero = obj.hero as Record<string, unknown>
    expect(hero).toBeTruthy()
    expect(typeof hero.title).toBe('string')
    expect(typeof hero.subtitle).toBe('string')
    expect(typeof hero.ctaText).toBe('string')
    expect(typeof hero.ctaHref).toBe('string')

    expect(Array.isArray(obj.problem as unknown[])).toBe(true)
    expect(Array.isArray(obj.solution as unknown[])).toBe(true)
    expect(Array.isArray(obj.features as unknown[])).toBe(true)
    expect(Array.isArray(obj.steps as unknown[])).toBe(true)
  })
})
