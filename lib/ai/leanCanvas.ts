import { generateObject } from "ai"
import { openai } from ".";
import { z } from "zod"

// Define the lean canvas type directly
type LeanCanvasType = {
  businessName: string;
  problemStatement: string[];
  customerSegments: string[];
  uniqueValueProposition: string;
  solution: string[];
  keyFeatures: string[];
  channels: string[];
  revenueStreams: string[];
  costStructure: string[];
  keyMetrics: string[];
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  unfairAdvantage: string;
  marketSize: string;
  competitiveAnalysis: string[];
};

// Simple schema
const leanCanvasSchema = z.object({
  businessName: z.string(),
  problemStatement: z.array(z.string()),
  customerSegments: z.array(z.string()),
  uniqueValueProposition: z.string(),
  solution: z.array(z.string()),
  keyFeatures: z.array(z.string()),
  channels: z.array(z.string()),
  revenueStreams: z.array(z.string()),
  costStructure: z.array(z.string()),
  keyMetrics: z.array(z.string()),
  keyPartners: z.array(z.string()),
  keyActivities: z.array(z.string()),
  keyResources: z.array(z.string()),
  unfairAdvantage: z.string(),
  marketSize: z.string(),
  competitiveAnalysis: z.array(z.string())
}) satisfies z.ZodType<LeanCanvasType>;

export const leanCanvas = async (businessIdea: string, additionalContext?: string) => {
  const prompt = `Generate a comprehensive lean canvas for the following business idea: "${businessIdea}"
  
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}
  
  Please provide detailed, realistic, and actionable insights for each component of the lean canvas. Focus on:
  - Specific, measurable elements where possible
  - Realistic market assumptions
  - Clear value propositions
  - Actionable go-to-market strategies
  - Concrete metrics and KPIs`;

  return generateObject({
    model: openai('gpt-4'),
    schema: leanCanvasSchema,
    prompt
  });
};

export type LeanCanvas = LeanCanvasType;