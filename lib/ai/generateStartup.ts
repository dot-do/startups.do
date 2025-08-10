import { leanCanvas } from './leanCanvas'
import { storyBrand } from './storyBrand'
import { landingPage } from './landingPage'
import { setStartup } from '../startups/setStartup'
import type { StartupDocInput } from '../startups/setStartup'

export async function generateStartup(name: string) {
  const businessIdea = `AI-powered startup called "${name}"`
  
  const [canvas, story, landing] = await Promise.all([
    leanCanvas(businessIdea),
    storyBrand(businessIdea),
    landingPage(businessIdea)
  ])

  const frontmatter = {
    name: canvas.object.businessName || name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    leanCanvas: {
      problem: canvas.object.problemStatement,
      solution: canvas.object.solution,
      uniqueValueProp: canvas.object.uniqueValueProposition,
      unfairAdvantage: canvas.object.unfairAdvantage,
      customerSegments: canvas.object.customerSegments,
      channels: canvas.object.channels,
      revenueStreams: canvas.object.revenueStreams,
      costStructure: canvas.object.costStructure,
      keyMetrics: canvas.object.keyMetrics,
    },
    storyBrand: story.object,
    hero: landing.object.hero,
    problem: landing.object.problem,
    solution: landing.object.solution,
    features: landing.object.features,
    steps: landing.object.steps,
  }

  const content = `# ${frontmatter.name}

${frontmatter.hero.subtitle}

## Problem
${frontmatter.problem.map(p => `- ${p}`).join('\n')}

## Solution
${frontmatter.solution.map(s => `- ${s}`).join('\n')}

## Features
${frontmatter.features.map(f => `- ${f}`).join('\n')}

## How It Works
${frontmatter.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`

  const doc: StartupDocInput = { data: frontmatter, content }
  await setStartup(name, doc)
  
  return doc
}
