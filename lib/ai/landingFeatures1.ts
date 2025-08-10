import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingFeatures1 = async (
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
    prompt: `Generate Features1 section (tagline, title, description, features[]) for: "${businessIdea}".
Keep consistent with prior sections.
${additionalContext ? `Additional context:\n${additionalContext}` : ''}
${contextLines ? `Previously generated:\n${contextLines}` : ''}`,
    schema: z.object({
      tagline: z.string(),
      title: z.string(),
      description: z.string(),
      features: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            iconKey: z.enum(['LuZoomIn', 'LuZap', 'LuMessagesSquare', 'LuInfinity']).optional(),
          })
        )
        .min(3),
      className: z.string().optional(),
    }),
  })
}
