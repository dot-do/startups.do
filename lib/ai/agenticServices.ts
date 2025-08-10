import { generateObject } from 'ai'
import { openai } from '.'
import { z } from 'zod'

export const agenticServices = async (
  opts:
    | { industry: string; occupation?: string; additionalContext?: string }
    | { occupation: string; industry?: string; additionalContext?: string }
) => {
  const { industry, occupation, additionalContext } = opts as { industry?: string; occupation?: string; additionalContext?: string }

  const idea = [industry ? `Industry: "${industry}"` : null, occupation ? `Occupation: "${occupation}"` : null].filter(Boolean).join(' | ')

  return generateObject({
    model: openai.responses('gpt-5'),
    prompt: `List concrete, viable AI-delivered service workflows for:
${idea}

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Requirements:
- Favor services that can be delivered by AI agents with optional human-in-the-loop (remote, laptop-accessible).
- Each service should be a clear workflow with triggers, inputs, steps, tools/APIs, outputs, and pricing approach.
- Include brief feasibility scores (current model capability and remote-deliverability) and top risks.
- Keep concise, practical, and iteration-ready.`,
    schema: z.object({
      services: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          targetUsers: z.array(z.string()).default([]),
          triggers: z.array(z.string()).default([]),
          inputs: z.array(z.string()).default([]),
          steps: z.array(z.string()).default([]),
          tools: z.array(z.string()).default([]),
          outputs: z.array(z.string()).default([]),
          pricingModel: z.array(z.string()).default([]),
          humanInLoop: z.boolean().default(false),
          feasibility: z.object({
            remoteOnLaptop: z.number(),
            modelCapability: z.number(),
            overall: z.number()
          }),
          risks: z.array(z.string()).default([]),
          dependencies: z.array(z.string()).default([])
        })
      )
    })
  })
}
