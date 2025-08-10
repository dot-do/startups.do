# TODO (Prioritized)

A pragmatic backlog mapped to the roadmap phases. Keep changes scoped; prefer iterative merges.

## P0 — Docs and Sample
- Update README with vision, architecture, MDX/YAML, components, integrations
- Add ROADMAP.md and this TODO.md
- Add sample startup MDX: `startups/acme-claims.mdx`

Acceptance:
- All docs present and coherent
- MDX sample committed (not necessarily rendered yet)

## P1 — MDX Loader & Components
- Install `next-mdx-remote-client`
- Add `app/startups/[slug]/page.tsx` to render a startup by slug
- Implement loader:
  - Read `startups/{slug}.mdx`
  - Parse frontmatter (YAML)
  - Render default export via next-mdx-remote-client
- Create components:
  - `components/Hero.tsx`
  - `components/Problem.tsx`
  - `components/Solution.tsx`
  - `components/Features.tsx`
  - `components/Steps.tsx`
- Default generation:
  - If component props are missing, generate from YAML frontmatter
  - If component file missing, fall back to a default renderer

Acceptance:
- Visiting `/startups/acme-claims` renders the sample with defaults when needed

## P2 — Schema & Validation
- Create Zod schema for frontmatter sections (LeanCanvas, VMV, OKRs, StoryBrand, Branding, Pricing, PRD, MVP, Experiments, Variants)
- Validate on load; produce readable error messages
- Add unit tests for schema parsing and default generation

Acceptance:
- Invalid YAML fails with a clear message; valid YAML renders

## P3 — Research & Scoring
- Create Occupations + NAICS enumeration source
- Implement research workflow using Vercel AI SDK
- Implement scoring:
  - remote_on_laptop
  - model_capability
  - data_availability
  - integration_surface
  - overall weighted score
- Persist scores to YAML

Acceptance:
- Can generate or update scores for a set of NAICS/occupations

## P4 — Generators (Business Artifacts)
- Lean Canvas generator
- VMV generator
- OKRs generator
- Hypotheses and Experiments generator
- Variants generator
- Name/Brand/Domain generator (builder domains/subdomains/mcp)
- StoryBrand generator

Acceptance:
- Running generators updates the frontmatter for a startup

## P5 — Branding & Website
- Generate theme/fonts/colors/logo prompt
- Create MDX UI templates (template/def/types/mdxui)
- Compose landing page sections from YAML

Acceptance:
- Landing page renders with generated branding and sections

## P6 — Pricing & Checkout
- Map Pricing frontmatter to Stripe objects
- Pricing page renders plans from YAML
- Checkout integrates Stripe

Acceptance:
- Pricing displays correctly; checkout initiates

## P7 — PRD & MVP Scope
- PRD generator from research outputs
- MVP scoping and milestone planning

Acceptance:
- PRD and scope present in YAML and rendered sections

## P8 — Devin Automation
- Implement Devin API integration:
  - Task creation per function/workflow/service
  - Progress tracking
- Slide/deck generation for Business-as-Code

Acceptance:
- Running automation produces tasks and slides

## Engineering Conventions
- TypeScript strict mode
- Server components for data loading
- No secrets in repo; use env vars
- Tests for schema and critical transforms

## Nice-to-haves
- Content hot-reload for startups/*.mdx
- Multi-tenant builders for subdomains
- Analytics on startup funnel
