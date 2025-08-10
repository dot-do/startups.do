import 'dotenv/config'
import { ideate } from '../lib/ai/ideate'

async function main() {
  const res = await ideate({
    maxIndustries: 100,
    maxOccupations: 100,
    occupationSelectableOnly: true,
    naicsMinDepth: 6,
    naicsMaxDepth: 6,
    maxServicesPerMarket: 5,
    persist: true,
  })
  console.log('Persisted ideas:', res.length)
  console.log('Slugs:', res.map(r => (r as any).slug))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
