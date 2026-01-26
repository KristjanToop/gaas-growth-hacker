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

### Launch Automation (for Vibe-Coded Apps)

- **Launch Assistant** - Complete launch automation system that handles:
  - Email setup (domain verification, templates, sequences)
  - Ads infrastructure (Meta Pixel, Google Ads, retargeting audiences)
  - Analytics configuration (PostHog/Mixpanel events, funnels)
  - Legal documents (Privacy Policy, Terms of Service)
  - Distribution planning (Product Hunt, social media, communities)
  - Payment setup (Stripe products, checkout)

- **MCP Integrations** - Ready-to-use commands for:
  - `resend-mcp` - Transactional email
  - `meta-ads-mcp` - Facebook/Instagram ads
  - `google-ads-mcp` - Google Ads
  - `posthog-mcp` - Product analytics
  - `stripe-mcp` - Payments
  - `twitter-mcp` - Social posting

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

### Launch Your Vibe-Coded App

```typescript
import { launchAssistant, AppInfo } from './src';

const appInfo: AppInfo = {
  name: 'MyApp',
  tagline: 'The easiest way to do X',
  description: 'MyApp helps you accomplish Y in half the time',
  category: 'productivity',
  targetAudience: 'small business owners',
  pricing: 'freemium',
  url: 'https://myapp.com',
};

const result = await launchAssistant.execute({
  appInfo,
  launchDate: '2025-02-15',
  budget: 500,
});

// Get complete launch plan
console.log(result.data.checklist);      // 25+ launch tasks
console.log(result.data.emailSetup);     // Email templates & sequences
console.log(result.data.adsSetup);       // Pixel setup, audiences, campaigns
console.log(result.data.distributionPlan); // Product Hunt, social, communities
console.log(result.data.mcpCommands);    // Ready-to-run MCP commands
```

### Use MCP Commands for Automation

```typescript
import { MCP_SERVERS, mcpCommandGenerator } from './src';

// Get all available MCP servers
for (const server of MCP_SERVERS) {
  console.log(`${server.name}: ${server.description}`);
  console.log(`  Tools: ${server.tools.map(t => t.name).join(', ')}`);
}

// Generate MCP commands for specific tasks
const commands = mcpCommandGenerator.generateCommandsForTask(
  { id: 'meta-pixel', /* ... */ },
  appInfo
);
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
├── launch/
│   ├── types.ts              # Launch configuration types
│   ├── LaunchAssistant.ts    # Main launch automation
│   ├── index.ts              # Launch module exports
│   └── mcp/
│       └── MCPLaunchIntegrations.ts  # MCP server configs
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
