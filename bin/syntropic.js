#!/usr/bin/env node

/**
 * Syntropic CLI
 * Philosophy-as-code development pipeline.
 *
 * Usage:
 *   npx syntropic init [project-name]
 *   npx syntropic health
 *   npx syntropic --help
 */

const args = process.argv.slice(2);
const command = args[0];

const COMMANDS = {
  init: () => require('../commands/init'),
  add: () => require('../commands/add'),
  health: () => require('../commands/health'),
};

// Version flag
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// Help
if (!command || args.includes('--help') || args.includes('-h')) {
  console.log(`
  syntropic — Philosophy-as-code development pipeline

  Usage:
    syntropic init [project-name]   Scaffold a new project with the Syntropic pipeline
    syntropic add <tool> [tool...]  Add support for another AI tool
    syntropic health                Run a local health check
    syntropic --version             Show version
    syntropic --help                Show this help

  What you get:
    - Instruction files for Claude Code, Cursor, Windsurf, GitHub Copilot, and/or OpenAI Codex
    - SKILL.md for automatic discovery by Claude Code and Codex
    - Evergreen Rules (EG1-EG9) — a disciplined dev pipeline
    - Generic agents: dev, qa, research, plan, devops, security (Claude Code)
    - Daily health check workflow with auto-remediation
    - PRISM efficiency tracking methodology

  Flags (init):
    --tools claude,cursor,windsurf,copilot,codex   Select AI tools (default: all)
    --name "My Project"                      Project name
    --domain example.com                     Production domain
    --test-url /test                         Test page path
    --prod-url /                             Production page path
    --yes                                    Skip interactive prompts

  Learn more: https://www.syntropicworks.com
`);
  process.exit(0);
}

// Run command
if (COMMANDS[command]) {
  const mod = COMMANDS[command]();
  const run = mod.default || mod;
  run(args.slice(1));
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Run "syntropic --help" for usage.');
  process.exit(1);
}
