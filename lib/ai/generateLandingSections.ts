import { landingHeroCta } from './landingHeroCta'
import { landingFeatures2 } from './landingFeatures2'
import { landingPricing } from './landingPricing'
import { landingFaq } from './landingFaq'
import { landingFeatures1 } from './landingFeatures1'
import { landingMetadata } from './landingMetadata'

export type LandingSections = {
  hero?: unknown
  cta?: unknown
  features1?: unknown
  features2?: unknown
  pricing?: unknown
  faq?: unknown
  metadata?: unknown
}

export async function generateLandingSections(
  businessIdea: string,
  additionalContext?: string
) {
  const acc: LandingSections = {}

  // Run all AI generation functions in parallel
  const [h, f1, f2, p, faq, metadata] = await Promise.all([
    landingHeroCta(businessIdea, acc, additionalContext),
    landingFeatures1(businessIdea, acc, additionalContext),
    landingFeatures2(businessIdea, acc, additionalContext),
    landingPricing(businessIdea, acc, additionalContext),
    landingFaq(businessIdea, acc, additionalContext),
    landingMetadata(businessIdea, acc, additionalContext)
  ])

  // Assign results to accumulator
  acc.hero = (h as any).object.hero
  acc.cta = (h as any).object.cta
  acc.features1 = (f1 as any).object
  acc.features2 = (f2 as any).object
  acc.pricing = (p as any).object
  acc.faq = (faq as any).object
  acc.metadata = (metadata as any).object

  return acc
}
