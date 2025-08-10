import { landingHeroCta } from './landingHeroCta'
import { landingFeatures2 } from './landingFeatures2'
import { landingPricing } from './landingPricing'
import { landingFaq } from './landingFaq'
import { landingFeatures1 } from './landingFeatures1'

export type LandingSections = {
  hero?: unknown
  cta?: unknown
  features1?: unknown
  features2?: unknown
  pricing?: unknown
  faq?: unknown
}

export async function generateLandingSections(
  businessIdea: string,
  additionalContext?: string
) {
  const acc: LandingSections = {}

  const h = await landingHeroCta(businessIdea, acc, additionalContext)
  acc.hero = (h as any).object.hero
  acc.cta = (h as any).object.cta

  const f1 = await landingFeatures1(businessIdea, acc, additionalContext)
  acc.features1 = (f1 as any).object

  const f2 = await landingFeatures2(businessIdea, acc, additionalContext)
  acc.features2 = (f2 as any).object

  const p = await landingPricing(businessIdea, acc, additionalContext)
  acc.pricing = (p as any).object

  const faq = await landingFaq(businessIdea, acc, additionalContext)
  acc.faq = (faq as any).object

  return acc
}
