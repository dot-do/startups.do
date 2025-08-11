import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const updateContent = async (name: string) => {
  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `Given this startup name: "${name}"

Create a short, concise shortName that captures the essence of the business in no more than 3 words. 
The shortName should be:
- Maximum 3 words
- Catchy and memorable
- Captures the core business concept
- Suitable for branding/marketing use

Examples:
- "Candling AI: Fertility & Early Mortality Estimator" → "Candling AI"
- "Batch Traceability Platform" → "Batch Trace"
- "SoleScript AI" → "SoleScript AI"`,
    schema: z.object({
      shortName: z.string().describe('Short name for the startup, maximum 3 words'),
    }),
  })
}
