# GaaSAI Growth Hacker Skill

The most intelligent growth hacking system for Claude Code. AI-powered growth strategies, viral loop design, acquisition optimization, and comprehensive growth playbooks for startups and SMEs.

## Features

### Core Capabilities

- **Growth Playbook Generator** - Creates comprehensive, step-by-step growth playbooks tailored to your business stage and objectives (AAR framework: Acquisition, Activation, Retention)

- **Viral Loop Engine** - Designs viral mechanics and referral systems to achieve organic exponential growth with K-factor optimization

- **Channel Analyzer** - Analyzes and prioritizes acquisition channels based on your business context, industry benchmarks, and goals

- **Funnel Optimizer** - Identifies bottlenecks and provides optimization strategies for your conversion funnel

- **Retention Engine** - Creates comprehensive retention and engagement strategies to reduce churn and increase LTV

- **Competitor Intelligence** - Analyzes competitors to identify opportunities, threats, and differentiation strategies

- **Persona Builder** - Creates detailed, actionable user personas based on your product and market

- **Growth Metrics Analyzer** - Analyzes your growth metrics to identify trends, issues, and opportunities

- **Content Strategy Engine** - Develops comprehensive content marketing and SEO strategies for organic growth

- **Growth Idea Generator** - Generates creative, unconventional growth ideas and experiments

## Installation

```bash
npm install
npm run build
```

## Quick Start

```typescript
import growthHackerSkill, { BusinessContext } from './src';

const context: BusinessContext = {
  company: {
    name: 'My Startup',
    stage: 'seed',
    industry: 'SaaS',
    businessModel: 'saas',
    teamSize: 5,
  },
  product: {
    name: 'My Product',
    type: 'b2b',
    category: 'productivity',
    pricing: { type: 'freemium', lowestTier: 0, currency: 'USD' },
    uniqueValueProposition: 'We help teams work faster',
    coreProblemSolved: 'Team collaboration is broken',
    keyFeatures: ['Real-time collaboration', 'AI assistance'],
  },
  market: {
    maturity: 'growing',
    keyTrends: ['Remote work', 'AI adoption'],
    barriers: [],
  },
  currentMetrics: {
    monthlyActiveUsers: 1000,
    activationRate: 0.3,
    day7Retention: 0.2,
    monthlyChurnRate: 0.05,
  },
  personas: [],
  competitors: [],
  objectives: [],
};

// Execute full growth audit
const result = await growthHackerSkill.execute({
  sessionId: 'session-123',
  businessContext: context,
});

console.log('Insights:', result.insights);
console.log('Next Actions:', result.nextActions);
```

## Individual Capability Usage

### Generate a Growth Playbook

```typescript
import { PlaybookGenerator } from './src';

const generator = new PlaybookGenerator();
const result = await generator.execute({
  targetStage: 'acquisition',
  businessModel: 'saas',
  budget: 'seed',
});

console.log(result.data); // Comprehensive playbook with steps and tactics
```

### Design Viral Loops

```typescript
import { ViralLoopEngine } from './src';

const engine = new ViralLoopEngine();
const result = await engine.execute({
  productType: 'b2b',
  preferredLoopType: 'collaboration',
});

console.log(result.data.recommendedLoops);
console.log(result.data.implementationGuide);
```

### Analyze Acquisition Channels

```typescript
import { ChannelAnalyzer } from './src';

const analyzer = new ChannelAnalyzer();
const result = await analyzer.execute({
  industry: 'SaaS',
  productType: 'b2b',
  budget: 5000,
});

console.log(result.data.topRecommendations);
console.log(result.data.channelMix);
```

### Generate Growth Ideas

```typescript
import { GrowthIdeaGenerator } from './src';

const generator = new GrowthIdeaGenerator();
const result = await generator.execute({
  businessContext: { company: { stage: 'seed' }, product: { type: 'b2b' } },
  riskTolerance: 'moderate',
});

console.log(result.data.quickWins);
console.log(result.data.moonshots);
```

## Architecture

```
src/
├── core/
│   ├── types.ts              # All TypeScript types and interfaces
│   └── SkillRegistry.ts      # Central skill management
├── skills/
│   ├── GrowthHackerSkill.ts  # Main skill orchestrator
│   └── capabilities/
│       ├── PlaybookGenerator.ts
│       ├── ViralLoopEngine.ts
│       ├── ChannelAnalyzer.ts
│       ├── FunnelOptimizer.ts
│       ├── RetentionEngine.ts
│       ├── CompetitorIntelligence.ts
│       ├── PersonaBuilder.ts
│       ├── GrowthMetricsAnalyzer.ts
│       ├── ContentStrategyEngine.ts
│       └── GrowthIdeaGenerator.ts
└── index.ts                  # Main exports
```

## Growth Frameworks Supported

- **AARRR (Pirate Metrics)** - Acquisition, Activation, Retention, Revenue, Referral
- **Growth Loops** - Viral loops, network effects, content loops
- **North Star Metric** - Focus on single most important metric
- **ICE Scoring** - Impact, Confidence, Ease prioritization
- **Hook Model** - Trigger, Action, Variable Reward, Investment

## License

MIT

## About GaaSAI

GaaSAI (Growth as a Service AI) helps create tailored, efficient, and collaborative growth and marketing strategies assisted by AI and expert community knowledge.
