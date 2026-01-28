# Launching GaaSAI Growth Hacker on Skills.sh

This guide covers: **testing the skill locally** (Cursor, Claude Code) and **publishing on Skills.sh** so others can install it with `npx skills add`.

---

## 1. Skill format

The Skills.sh ecosystem uses **SKILL.md** files: markdown that teaches the AI how to do growth tasks. The skill lives at:

```
skills/growth-hacker/SKILL.md
```

The **TypeScript** `GrowthHackerSkill` in `src/` is for **programmatic** use (APIs, pipelines). The **SKILL.md** is for **interactive** use in Cursor, Claude Code, etc.

**MCPs & execution:** The skill instructs the agent to **use MCPs when available** for launch execution (email, ads, analytics, payments, social). The agent uses whatever MCPs you have configured in Cursor or Claude Code (e.g. `resend-mcp`, `meta-ads-mcp`, `posthog-mcp`, `stripe-mcp`, `twitter-mcp`). MCP access comes from your agent’s MCP config, not from the skill itself.

---

## 2. Test locally

### Option A: Install from your local repo (recommended while developing)

From the **GaaSAI** directory:

```bash
# List skills in this repo (optional)
npx skills add . --list

# Install the growth-hacker skill
npx skills add . --skill growth-hacker
```

By default this installs to **all detected agents** (Cursor, Claude Code, Codex, etc.). To target specific agents:

```bash
# Cursor only (project: .cursor/skills/ or global: ~/.cursor/skills/)
npx skills add . --skill growth-hacker -a cursor

# Claude Code only
npx skills add . --skill growth-hacker -a claude-code

# Cursor + Claude Code
npx skills add . --skill growth-hacker -a cursor -a claude-code
```

**Global install** (available in all your projects):

```bash
npx skills add . --skill growth-hacker -g -a cursor -a claude-code
```

### Option B: Manual copy (no CLI)

**Cursor**

- Project: copy `skills/growth-hacker/` to `.cursor/skills/growth-hacker/`
- Global: copy to `~/.cursor/skills/growth-hacker/`

**Claude Code**

- Project: copy to `.claude/skills/growth-hacker/`
- Global: copy to `~/.claude/skills/growth-hacker/`

### How to verify

1. **Cursor**: Start a chat and ask e.g. *“Give me a growth playbook for acquisition for a B2B SaaS”* or *“Analyze acquisition channels for a seed-stage marketplace.”* The agent should follow the Growth Hacker workflows.
2. **Claude Code**: Same prompts in Claude Code; it should use the playbook, channel, and funnel sections from the skill.

---

## 3. Publish on Skills.sh

Skills.sh installs from **GitHub**. Publishing = push a repo that contains `skills/growth-hacker/SKILL.md` (or the paths the skills CLI looks for).

### Step 1: Push GaaSAI to GitHub

If GaaSAI is not yet on GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/GaaSAI.git
git add skills/growth-hacker/SKILL.md
git commit -m "Add growth-hacker skill for Skills.sh"
git push -u origin main
```

Use your actual GitHub username and default branch if it’s not `main`.

### Step 2: Install from GitHub (you and others)

After the repo is public (or you’re logged in for private):

```bash
# GitHub shorthand
npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker

# Or full URL
npx skills add https://github.com/YOUR_USERNAME/GaaSAI --skill growth-hacker
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Appear on Skills.sh

Skills.sh ranks by **usage**. When people run:

```bash
npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker
```

those installs are reflected in the ecosystem. There is no separate “submit” form; the repo becomes discoverable via:

- `npx skills find growth`
- Direct install as above
- Optional: add a link from your README or docs to the install command.

---

## 4. Use in Cursor and Claude Code

### Cursor

- **Project**: `npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker -a cursor`  
  Puts the skill in `.cursor/skills/` (or the project’s Cursor skills path).
- **Global**: add `-g` so it’s in `~/.cursor/skills/` and available in every project.

### Claude Code

- **Project**: `npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker -a claude-code`
- **Global**: add `-g` for `~/.claude/skills/`

### Codex

- `npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker -a codex`

### Multiple agents at once

```bash
npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker -a cursor -a claude-code -a codex
```

---

## 5. One-liner for users

After you’ve pushed to GitHub, you can share:

```bash
npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker
```

For a specific agent:

```bash
npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker -a cursor
```

---

## 6. Updating the skill

1. Edit `skills/growth-hacker/SKILL.md`.
2. Commit and push.
3. Users update with:
   ```bash
   npx skills update
   ```
   or re-run:
   ```bash
   npx skills add YOUR_USERNAME/GaaSAI --skill growth-hacker
   ```

---

## 7. Programmatic vs SKILL.md

| Use case | Use |
|----------|-----|
| Chat in Cursor / Claude Code | `SKILL.md` (this skill) |
| Scripts, backends, pipelines | `gaasai-growth-hacker-skill` npm package / `GrowthHackerSkill` |

Both align on the same frameworks (AARRR, ICE, growth loops, etc.); the skill encodes the process for the AI, the package runs it in code.
