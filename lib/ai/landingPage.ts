import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingPage = async (businessIdea: string, additionalContext?: string) => {
  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `Generate landing page content blocks for the business idea: "${businessIdea}"
  
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}

  Keep language crisp and benefit-oriented, suitable for immediate use in UI components.`,
    schema: z.object({
      hero: z.object({
        title: z.string(),
        subtitle: z.string(),
        ctaText: z.string(),
        ctaHref: z.string(),
      }),
      problem: z.array(z.string()),
      solution: z.array(z.string()),
      features: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  })
}
