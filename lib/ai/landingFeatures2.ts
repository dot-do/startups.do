import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingFeatures2 = async (
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
    prompt: `Generate Features2 section (subtitle, title, features[]) for: "${businessIdea}".
Ensure consistency with previously generated sections (benefits and terminology).
${additionalContext ? `Additional context:\n${additionalContext}` : ''}
${contextLines ? `Previously generated:\n${contextLines}` : ''}`,
    schema: z.object({
      subtitle: z.string(),
      title: z.string(),
      features: z
        .array(
          z.object({
            id: z.string(),
            iconKey: z.enum(['LuTimer', 'LuZoomIn', 'LuZap']).optional(),
            title: z.string(),
            description: z.string(),
          })
        )
        .min(3),
      className: z.string().optional(),
    }),
  })
}
