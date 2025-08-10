
import Navbar from '@/components/navbar'
import Hero from '@/components/hero' 
import StartupGrid from '@/components/startup-grid'
import type { StartupItem } from '@/types/startup'

const ITEMS: StartupItem[] = [
  {
    id: 'invoice-pilot',
    name: 'InvoicePilot',
    description: 'Automate invoicing, reminders, and reconciliation for freelancers and small businesses.',
    category: 'service'
  },
  {
    id: 'market-match',
    name: 'MarketMatch',
    description: 'AI marketplace that pairs niche suppliers and buyers using intent signals.',
    category: 'marketplace'
  },
  { id: 'lead-lens', name: 'LeadLens', description: 'Self-optimizing lead qualification agent that scores, enriches, and routes leads.', category: 'tooling' },
  {
    id: 'supportbot',
    name: 'SupportBot 24/7',
    description: 'Autonomous support agent that resolves Tier 1–2 tickets and drafts Tier 3 handoffs.',
    category: 'service'
  },
  { id: 'datapulse', name: 'DataPulse', description: 'Hands-free data syncs and reports—your company metrics, always up to date.', category: 'data' },
  { id: 'emailsmith', name: 'EmailSmith', description: 'Cold outreach that writes, sends, and iterates campaigns to hit ICP goals.', category: 'tooling' },
  { id: 'priced-guard', name: 'PriceWatch', description: 'Competitor price tracking and smart repricing for DTC and marketplaces.', category: 'tooling' },
  { id: 'hirehive', name: 'HireHive', description: 'Autonomous sourcing agent that books interviews with pre-vetted candidates.', category: 'service' },
  { id: 'legal-draft', name: 'LegalDraft AI', description: 'Generate, review, and version routine contracts with built-in risk checks.', category: 'service' },
  { id: 'adstuner', name: 'AdsTuner', description: 'Set-and-forget ad agent that reallocates budget and creatives by ROI.', category: 'tooling' },
  { id: 'shopgen', name: 'ShopGen', description: 'Spin up niche micro-stores and keep them stocked via autonomous sourcing.', category: 'platform' },
  { id: 'content-crafter', name: 'ContentCrafter', description: 'High-quality blog and social content that matches brand voice and SEO.', category: 'content' },
  { id: 'localreach', name: 'LocalReach', description: 'Local services agent that lists, bids, and schedules jobs automatically.', category: 'service' },
  {
    id: 'prompt-market',
    name: 'PromptMarket',
    description: 'Marketplace for vetted agent prompts and runbooks with usage analytics.',
    category: 'marketplace'
  },
  { id: 'agent-ops', name: 'AgentOps Kit', description: 'Observability, evals, and run controls for production agent workflows.', category: 'tooling' },
  { id: 'brand-watch', name: 'BrandWatch', description: 'Monitor brand mentions and auto-respond across platforms in your voice.', category: 'tooling' }
]

export default function Home() {
  return (
    <div className='min-h-svh bg-background text-foreground'>
      <Navbar githubUrl='https://github.com/dot-do/startups.do' />
      <main className='mx-auto px-4 max-w-screen-2xl'>
        <Hero title='Startups.do' subtitle='Build autonomous businesses– not just software.' />
        <StartupGrid items={ITEMS} />
      </main>
    </div>
  )
}
