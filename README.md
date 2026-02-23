# syntropic

A development methodology for AI-assisted coding. Works with **Claude Code**, **Cursor**, **Windsurf**, **GitHub Copilot**, and **OpenAI Codex**.

One command gives your AI coding tools a disciplined development pipeline — so they research before they plan, plan before they build, and review before they ship.

## Quick Start

```bash
npx syntropic init my-project
```

Or add to an existing project:

```bash
cd my-project
npx syntropic init
```

You'll be asked which AI tools you use. The CLI generates the right instruction files for each:

| Tool | File Generated |
|------|---------------|
| Claude Code | `CLAUDE.md` + `.claude/commands/` agents + `SKILL.md` |
| Cursor | `.cursorrules` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex | `AGENTS.md` + `SKILL.md` |

## What You Get

**Evergreen Rules (EG1-EG9)** — a portable set of development principles:

- **EG1: Pre-Flight Loop** — build must pass, no localhost refs, verify after deploy
- **EG2: Ship and Iterate** — bias to action, only pause for destructive/expensive/irreversible
- **EG3: Hypothesis-Driven Debugging** — state hypothesis, test without code changes, only code if confirmed
- **EG7: Implementation Pipeline** — scale process to task size (Full / Lightweight / Minimum cycle)
- **EG8: Live Site Testing** — test page first, promote to production with approval
- **EG9: Session Continuity** — re-read rules on reset, verify state before proceeding

**Generic Agents** (Claude Code) — dev, qa, research, plan, devops, security

**Health Check** — daily GitHub Action with auto-remediation (npm audit fix PRs)

**PRISM Methodology** — track efficiency: estimate cost vs. value before complex tasks, learn what works

## Commands

```bash
# Scaffold a new project
npx syntropic init my-project

# Select specific tools
npx syntropic init my-project --tools claude,cursor

# Customise project URLs (optional — sensible defaults applied)
npx syntropic init my-project --name "My App" --domain myapp.com --test-url /staging --prod-url /

# Add a tool to an existing project
npx syntropic add cursor
npx syntropic add windsurf copilot

# Run a local health check (EG1 pre-flight)
npx syntropic health
```

## Existing Projects

Running `syntropic init` in a project that already has a `CLAUDE.md` or `.cursorrules` will **append** the methodology to your existing file — it never overwrites. A `<!-- syntropic -->` marker prevents duplicate rules on re-runs.

## The Methodology

The core idea: AI coding tools are powerful but undisciplined. Without rules, they jump straight to code, skip investigation, retry failed approaches, and introduce regressions.

Syntropic gives them a process:

1. **Research** — understand the problem before proposing solutions
2. **Plan** — break work into sequenced steps, identify risks
3. **Build** — implement with minimal changes, match existing patterns
4. **Review** — check security, quality, and correctness
5. **Verify** — test on a live URL, not just locally

Scale the process to the task. A typo fix doesn't need research. A new feature does.

## Philosophy

- **Ship and iterate** — momentum over perfection
- **Hypothesis-driven** — test before you code
- **Outcome-aligned** — if the user succeeds, do we succeed?
- **No workarounds** — no bypasses, no "fix later", no shortcuts without approval

## Links

- [Website](https://www.syntropicworks.com)
- [GitHub](https://github.com/petercholford-ship-it/syntropic-cli)
- [Intelligent Analyser](https://www.syntropicworks.com/intelligent-analyser) — deep-dive analysis through 8 philosophy lenses

## License

MIT
