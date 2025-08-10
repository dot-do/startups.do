import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const productRequirementsDocument = async (businessIdea: string, additionalContext?: string) => {
  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `Create a concise Product Requirements Document (PRD) for the business idea: "${businessIdea}"
  
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}

  Make it implementation-ready and scoped to an MVP first.`,
    schema: z.object({
      summary: z.string(),
      objectives: z.array(z.string()),
      scopeMVP: z.array(z.string()),
      nonFunctionalRequirements: z.array(z.string()),
      successMetrics: z.array(z.string()),
      assumptions: z.array(z.string()),
      outOfScope: z.array(z.string()),
    }),
  })
}
