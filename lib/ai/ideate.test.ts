import { describe, it, expect } from 'vitest'
import { subdomainName } from './ideate'

function isValidSubdomain(name: string) {
  const regex = /^(?!-)(?!.*--)[a-z0-9-]{1,20}(?<!-)$/
  if (!regex.test(name)) return false
  const dashCount = (name.match(/-/g) || []).length
  return dashCount <= 1
}

describe('subdomainName', () => {
  it('generates lowercase alphanumeric with optional single dash', () => {
    const out = subdomainName('ClaimSpark')
    expect(isValidSubdomain(out)).toBe(true)
  })

  it('prefers concise single-token names', () => {
    const out = subdomainName('Omni Copilot AI')
    expect(out.length).toBeLessThanOrEqual(12)
    expect(isValidSubdomain(out)).toBe(true)
  })

  it('combines short leading tokens when helpful', () => {
    const out = subdomainName('AI Variable Rate Seeding')
    expect(out.length).toBeLessThanOrEqual(12)
    expect(isValidSubdomain(out)).toBe(true)
  })

  it('removes punctuation and normalizes separators', () => {
    const out = subdomainName('Acme—Claims!! 2025')
    expect(isValidSubdomain(out)).toBe(true)
  })

  it('compresses long tokens via vowel removal', () => {
    const out = subdomainName('Supercalifragilisticexpialidocious')
    expect(out.length).toBeLessThanOrEqual(12)
    expect(isValidSubdomain(out)).toBe(true)
  })

  it('handles empty/invalid input', () => {
    const out = subdomainName('---')
    expect(out).toBe('x')
  })

  it('limits to at most one dash', () => {
    const out = subdomainName('Next Gen Startup Builder Pro Max Ultra')
    expect(isValidSubdomain(out)).toBe(true)
    const dashCount = (out.match(/-/g) || []).length
    expect(dashCount).toBeLessThanOrEqual(1)
  })

  it('never has leading or trailing dashes or consecutive dashes', () => {
    const out = subdomainName('-alpha--beta-')
    expect(isValidSubdomain(out)).toBe(true)
  })
})
