# Syntropic CLI — Product Roadmap & Backlog

*Last updated: Feb 2026*

---

## Current State: v0.5.0 (Public, Free, MIT)

Commands: `init`, `add`, `health`
Tools: Claude Code, Cursor, Windsurf, GitHub Copilot, OpenAI Codex
Revenue: $0 — distribution/marketing funnel for SyntropicWorks

---

## Phase 1: Distribution (NOW — Week 1-4)

### Goal: 500+ npm installs, presence on all relevant platforms

### Marketplace Submissions — Ready Now

| Platform | Effort | Status | Action |
|----------|--------|--------|--------|
| npm | Done | Live | npmjs.com/package/syntropic |
| cursor.directory | Done | PR #314 open | Follow up on PR |
| awesome-cursorrules | Done | PR #172 open, checks passing | Follow up on PR |
| SkillsMP | 10 min | Not done | Auto-indexes SKILL.md from public GitHub repos (needs 2+ stars). SKILL.md already exists — ensure it's in syntropic-cli repo |
| DevHunt | 10 min | Not done | Free submission at devhunt.org — "Product Hunt for devs", 50K+ engineers |
| StackShare | 20 min | Not done | Create + claim tool page |
| AlternativeTo | 15 min | Not done | Free listing, good organic search |
| Console.dev | 5 min | Not done | Email david@console.dev (beta/early-access tools only) |
| OpenAlternative | 10 min | Not done | Free submission for open-source tools at openalternative.co/submit |
| opensourcealternative.to | 10 min | Not done | Free submission at opensourcealternative.to/submit |

### Awesome List PRs — Ready Now

| Repository | Stars | Fit | Status |
|------------|-------|-----|--------|
| awesome-cursorrules (PatrickJS) | 2K+ | .cursorrules configs | PR #172 submitted |
| awesome-claude-code (hesreallyhim) | Growing | Claude Code skills, hooks, commands | Not done |
| awesome-claude-code-toolkit (rohitg00) | Growing | 135 agents, 35 skills, 42 commands | Not done |
| awesome-agent-skills (heilcheng) | Growing | Skills for AI coding agents | Not done |
| awesome-agent-skills (VoltAgent) | Growing | 380+ agent skills | Not done |
| awesome-claude-skills (travisvn) | Growing | Claude Skills and resources | Not done |
| awesome-claude-skills (ComposioHQ) | Growing | Claude Skills, resources, tools | Not done |
| awesome-AI-driven-development (eltociear) | Growing | AI-Driven Development methodologies | Not done |
| awesome-ai-coding-tools (ai-for-developers) | Growing | AI-powered coding tools | Not done |
| awesome-cli-apps (agarrharr) | High | Curated CLI apps | Not done |
| ai-prompts (instructa) | Growing | AI prompts for Cursor, Cline, Windsurf, Copilot | Not done |

### Social Launch — Posts Ready

| Channel | Timing | Draft Location |
|---------|--------|----------------|
| r/ClaudeAI | Day 1 | cli/marketing/reddit-claude-ai.md |
| r/cursor | Day 2 | cli/marketing/reddit-cursor.md |
| Anthropic Discord #claude-code | Day 3-4 | Short casual post |
| r/ChatGPTCoding | Week 2 | Adapt reddit-chatgptpro.md |
| r/webdev | Week 2 | cli/marketing/reddit-webdev.md |
| LinkedIn | Week 2 | cli/marketing/linkedin.md |
| Twitter/X thread | Week 2 | cli/marketing/twitter-thread.md |
| r/ExperiencedDevs | Week 3 | Process discipline angle |
| r/SideProject | Week 2 | Build-in-public angle |
| Show HN | Week 3 (Tue-Thu, 9-11am ET) | cli/marketing/show-hn.md |
| dev.to article | Week 3 | "I gave my AI coding tools a methodology" |

### Newsletter Submissions

| Newsletter | Audience | How to Submit |
|------------|----------|---------------|
| TLDR (tldr.tech) | ~1.2M devs | Free submission form |
| Bytes.dev | JS-focused | Free submission |
| Console.dev | Dev tools | Email david@console.dev |
| Changelog | OSS tooling | Submit via site |
| Hacker Newsletter | Curates top HN | Get on HN first |
| Ben's Bites | AI-focused | Submit via site |

---

## Phase 2: Retention & Revenue (Month 1-3)

### Goal: Recurring engagement, first revenue signal

### CLI Features to Build

| Feature | Priority | Impact | Effort |
|---------|----------|--------|--------|
| `syntropic update` | P0 | Retention — pull latest methodology version. Without this, CLI is run-once. | 2-3 days |
| Consulting CTA in CLI output | P0 | Revenue — "Need deeper analysis? syntropicworks.com/analyser" | 1 hour |
| Update README for Codex | P0 | Accuracy — v0.5.0 added Codex but README missing it | 30 min |
| GitHub README badge | P1 | Virality — "Syntropic Pipeline: Healthy" badge for READMEs | 1 day |
| `syntropic report` | P1 | Retention — weekly/monthly pipeline health summary | 3-5 days |
| Homebrew tap | P1 | Distribution — `brew install syntropic` | 1 hour |
| Branded CI log line | P2 | Virality — `[syntropic] Pre-flight passed` in CI output | 2 hours |

### Starter Template Repos

| Repo | Purpose |
|------|---------|
| syntropic-nextjs-starter | GitHub template repo with Syntropic pre-configured |
| syntropic-express-starter | Same for Express/Node |
| syntropic-python-starter | Same for Python projects |

### Revenue Path

| Path | Timing | Revenue |
|------|--------|---------|
| Consulting CTA in CLI output | Now | $500-2,000/engagement |
| `syntropic analyse` (usage-based, $0.25-0.50/analysis) | Month 3-4 | Validate willingness to pay |
| Pro subscription ($19/mo) | Month 5-6 | Target: $1,000-3,000/mo MRR |
| Team tier ($49/mo, anchor) | Month 8+ | Makes Pro look rational |

---

## Phase 3: Platform Extensions (Month 3-6)

### Goal: Presence on all major dev tool marketplaces

| Platform | What to Build | Effort | Impact |
|----------|--------------|--------|--------|
| VS Code extension | Thin wrapper: command palette → `syntropic init/health`. Publish to VS Code Marketplace + Open VSX simultaneously | Days | Very High — largest dev tool discovery surface |
| GitHub Action | `syntropic/check` — validates methodology compliance in CI/PRs | Hours | Medium — GitHub Marketplace listing |
| Open VSX | Same .vsix as VS Code extension | Zero (if VS Code done) | Low-Medium |
| Product Hunt | Full launch with testimonials + download stats | Medium | High — wait for 500+ downloads |
| Community rule packs | `syntropic add-rule strict-security`, `syntropic add-rule react-patterns` | Days | High retention — CLI becomes a package manager for AI rules |

### Not Worth It (Yet)

| Platform | Why Skip |
|----------|---------|
| JetBrains Marketplace | Requires JVM plugin — too much engineering for the audience |
| G2 / Capterra | Enterprise B2B review sites — wrong audience |
| JSR.io | Only useful if CLI converts to TypeScript |
| MCP Server registries | Only relevant if we build an MCP server component |

---

## Phase 4: Pro Tier — `syntropic analyse` (Month 3-6)

### Goal: First paying users, validate revenue model

### Architecture

```
CLI (public, free)          → npx syntropic init/health/update
CLI Pro (authenticated)     → npx syntropic analyse "My idea..."
                              ↓
Server-side API             → 8-lens philosophy analysis
(SyntropicWorks backend)      Philosophy prompts NEVER leave server
                              ↓
Returns                     → Analysis report, validation plan, verdict
```

### IP Protection Strategy

The philosophy agents (27 agents, 8 lenses) are the core IP. They must stay **server-side only**.

- **Free CLI** (public npm): Templates, EG rules, generic agents — open source, MIT
- **Pro analysis** (server-side API): Philosophy prompts, orchestration logic — never distributed
- **Authentication**: Stripe → API key → CLI sends idea text to API → receives analysis

See: "IP Protection" section below for npm private packages evaluation.

### Pricing Architecture (Sloan Lens)

| Tier | Price | What You Get |
|------|-------|-------------|
| Community | Free forever | EG pipeline, generic agents, health check |
| Pro | $19/mo or $0.25/analysis | 8-lens analysis, validation plan, project history, PDF export |
| Team | $49/mo | Everything in Pro + shared analyses, custom agents, priority support |

### Kill Criteria

| Metric | Threshold | Consequence |
|--------|-----------|-------------|
| npm installs at 30 days | <200 | Reassess messaging and channels |
| Active users at 60 days | <50 | Build `syntropic update` for retention |
| Pro users at 90 days post-launch | <10 | Pivot to CLI-as-marketing-for-consulting |

---

## IP Protection: npm Private Packages Evaluation

### The Question
npm Pro ($7/mo) allows private packages. Could we use `@syntropic/agents` as a private package to protect the philosophy agent content?

### The Answer: No — private npm doesn't protect IP

**Why it doesn't work:**

1. **Private ≠ protected.** npm private packages are "private" in that they're not publicly discoverable. But anyone who `npm install`s them gets the full source code on their local machine. They can read every file, copy content, redistribute it. There's no encryption, no obfuscation, no DRM.

2. **The content IS the value.** Unlike a library where the value is in the API/functionality, the philosophy agents are literally text prompts. Once a user has the text, they have everything. There's no compiled code, no runtime dependency — just markdown files with instructions.

3. **npm Pro scoping creates friction.** Users would need to authenticate with npm to install a scoped private package (`npm login`, `.npmrc` config). This adds onboarding friction for a CLI tool whose entire value proposition is "one command, zero config."

4. **It doesn't scale to a business model.** npm Pro at $7/mo gives YOU private packages. It doesn't charge your users. You'd need npm Organizations ($7/user/mo) to manage team access, and you'd still be managing npm auth tokens as your billing mechanism instead of a proper payment system.

### What DOES Protect IP

| Approach | Protection Level | How |
|----------|-----------------|-----|
| **Server-side API** (recommended) | Strong | Philosophy prompts live on SyntropicWorks server. CLI sends idea text → receives analysis. Prompts never leave the server. |
| **Encrypted + key-gated npm package** | Weak | Obfuscation, not protection. Determined user can always extract. |
| **npm private package** | Minimal | Hides from public search. Doesn't prevent copying by authorised users. |
| **License restriction** (not MIT) | Legal only | The free CLI is MIT. Pro content could use a proprietary license. Legal deterrent, not technical protection. |

### Recommendation

**Don't use npm private packages for IP protection. Use a server-side API.**

The CLI is the distribution vehicle (free, public, MIT). The intelligence stays on the server (proprietary, API-gated, Stripe-billed). This is the Terraform CLI → Terraform Cloud model.

The $7/mo npm Pro spend would be better allocated to the API infrastructure that actually protects the IP while generating revenue.

### Where npm Pro IS Useful

npm Pro could be useful for:
- Publishing scoped packages (`@syntropic/cli`) for branding consistency
- Private packages for internal build tooling (not customer-facing)
- If you eventually have a monorepo with multiple packages

But not for IP protection of the philosophy agents.
