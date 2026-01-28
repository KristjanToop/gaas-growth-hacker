# GaaSAI Growth Hacker Skill

> AI-powered growth strategies, viral loops, acquisition channels, funnel optimization, retention playbooks, competitor intel, personas, content/SEO, growth ideas, and launch execution. For startups and SMEs.

[![skills.sh](https://img.shields.io/badge/skills.sh-growth--hacker-000?style=flat)](https://skills.sh)

Skills are markdown instruction sets that give AI agents specialized knowledge and workflows. This skill teaches your agent growth frameworks (AARRR, ICE, North Star, growth loops), how to run playbooks and audits, and how to **execute** launch tasks via MCPs when Resend, Meta/Google Ads, PostHog, Stripe, or Twitter are configured.

Follows the [Agent Skills](https://agentskills.io/) format.

---

## Install

```bash
npx skills add <owner>/GaaSAI --skill growth-hacker
```

Replace `<owner>` with the GitHub username or org (e.g. `kristjantoop/GaaSAI` once the repo is on GitHub).

**Options:**

| Flag | Purpose |
|------|---------|
| `-a cursor` | Install only for Cursor |
| `-a claude-code` | Install only for Claude Code |
| `-a codex` | Install only for Codex |
| `-g` | Global (all projects) instead of current project |
| `-y` | Skip prompts |

**Examples:**

```bash
# Cursor + Claude Code, project scope
npx skills add <owner>/GaaSAI --skill growth-hacker -a cursor -a claude-code

# Global for Cursor
npx skills add <owner>/GaaSAI --skill growth-hacker -a cursor -g -y
```

**From a local clone (before publishing):**

```bash
npx skills add /path/to/GaaSAI --skill growth-hacker
```

---

## Available skills

### growth-hacker

**Use when:** growth playbook, viral loop, referral, acquisition channels, funnel optimization, retention, churn, competitor analysis, personas, content strategy, SEO for growth, growth ideas, growth audit, AARRR, North Star, launch strategy, growth experiments, launch execution, set up email/ads/analytics/payments, run campaigns, post to Twitter, or MCP for growth/launch.

### What it does

| Area | Capability |
|------|------------|
| **Playbooks** | Step-by-step playbooks for acquisition, activation, retention, revenue, referral (AARRR) |
| **Viral loops** | Word-of-mouth, inherent virality, incentivized referral, content/viral — with K-factor and implementation |
| **Channels** | Prioritized acquisition channels (organic, paid, content, partnerships, community, etc.) and channel mix |
| **Funnel** | Bottleneck analysis, conversion fixes, experiment prioritization (ICE) |
| **Retention** | Cohorts, churn, hooks, onboarding, win-back playbooks |
| **Competitors** | Positioning, features, pricing, opportunities, threats |
| **Personas** | User personas with goals, channels, objections |
| **Metrics** | North Star, trends, benchmarks, anomalies, next metrics |
| **Content & SEO** | Pillars, topics, distribution, 90-day plan |
| **Growth ideas** | Quick wins, medium-term plays, moonshots, ICE-scored |
| **Full audit** | End-to-end growth audit with insights and prioritized recommendations |
| **Launch execution** | Uses MCPs when available: email (Resend), ads (Meta, Google), analytics (PostHog), payments (Stripe), social (Twitter) |

### MCPs (when configured in your agent)

The skill **instructs** the agent to use these MCPs for *execution*; MCP access comes from your Cursor/Claude Code config.

| MCP | Use |
|-----|-----|
| `resend-mcp` | Domains, `send_email`, `send_batch` — welcome, activation, sequences |
| `meta-ads-mcp` | Campaigns, ad sets, ads, custom/lookalike audiences, pixel |
| `google-ads-mcp` | Conversion actions, campaigns, customer match |
| `posthog-mcp` | `capture`, `identify`, actions, cohorts, `query_insights` |
| `stripe-mcp` | Products, prices, checkout, billing portal |
| `twitter-mcp` | `post_tweet`, `post_thread`, `upload_media` |

If an MCP is not available, the agent still returns **plans and ready-to-run snippets**.

---

## Usage

Once installed, use growth or launch prompts in Cursor, Claude Code, or Codex. The agent applies the skill when the task matches.

**Examples:**

```
"Give me a growth playbook for acquisition for a B2B SaaS"
"Analyze acquisition channels for our seed-stage product"
"Design a viral loop for our collaborative app"
"Run a quick growth audit for [product]"
"Set up a welcome email for new signups"     → uses resend-mcp if configured
"Create a Meta launch campaign"              → uses meta-ads-mcp if configured
"Create Stripe products and checkout"        → uses stripe-mcp if configured
"Post our launch on Twitter"                 → uses twitter-mcp if configured
```

---

## Skill structure

```
skills/
└── growth-hacker/
    └── SKILL.md    # Instructions, frameworks, MCP guidance, output formats
```

---

## Also: programmatic use

For scripts, backends, or pipelines, the same capabilities are available as a **TypeScript package**:

```bash
npm install gaasai-growth-hacker-skill
```

```typescript
import growthHackerSkill, { BusinessContext } from 'gaasai-growth-hacker-skill';

const result = await growthHackerSkill.execute({
  sessionId: 'x',
  businessContext: { company: {...}, product: {...}, currentMetrics: {...}, ... }
});
// result.insights, result.nextActions, result.data
```

**From source:**

```bash
git clone https://github.com/<owner>/GaaSAI.git && cd GaaSAI
npm install && npm run build
```

Then `import` from `./src` or `./dist`. The repo also includes a **Launch Assistant** (checklist, email/ads/analytics/Stripe setup, MCP command generator) and **`MCP_SERVERS`** / **`mcpCommandGenerator`** for automation. See the full [API and architecture](#architecture) below.

---

## Architecture

```
GaaSAI/
├── skills/
│   └── growth-hacker/
│       └── SKILL.md           # Agent skill for Skills.sh / Cursor / Claude Code
├── src/
│   ├── core/                  # Types, SkillRegistry
│   ├── skills/                # GrowthHackerSkill, capabilities (Playbook, Viral, Channel, …)
│   ├── launch/                # LaunchAssistant, MCP configs, mcpCommandGenerator
│   └── index.ts
├── LAUNCH-SKILLS.md           # Test locally, publish on Skills.sh
└── README.md
```

**Programmatic entry points:** `growthHackerSkill`, `launchAssistant`, `MCP_SERVERS`, `mcpCommandGenerator`, and capability classes in `src/skills/capabilities/` (e.g. `PlaybookGenerator`, `ChannelAnalyzer`). See `src/index.ts` and type definitions for the full API.

**Frameworks in the skill:** AARRR, ICE, North Star, growth loops, Hook model.

---

## Publishing & testing

- **Test locally:** `npx skills add . --skill growth-hacker -a cursor -y` from the GaaSAI directory.
- **Publish on [Skills.sh](https://skills.sh):** Push the repo to GitHub; install with `npx skills add <owner>/GaaSAI --skill growth-hacker`. Skills.sh ranks by installs.

See **[LAUNCH-SKILLS.md](LAUNCH-SKILLS.md)** for step-by-step testing and publishing.

Contributions welcome — open an issue or PR.

---

## License

MIT

---

## About GaaSAI

GaaSAI (Growth as a Service AI) helps build tailored, efficient growth and marketing strategies with AI and structured playbooks.
