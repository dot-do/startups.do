import { ideate } from '../lib/ai/ideate'

async function main() {
  const res = await ideate({
    maxIndustries: 1,
    maxOccupations: 1,
    occupationSelectableOnly: true,
    naicsMinDepth: 6,
    naicsMaxDepth: 6,
    persist: false,
  })
  console.log('Generated ideas:', res.length)
  const sample = res[0]
  if (sample) {
    const base = {
      kind: sample.kind,
      businessName: sample.canvas.object.businessName,
      uniqueValueProposition: sample.canvas.object.uniqueValueProposition,
      slug: (sample as any).slug,
    }
    if (sample.kind === 'industry') {
      console.log('Sample:', {
        ...base,
        industry: `${(sample as any).naics.naics} ${(sample as any).naics.industry}`,
      })
    } else {
      console.log('Sample:', {
        ...base,
        occupation: `${(sample as any).occupation.code} ${(sample as any).occupation.name}`,
      })
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
