# Growth Hacker Skill

> AI-powered growth strategies, viral loops, acquisition channels, funnel optimization, retention playbooks, **product-led growth (PLG)**, competitor intel, personas, content/SEO, growth ideas, and launch execution. For startups and SMEs.

[![skills.sh](https://img.shields.io/badge/skills.sh-growth--hacker-000?style=flat)](https://skills.sh)

A [Skills.sh](https://skills.sh)–compatible agent skill for Cursor, Claude Code, and Codex. Teaches growth frameworks (AARRR, ICE, North Star, growth loops), playbooks, audits, and launch execution via MCPs when Resend, Meta/Google Ads, PostHog, Stripe, or Twitter are configured.

---

## Install

```bash
npx skills add kristjantoop/gaas-growth-hacker --skill growth-hacker
```

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
npx skills add kristjantoop/gaas-growth-hacker --skill growth-hacker -a cursor -a claude-code

# Global for Cursor
npx skills add kristjantoop/gaas-growth-hacker --skill growth-hacker -a cursor -g -y
```

**From a local clone (development):**

```bash
npx skills add /path/to/gaas-growth-hacker --skill growth-hacker
```

---

## Skills

Use when: **growth playbook**, **viral loop**, **referral**, **acquisition channels**, **funnel optimization**, **retention**, **churn**, **product-led growth**, **PLG**, **time-to-value**, **PQL**, **signup/onboarding/paywall**, **free-to-paid**, **expansion revenue**, **competitor analysis**, **personas**, **content strategy**, **SEO for growth**, **growth ideas**, **growth audit**, **AARRR**, **North Star**, **launch strategy**, **growth experiments**, **launch execution**, or **MCP** for email/ads/analytics/payments/social.

| Skill | What it does |
|-------|--------------|
| **Playbooks** | Step-by-step playbooks for acquisition, activation, retention, revenue, referral (AARRR) |
| **Viral loops** | Word-of-mouth, inherent virality, incentivized referral, content/viral — K-factor and implementation |
| **Channels** | Prioritized acquisition channels (organic, paid, content, partnerships, community) and channel mix |
| **Funnel** | Bottleneck analysis, conversion fixes, experiment prioritization (ICE) |
| **Retention** | Cohorts, churn, hooks, onboarding, win-back playbooks |
| **Competitors** | Positioning, features, pricing, opportunities, threats |
| **Personas** | User personas with goals, channels, objections |
| **Metrics** | North Star, trends, benchmarks, anomalies, next metrics |
| **Content & SEO** | Pillars, topics, distribution, 90-day plan |
| **Growth ideas** | Quick wins, medium-term plays, moonshots, ICE-scored |
| **PLG** | Signup, onboarding, activation, TTV, PQL, paywall, free-to-paid, expansion revenue; PLG audit |
| **Full audit** | End-to-end growth audit with insights and prioritized recommendations |
| **Launch execution** | Email (Resend), ads (Meta, Google), analytics (PostHog), payments (Stripe), social (Twitter) via MCPs when configured |

### MCPs (when configured in your agent)

| MCP | Use |
|-----|-----|
| `resend-mcp` | Domains, `send_email`, `send_batch` — welcome, activation, sequences |
| `meta-ads-mcp` | Campaigns, ad sets, ads, custom/lookalike audiences, pixel |
| `google-ads-mcp` | Conversion actions, campaigns, customer match |
| `posthog-mcp` | `capture`, `identify`, actions, cohorts, `query_insights` |
| `stripe-mcp` | Products, prices, checkout, billing portal |
| `twitter-mcp` | `post_tweet`, `post_thread`, `upload_media` |

If an MCP is not available, the agent returns **plans and ready-to-run snippets**.

---

## Usage

Use growth or launch prompts in Cursor, Claude Code, or Codex. The agent applies the skill when the task matches.

**Example prompts:**

```
"Give me a growth playbook for acquisition for a B2B SaaS"
"Analyze acquisition channels for our seed-stage product"
"Design a viral loop for our collaborative app"
"Run a PLG audit: signup, activation, free-to-paid"     → uses PLG section
"Optimize our onboarding for time-to-value"             → uses PLG section
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

## Programmatic use

The same capabilities are available as a **TypeScript package** for scripts, backends, or pipelines:

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
git clone https://github.com/kristjantoop/gaas-growth-hacker.git && cd gaas-growth-hacker
npm install && npm run build
```

Then `import` from `./src` or `./dist`. The repo includes a **Launch Assistant**, **`MCP_SERVERS`**, and **`mcpCommandGenerator`** for automation.

---

## Repo structure

```
gaas-growth-hacker/
├── skills/
│   └── growth-hacker/
│       └── SKILL.md           # Agent skill for Skills.sh / Cursor / Claude Code
├── src/
│   ├── core/                  # Types, SkillRegistry
│   ├── skills/                # GrowthHackerSkill, capabilities (Playbook, Viral, Channel, …)
│   ├── launch/                # LaunchAssistant, MCP configs, mcpCommandGenerator
│   └── index.ts
└── README.md
```

**Frameworks:** AARRR, ICE, North Star, growth loops, Hook model, PLG (PQL, TTV, self-serve funnel, expansion).

---

## Contributing

Contributions are welcome. Open an [issue](https://github.com/kristjantoop/gaas-growth-hacker/issues) or [pull request](https://github.com/kristjantoop/gaas-growth-hacker/pulls).

---

## License

MIT
