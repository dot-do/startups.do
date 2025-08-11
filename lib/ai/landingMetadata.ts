import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const landingMetadata = async (
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
    prompt: `Generate SEO metadata for a landing page for: "${businessIdea}".
Create compelling, search-optimized metadata that aligns with the business idea and any prior sections.
${additionalContext ? `Additional context:\n${additionalContext}` : ''}
${contextLines ? `Previously generated:\n${contextLines}` : ''}`,
    schema: z.object({
      title: z.string().describe('SEO-optimized page title (50-60 characters)'),
      description: z.string().describe('Meta description for search results (150-160 characters)'),
      keywords: z.array(z.string()).describe('Relevant keywords for SEO'),
      ogTitle: z.string().describe('Open Graph title for social sharing'),
      ogDescription: z.string().describe('Open Graph description for social sharing'),
      ogImage: z.string().optional().describe('URL to Open Graph image'),
      twitterTitle: z.string().describe('Twitter card title'),
      twitterDescription: z.string().describe('Twitter card description'),
      canonicalUrl: z.string().optional().describe('Canonical URL for the page'),
    }),
  })
}
