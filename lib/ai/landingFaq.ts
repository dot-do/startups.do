import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingFaq = async (
  businessIdea: string,
  prior?: Record<string, unknown>,
  additionalContext?: string
) => {
  const contextLines = prior
    ? Object.entries(prior)
        .map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 400)}`)
        .join('\n')
    : ''

  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `Generate FAQ section for "${businessIdea}" aligned with prior sections and addressing likely objections.
${additionalContext ? `Additional context:\n${additionalContext}` : ''}
${contextLines ? `Previously generated:\n${contextLines}` : ''}`,
    schema: z.object({
      heading: z.string(),
      items: z
        .array(
          z.object({
            id: z.string(),
            question: z.string(),
            answer: z.string(),
          })
        )
        .min(4),
    }),
  })
}
