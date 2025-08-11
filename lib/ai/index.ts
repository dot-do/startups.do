import { createOpenAI } from '@ai-sdk/openai'
export { ideate } from './ideate'
export { landingHeroCta } from './landingHeroCta'
export { landingFeatures1 } from './landingFeatures1'
export { landingFeatures2 } from './landingFeatures2'
export { landingPricing } from './landingPricing'
export { landingFaq } from './landingFaq'
export { generateLandingSections } from './generateLandingSections'
export { updateContent } from './updateContent'

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL?.replace('/openrouter', '') + '/openai'
})
