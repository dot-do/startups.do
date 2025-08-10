import { createOpenAI } from '@ai-sdk/openai'
export { ideate } from './ideate'

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL?.replace('/openrouter', '') + '/openai'
})
