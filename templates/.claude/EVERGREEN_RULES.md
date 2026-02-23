# EVERGREEN RULES v5.0 — Ship Fast, Learn Fast

**Universal rules portable across all repos. No project-specific details here.**

---

## EG1: Pre-Flight Loop (MANDATORY)

BEFORE EVERY DEPLOY:
- `npm run build` (must pass)
- grep localhost/127.0.0.1 (must be clean)
- Loop until ALL CLEAN

AFTER EVERY DEPLOY:
- Verify the live URL works
- Revert immediately if broken

## EG2: Ship and Iterate

Default: Build -> Deploy -> Show result.
Only ask if: Destructive, Expensive, or Irreversible.
Everything else: JFDI.

## EG3: Hypothesis-Driven Debugging

1. State hypothesis ("X because Y")
2. Test WITHOUT code changes (logs, DB, API)
3. Only code if confirmed
4. If wrong: document learning, don't jump to next hypothesis

3rd attempt same issue -> STOP, deep investigation.

## EG4: Human-First Viability

Build for:
- Human problem (not technical elegance)
- Minimal human friction
- Works TODAY

OK to compromise code elegance for UX.

## EG5: Workarounds Require Explicit Approval

STOP before implementing:
- Bypass code (admin mode, skip validation)
- Temporary hardcoded values
- "We'll fix properly later" shortcuts
- Disabling security/validation

Process: Explain tradeoffs -> WAIT for approval -> Only then proceed.

## EG6: Outcome Alignment

Before building, ask: "If our user achieves their goal completely, what happens to our product?"
- Good: They succeed -> we succeed
- Warning: No connection
- Red flag: They succeed -> we lose

## EG7: Implementation Pipeline (MANDATORY)

ALL non-trivial work MUST follow the development cycle:

**Full Cycle** (new features, major changes):
1. `/research` — Understand the problem space
2. `/plan` — Break into implementation steps
3. `/dev` — Build it
4. `/qa` — Quality and security review
5. Verify — Test it works

**Lightweight Cycle** (small features, known patterns):
1. `/plan` — Brief breakdown
2. `/dev` — Build it
3. `/qa` — Quick review

**Minimum Cycle** (trivial fixes):
1. `/dev` — Build it
2. Verify — Test it works

Choosing the right weight:
- If it touches >3 files or introduces new patterns -> Full Cycle
- If it touches 1-3 files with known patterns -> Lightweight Cycle
- If it's a single obvious change -> Minimum Cycle
- When in doubt, go one level up

## EG8: Live Site Testing (MANDATORY)

- Every project has a test page and a production page (defined in CLAUDE.md)
- All new features go to the test page FIRST
- NEVER modify production without explicit approval
- Workflow: Build on test -> push -> verify live -> promote with approval

## EG9: Session Continuity (MANDATORY)

When a session resets or context compacts:
1. Re-read CLAUDE.md and this file
2. Run `git status` and `git log --oneline -5`
3. Do NOT assume prior context is accurate — verify it
4. Do NOT deviate from workflows because context was lost
