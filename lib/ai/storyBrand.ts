import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const storyBrand = async (businessIdea: string, additionalContext?: string) => {
  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `Using the StoryBrand (SB7) framework, create the narrative for the business idea: "${businessIdea}"
  
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}

  Provide concise, clear, and compelling entries suitable for YAML frontmatter storage.`,
    schema: z.object({
      character: z.string(),
      problem: z.string(),
      guide: z.string(),
      plan: z.string(),
      callToAction: z.string(),
      success: z.string(),
      failure: z.string(),
    }),
  })
}
