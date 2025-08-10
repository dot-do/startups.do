#!/usr/bin/env tsx

import { listStartups, getStartup } from '../lib/startups'
import { createStartupDevinSession } from '../lib/devin'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateVariationPrompts(startupName: string, data: Record<string, unknown>): string[] {
  const basePrompts = [
    `Expand the business model and add more detailed financial projections for ${startupName}`,
    `Create a comprehensive go-to-market strategy and competitive analysis for ${startupName}`,
    `Develop detailed product roadmap and technical architecture for ${startupName}`,
    `Add customer personas, user stories, and market research insights for ${startupName}`,
    `Create operational plans, team structure, and scaling strategies for ${startupName}`
  ]

  return basePrompts.map(prompt => {
    const contextInfo: string[] = []
    
    if (data.leanCanvas) {
      contextInfo.push(`Current lean canvas: ${JSON.stringify(data.leanCanvas, null, 2)}`)
    }
    
    if (data.vmv) {
      contextInfo.push(`Vision/Mission/Values: ${JSON.stringify(data.vmv, null, 2)}`)
    }
    
    if (data.naics) {
      contextInfo.push(`Industry (NAICS): ${JSON.stringify(data.naics, null, 2)}`)
    }

    if (data.okrs) {
      contextInfo.push(`Current OKRs: ${JSON.stringify(data.okrs, null, 2)}`)
    }

    const context = contextInfo.length > 0 
      ? `\n\nContext from existing startup data:\n${contextInfo.join('\n\n')}`
      : ''

    return `${prompt}${context}`
  })
}

async function main() {
  try {
    console.log('🚀 Starting startup session generation...')
    
    const startupSlugs = await listStartups()
    console.log(`📋 Found ${startupSlugs.length} startups: ${startupSlugs.join(', ')}`)
    
    const shuffledStartups = shuffleArray(startupSlugs)
    console.log(`🔀 Shuffled startup order: ${shuffledStartups.join(', ')}`)
    
    const results: Array<{
      startup: string
      sessions?: Array<{
        sessionId?: string
        url?: string
        isNew?: boolean
        prompt: string
        error?: string
      }>
      error?: string
      success: number
      failed: number
    }> = []
    
    for (const slug of shuffledStartups) {
      console.log(`\n📝 Processing startup: ${slug}`)
      
      try {
        const startup = await getStartup(slug)
        console.log(`✅ Loaded data for ${slug}`)
        
        const prompts = generateVariationPrompts(slug, startup.data)
        console.log(`📝 Generated ${prompts.length} variation prompts`)
        
        const sessions: Array<{
          sessionId?: string
          url?: string
          isNew?: boolean
          prompt: string
          error?: string
        }> = []
        for (let i = 0; i < prompts.length; i++) {
          console.log(`  🤖 Creating session ${i + 1}/5 for ${slug}...`)
          
          try {
            const session = await createStartupDevinSession(slug, prompts[i])
            sessions.push({
              sessionId: session.session_id,
              url: session.url,
              isNew: session.is_new_session,
              prompt: prompts[i].substring(0, 100) + '...' // Truncate for logging
            })
            console.log(`    ✅ Session created: ${session.session_id}`)
            
            await new Promise(resolve => setTimeout(resolve, 1000))
          } catch (error) {
            console.error(`    ❌ Failed to create session ${i + 1} for ${slug}:`, error)
            sessions.push({
              error: error instanceof Error ? error.message : String(error),
              prompt: prompts[i].substring(0, 100) + '...'
            })
          }
        }
        
        results.push({
          startup: slug,
          sessions,
          success: sessions.filter(s => !s.error).length,
          failed: sessions.filter(s => s.error).length
        })
        
        console.log(`✅ Completed ${slug}: ${sessions.filter(s => !s.error).length}/5 sessions created`)
        
      } catch (error) {
        console.error(`❌ Failed to process startup ${slug}:`, error)
        results.push({
          startup: slug,
          error: error instanceof Error ? error.message : String(error),
          success: 0,
          failed: 5
        })
      }
    }
    
    console.log('\n📊 SUMMARY')
    console.log('='.repeat(50))
    
    const totalSuccess = results.reduce((sum, r) => sum + (r.success || 0), 0)
    const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0)
    const totalExpected = startupSlugs.length * 5
    
    console.log(`Total startups processed: ${results.length}`)
    console.log(`Total sessions created: ${totalSuccess}/${totalExpected}`)
    console.log(`Total failures: ${totalFailed}`)
    
    results.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.startup}: Failed to load startup data`)
      } else {
        console.log(`${result.success === 5 ? '✅' : '⚠️'} ${result.startup}: ${result.success}/5 sessions created`)
      }
    })
    
    console.log('\n📋 Detailed Results:')
    console.log(JSON.stringify(results, null, 2))
    
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
