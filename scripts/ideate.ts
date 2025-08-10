import { ideate } from '../lib/ai/ideate'

async function main() {
  const res = await ideate({
    maxIndustries: 1,
    maxOccupations: 1,
    maxIdeas: 1,
    occupationSelectableOnly: true,
    naicsMinDepth: 6,
    naicsMaxDepth: 6,
  })
  console.log('Generated ideas:', res.length)
  const sample = res[0]
  if (sample) {
    console.log('Sample:', {
      industry: `${sample.naics.naics} ${sample.naics.industry}`,
      occupation: `${sample.occupation.code} ${sample.occupation.name}`,
      businessName: sample.canvas.object.businessName,
      uniqueValueProposition: sample.canvas.object.uniqueValueProposition,
    })
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
