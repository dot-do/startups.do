import { describe, it, expect } from 'vitest'

describe('agenticServices integration', () => {
  it('generates a list of AI-deliverable service workflows with expected keys', async () => {
    const { agenticServices } = await import('./agenticServices')

    const result = await agenticServices({ industry: 'Insurance', occupation: 'Claims Adjuster', additionalContext: 'Keep it concise.' })
    const obj = result.object as { services?: Array<Record<string, unknown>> }

    expect(obj).toBeTruthy()
    expect(Array.isArray(obj.services)).toBe(true)
    expect(obj.services!.length).toBeGreaterThan(0)

    const svc = obj.services![0]
    expect(typeof svc.title).toBe('string')
    expect(typeof svc.description).toBe('string')
    expect(Array.isArray(svc.steps)).toBe(true)
  })
})
