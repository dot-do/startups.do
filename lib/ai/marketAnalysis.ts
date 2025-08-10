import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const marketAnalysis = async (businessIdea: string, additionalContext?: string) => {
  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `Produce a practical market analysis for the business idea: "${businessIdea}"
  
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}

  Focus on realistic figures/assumptions and actionable insights.`,
    schema: z.object({
      marketSize: z.object({
        tam: z.string(),
        sam: z.string(),
        som: z.string(),
      }),
      targetCustomers: z.array(z.string()),
      competitors: z.array(z.string()),
      competitiveLandscape: z.array(z.string()),
      differentiation: z.array(z.string()),
      trends: z.array(z.string()),
      risks: z.array(z.string()),
    }),
  })
}
