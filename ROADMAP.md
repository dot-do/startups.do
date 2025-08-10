# startups.do Roadmap

Phases and deliverables for building the AI Startup Generator as Business-as-Code.

## Phase 0 — Foundations (Docs and Conventions)
- Define Business-as-Code vision and scope in README
- Establish MDX file location: `startups/{name}.mdx`
- Establish YAML frontmatter schema (LeanCanvas, VMV, OKRs, StoryBrand, Branding, Pricing, PRD, MVP scope, Experiments, Variants)
- Define components contract: Hero, Problem, Solution, Features, Steps
- Create sample MDX (`startups/acme-claims.mdx`)

Artifacts:
- README.md, ROADMAP.md, TODO.md
- Sample MDX with realistic frontmatter

## Phase 1 — MDX Loader and Components
- Install and configure `next-mdx-remote-client`
- Create server-side loader by slug: `/startups/[slug]`
- Parse YAML frontmatter; pass data to components
- Implement components: Hero, Problem, Solution, Features, Steps
- Add default prop generation when props missing
- Provide sensible design system defaults

Artifacts:
- `app/startups/[slug]/page.tsx` (server component)
- `lib/mdx/loader.ts` and `lib/mdx/schema.ts`
- `components/Hero.tsx`, `components/Problem.tsx`, `components/Solution.tsx`, `components/Features.tsx`, `components/Steps.tsx`

## Phase 2 — Frontmatter Schema & Validation
- Define Zod schemas for frontmatter objects
- Validate on load; surface errors gracefully
- Generate default props from YAML or via AI when missing
- Add sample fixtures and unit tests

Artifacts:
- `lib/schema/*.ts` with Zod types
- Tests for parsing and defaults

## Phase 3 — Research & Scoring (Occupations/NAICS Loop)
- Enumerate Occupations + NAICS
- Agents research jobs, functions, and workflows for agentic automation
- Scoring rubric and persistence

Scoring rubric:
- remote_on_laptop: 0..1
- model_capability: 0..1
- data_availability: 0..1
- integration_surface: 0..1 (can invert if lower is better)
- overall = weighted_sum([0.35, 0.35, 0.2, 0.1])

Artifacts:
- `workflows/research/*`
- YAML outputs into frontmatter or sidecar files

## Phase 4 — Generators (Core Business Artifacts)
- Lean Canvas generator
- Vision/Mission/Purpose generator
- OKRs generator
- Hypotheses and Experiments generator
- Variants generator
- Name/Brand/Domain generator (builder domains/subdomains/mcp)
- StoryBrand generator

Artifacts:
- `workflows/generators/*`
- Persist results into YAML frontmatter

## Phase 5 — Branding and Website Assets
- Theme/colors/fonts/logo generation
- Landing page content blocks
- MDX UI templates (template/def/types/mdxui)
- Default page composition rules

Artifacts:
- `components/branding/*`
- `content/templates/*`

## Phase 6 — Pricing and Checkout
- Stripe product/price model mapping from YAML
- Pricing page generation from frontmatter
- Checkout page and integration

Artifacts:
- `app/pricing/page.tsx`, `app/checkout/*`
- Scripts to seed Stripe data (optional)

## Phase 7 — PRD & MVP Scope
- PRD generation from research and LeanCanvas
- MVP scoping and milestones
- Optional engineering task breakdown (Functions → Workflows → Service)

Artifacts:
- `content/prd/*.mdx` or YAML sections in startup frontmatter

## Phase 8 — Devin Automation
- Assign to Devin using the Devin API:
  - Create tasks per function/workflow/service
  - Track progress and sync outcomes into YAML
- Generate decks/slides for Business-as-Code overview

Artifacts:
- `workflows/automation/devin.ts`
- Exported slides

## Phase 9 — Publishing and Iteration
- Build and deploy
- Iteration loop: research → generate → evaluate → deploy
- Telemetry and success metrics

Artifacts:
- Scripts and dashboards (TBD)
