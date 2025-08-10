import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingHeroCta = async (
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
    prompt: `Generate landing "hero" and "cta" sections for: "${businessIdea}".
Keep language crisp, benefit-oriented, and consistent with any prior sections.
${additionalContext ? `Additional context:\n${additionalContext}` : ''}
${contextLines ? `Previously generated:\n${contextLines}` : ''}`,
    schema: z.object({
      hero: z.object({
        badge: z
          .object({
            text: z.string().optional(),
            href: z.string().optional(),
            show: z.boolean().optional(),
          })
          .optional(),
        heading: z
          .object({
            text: z.string().optional(),
            highlightedText: z.string().optional(),
          })
          .optional(),
        description: z.string().optional(),
        buttons: z
          .object({
            primary: z.object({ text: z.string(), href: z.string() }).optional(),
            secondary: z.object({ text: z.string(), href: z.string() }).optional(),
          })
          .optional(),
        className: z.string().optional(),
      }),
      cta: z.object({
        heading: z.string(),
        description: z.string(),
        buttons: z.object({
          primary: z.object({ text: z.string(), url: z.string() }).optional(),
          secondary: z.object({ text: z.string(), url: z.string() }).optional(),
        }),
      }),
    }),
  })
}
