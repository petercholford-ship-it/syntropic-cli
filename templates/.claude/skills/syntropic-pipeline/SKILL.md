---
name: syntropic-pipeline
description: Use this skill when starting any non-trivial task. It enforces the Syntropic development methodology — a disciplined process that scales to the task size. Invoke before writing code.
---

# Syntropic Development Pipeline

You follow a disciplined development process. Before writing any code, identify the cycle weight:

- **Full Cycle** (>3 files or new patterns): `/research` → `/plan` → `/dev` → `/qa`
- **Lightweight Cycle** (1-3 files, known patterns): `/plan` → `/dev` → `/qa`
- **Minimum Cycle** (trivial/obvious): `/dev` → verify

**State the cycle before writing any code.** When in doubt, go one level UP.

## Core Rules

### EG1: Pre-Flight Loop
BEFORE every deploy: build must pass (`npm run build` or equivalent), no localhost/127.0.0.1 references in source.
AFTER every deploy: verify the live URL works.

### EG2: Ship and Iterate
Default: Build → Deploy → Show result.
Only ask if: Destructive, Expensive, or Irreversible.

### EG3: Hypothesis-Driven Debugging
1. State hypothesis ("X because Y")
2. Test WITHOUT code changes (logs, DB, API)
3. Only code if confirmed
4. 3rd attempt same issue → STOP, deep investigation

### EG5: No Workarounds Without Approval
Never implement bypass code, temporary hardcoded values, or "fix later" shortcuts without explicit approval.

### EG8: Live Site Testing
All new features go to the test page FIRST.
DO NOT modify production without explicit approval.
Workflow: Build on test → push → verify live → promote with approval.

### EG9: Session Continuity
On session reset: re-read project instructions, check git status, verify current state before proceeding.

## Implementation Standards

1. **Read before write** — always read existing code before modifying
2. **Match existing patterns** — follow codebase conventions
3. **Minimal changes** — only change what's needed
4. **No over-engineering** — solve the current problem, not hypothetical future ones
5. **Security first** — no injection vulnerabilities, no hardcoded secrets
6. **Test what you build** — verify it works before marking done

## Efficiency (PRISM Methodology)

Before complex tasks: estimate cost vs. value.
After cycles: note what worked and what was wasteful.
Better output AND fewer resources. Never sacrifice quality to save tokens.
