import { listStartups } from '../lib/startups/listStartups'
import { getStartup } from '../lib/startups/getStartup'
import { setStartup } from '../lib/startups/setStartup'
import { updateContent } from '../lib/ai/updateContent'

async function updateAllStartupsWithShortName() {
  console.log('Starting to update all startups with shortName field...')
  
  const startups = await listStartups({ limit: 1000 })
  console.log(`Found ${startups.length} startups to update`)
  
  let updated = 0
  let skipped = 0
  
  for (const slug of startups) {
    try {
      console.log(`Processing ${slug}...`)
      
      const startup = await getStartup(slug)
      
      if (startup.data.shortName) {
        console.log(`  Skipping ${slug} - shortName already exists: ${startup.data.shortName}`)
        skipped++
        continue
      }
      
      const name = startup.data.name as string
      if (!name) {
        console.log(`  Skipping ${slug} - no name field found`)
        skipped++
        continue
      }
      
      const result = await updateContent(name)
      const shortName = result.object.shortName
      
      const updatedData = { ...startup.data, shortName }
      await setStartup(slug, { data: updatedData, content: startup.content })
      
      console.log(`  Updated ${slug} with shortName: "${shortName}"`)
      updated++
      
    } catch (error) {
      console.error(`Error processing ${slug}:`, error)
    }
  }
  
  console.log(`\nCompleted! Updated: ${updated}, Skipped: ${skipped}`)
}

updateAllStartupsWithShortName().catch(console.error)
