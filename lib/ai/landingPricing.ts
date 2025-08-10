import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingPricing = async (
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
    prompt: `Generate Pricing section for "${businessIdea}" aligning with the offer and value propositions.
${additionalContext ? `Additional context:\n${additionalContext}` : ''}
${contextLines ? `Previously generated:\n${contextLines}` : ''}`,
    schema: z.object({
      title: z.string(),
      description: z.string(),
      cardTitle: z.string().optional(),
      priceValue: z.string(),
      pricePeriod: z.string().optional(),
      currency: z.string().optional(),
      billing: z.string().optional(),
      trialText: z.string().optional(),
      buttonText: z.string(),
      buttonVariant: z
        .enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'])
        .optional(),
      featuresTitle: z.string(),
      features: z.array(z.string()).min(3),
      className: z.string().optional(),
    }),
  })
}
