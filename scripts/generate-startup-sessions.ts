#!/usr/bin/env tsx

import 'dotenv/config'
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

function generateWorkflowPrompt(startupName: string, data: Record<string, unknown>): string {
  const contextInfo: string[] = []
  
  if (data.leanCanvas) {
    contextInfo.push(`Current lean canvas: ${JSON.stringify(data.leanCanvas, null, 2)}`)
  }
  
  if (data.vmv) {
    contextInfo.push(`Vision/Mission/Values: ${JSON.stringify(data.vmv, null, 2)}`)
  }
  

  if (data.okrs) {
    contextInfo.push(`Current OKRs: ${JSON.stringify(data.okrs, null, 2)}`)
  }

  const context = contextInfo.length > 0 
    ? `\n\nContext from existing startup data:\n${contextInfo.join('\n\n')}`
    : ''

  return `Create workflow and business process functions for ${startupName}. Export TypeScript functions that define the core business processes as code. The functions can be pseudocode and reference other functions that don't exist yet.

Focus on creating functions that represent:
- Customer acquisition workflows
- Product development processes  
- Revenue generation flows
- Operational procedures
- Decision-making workflows

Each function should be well-typed and represent a specific business process or workflow step. Functions can call other functions, use async/await patterns, and include error handling.

Example structure:
\`\`\`typescript
export async function acquireCustomer(lead: Lead): Promise<Customer> {
  const qualifiedLead = await qualifyLead(lead)
  const proposal = await generateProposal(qualifiedLead)
  const contract = await negotiateContract(proposal)
  return await onboardCustomer(contract)
}
\`\`\`

The goal is to encode the business logic and workflows as executable code that represents how the startup operates.${context}`
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
      session?: {
        sessionId?: string
        url?: string
        isNew?: boolean
        prompt: string
        error?: string
      }
      error?: string
      success: number
      failed: number
    }> = []
    
    for (const slug of shuffledStartups) {
      console.log(`\n📝 Processing startup: ${slug}`)
      
      try {
        const startup = await getStartup(slug)
        console.log(`✅ Loaded data for ${slug}`)
        
        const prompt = generateWorkflowPrompt(slug, startup.data)
        console.log(`📝 Generated workflow prompt for ${slug}`)
        
        let session: {
          sessionId?: string
          url?: string
          isNew?: boolean
          prompt: string
          error?: string
        }
        
        console.log(`  🤖 Creating workflow session for ${slug}...`)
        
        try {
          const devinSession = await createStartupDevinSession(slug, prompt)
          session = {
            sessionId: devinSession.session_id,
            url: devinSession.url,
            isNew: devinSession.is_new_session,
            prompt: prompt.substring(0, 100) + '...'
          }
          console.log(`    ✅ Session created: ${devinSession.session_id}`)
          
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error(`    ❌ Failed to create session for ${slug}:`, error)
          session = {
            error: error instanceof Error ? error.message : String(error),
            prompt: prompt.substring(0, 100) + '...'
          }
        }
        
        results.push({
          startup: slug,
          session,
          success: session.error ? 0 : 1,
          failed: session.error ? 1 : 0
        })
        
        console.log(`✅ Completed ${slug}: ${session.error ? 0 : 1}/1 session created`)
        
      } catch (error) {
        console.error(`❌ Failed to process startup ${slug}:`, error)
        results.push({
          startup: slug,
          error: error instanceof Error ? error.message : String(error),
          success: 0,
          failed: 1
        })
      }
    }
    
    console.log('\n📊 SUMMARY')
    console.log('='.repeat(50))
    
    const totalSuccess = results.reduce((sum, r) => sum + (r.success || 0), 0)
    const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0)
    const totalExpected = startupSlugs.length
    
    console.log(`Total startups processed: ${results.length}`)
    console.log(`Total sessions created: ${totalSuccess}/${totalExpected}`)
    console.log(`Total failures: ${totalFailed}`)
    
    results.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.startup}: Failed to load startup data`)
      } else {
        console.log(`${result.success === 1 ? '✅' : '⚠️'} ${result.startup}: ${result.success}/1 session created`)
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
