# startups.do — Business-as-Code

Transform AI startup creation into code. startups.do generates, evaluates, and assembles startups from Occupations and NAICS-coded opportunities using Functions, Workflows, and Agents.

- Vision: Business-as-Code (define the business as code; generate the rest with AI)
- Output: MDX-driven startup sites in `startups/{name}.mdx` backed by YAML frontmatter
- Engine: AI workflows that research, score, design, and build startup artifacts
- Automation: Assign implementation to Devin via the Devin API and generate slides

Links:
- See ROADMAP: ./ROADMAP.md
- See TODO backlog: ./TODO.md

## Core Concepts

- Functions: Code, Generative, Agentic, Human
- Workflows: Deterministic and AI-driven steps that compose Functions
- Agents: Orchestrate research, generation, scoring, and iteration
- Business-as-Code: Declarative (Vision/Mission/Purpose, OKRs) + Imperative (Workflows), combined as code

## Architecture Overview

- Framework: Next.js (App Router)
- Content model: `startups/{name}.mdx` rendered at runtime using `next-mdx-remote-client`
- Frontmatter: YAML stores structured generated objects:
  - Lean Canvas
  - Vision/Mission/Purpose (VMV)
  - Objectives and Key Results (OKRs)
  - Hypotheses and Experiments
  - Variants
  - Name/Brand/Domain (including builder domains/subdomains/mcp)
  - StoryBrand
  - Branding (style/theme/fonts/color/logo)
  - Landing pages (template/def/types/mdxui)
  - Stripe pricing and checkout
  - PRD
  - MVP scope/plan
- Components (to be added in `components/`): Hero, Problem, Solution, Features, Steps
  - If a component or the MDX file does not exist, default props are generated from YAML frontmatter

## Workflow

1) Enumerate Occupations + NAICS codes  
2) Research jobs, functions, and workflows for agentic automation  
3) Score feasibility:
   - Can it be done remotely by a human on a laptop?
   - Capability for current models
4) Generate artifacts:
   - Lean Canvas
   - Vision/Mission/Purpose
   - OKRs
   - Hypotheses and Experiments
   - Variants
   - Name/Brand/Domain
   - StoryBrand
   - Branding (style/theme/fonts/color/logo)
   - Landing pages (template/def/types/mdxui)
   - Stripe pricing and checkout pages
   - PRD
   - MVP scope/plan
5) Assign to Devin via Devin API to build functions/services
   - Code → Functions → Workflow → Service → Business
   - Generate decks/slides
6) Save outputs to YAML frontmatter; render the site from MDX

## MDX Format

- Location: `startups/{name}.mdx`
- Rendering: loaded at runtime via `next-mdx-remote-client`
- Default export: a page composed from components (Hero/Problem/Solution/Features/Steps)
- Frontmatter: YAML schema holds all structured business artifacts

### Frontmatter Schema (excerpt)

```yaml
---
name: Acme Auto Claims AI
slug: acme-claims
domain: acmeclaims.ai
naics:
  primary: "524291"
  occupations: ["Claims Adjuster"]
score:
  remote_on_laptop: 0.9
  model_capability: 0.8
  overall: 0.85
vmv:
  vision: "Zero-touch auto claims in minutes."
  mission: "Automate FNOL to payout with AI and human-in-the-loop."
  purpose: "Faster, fairer claim experiences."
leanCanvas:
  problem: ["Slow claims", "Fraud risk", "Manual reviews"]
  solution: ["End-to-end agentic workflow"]
  uniqueValueProp: "Claims in minutes, not weeks"
  unfairAdvantage: "Proprietary datasets + insurer integrations"
  customerSegments: ["Auto insurers", "TPAs"]
  channels: ["Broker partnerships", "Direct"]
  revenueStreams: ["Per-claim", "SaaS"]
  costStructure: ["LLM", "Infra", "Integrations"]
  keyMetrics: ["Time-to-payout", "Fraud rate", "CSAT"]
okrs:
  - objective: "Reduce average claim cycle time"
    keyResults:
      - metric: "Cycle time"
        target: "≤ 5 minutes"
storyBrand:
  character: "Claims leaders"
  problem: "Backlogs and leakage"
  guide: "Agentic copilot"
  plan: "Pilot → Integrate → Scale"
  callToAction: "Start a pilot"
  success: "Minutes to payout"
  failure: "Status quo delays"
branding:
  nameIdeas: ["ClaimSpark", "Adjustly"]
  colors: { primary: "#0A84FF", secondary: "#111827" }
  fonts: { heading: "Geist", body: "Inter" }
  logoPrompt: "Simple spark + shield logo"
pricing:
  plans:
    - id: startup
      price: 199
      interval: monthly
      features: ["Up to 1k claims/mo"]
  stripe:
    productId: ""
    priceIds: {}
prd:
  summary: "Automate FNOL → triage → adjudication → payout"
  scopeMVP: ["Intake", "Doc parsing", "Risk scoring", "Human review"]
experiments:
  - hypothesis: "Automated triage reduces cycle time by 50%"
    metric: "Cycle time"
    variantCount: 3
variants:
  - name: "Self-serve insurers"
    changes: ["No human-in-loop"]
---
```

## Components Contract

- Hero: { title, subtitle, ctaText, ctaHref }
- Problem: { bullets[] }
- Solution: { bullets[] }
- Features: { items[] }
- Steps: { steps[] }

If a component or props are missing, defaults derive from YAML frontmatter.

## Integrations

- MDX loading: `next-mdx-remote-client`
- AI generation: Vercel AI SDK (`@vercel/ai`) to generate/transform objects, persisted to frontmatter
- Payments: Stripe pricing and checkout pages
- Automation: Devin API to assign builds and generate slides

## Local Development

Install dependencies and run:

```bash
pnpm install
pnpm dev
# build/start/lint as needed
pnpm build
pnpm start
pnpm lint
```

This is a Next.js App Router project. Start with `app/page.tsx` or add MDX files in `startups/` and components in `components/` as you implement the roadmap.
