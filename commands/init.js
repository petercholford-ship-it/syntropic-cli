/**
 * syntropic init [project-name]
 *
 * Scaffolds a project with the Syntropic development pipeline:
 * - Instruction files for Claude Code, Cursor, Windsurf, and/or GitHub Copilot
 * - .claude/ directory with generic agents (Claude Code)
 * - .github/workflows/ with health check + auto-remediation
 * - scripts/health-check.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const TOOLS = {
  claude:   { label: 'Claude Code',      file: 'CLAUDE.md',                        hasAgents: true,  hasSkills: true  },
  cursor:   { label: 'Cursor',           file: '.cursorrules',                     hasAgents: false, hasSkills: false },
  windsurf: { label: 'Windsurf',         file: '.windsurfrules',                   hasAgents: false, hasSkills: false },
  copilot:  { label: 'GitHub Copilot',   file: '.github/copilot-instructions.md',  hasAgents: false, hasSkills: false },
  codex:    { label: 'OpenAI Codex',     file: 'AGENTS.md',                        hasAgents: false, hasSkills: true  },
};

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function askMultiSelect(question, options) {
  console.log(question);
  options.forEach((opt, i) => {
    console.log(`    ${i + 1}. ${opt.label}`);
  });
  const answer = await ask('  Enter numbers separated by commas (e.g. 1,2,3) or "all": ');

  if (answer.toLowerCase() === 'all' || answer === '') {
    return options.map(o => o.key);
  }

  const indices = answer.split(',').map(s => parseInt(s.trim(), 10) - 1);
  return indices
    .filter(i => i >= 0 && i < options.length)
    .map(i => options[i].key);
}

function copyDir(src, dest, exclude) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip template files (handled separately) and excluded patterns
    if (entry.name.endsWith('.template')) continue;
    if (exclude && exclude.some(e => srcPath.includes(e))) continue;

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, exclude);
    } else {
      // Don't overwrite existing files
      if (fs.existsSync(destPath)) {
        console.log(`  skip  ${path.relative(process.cwd(), destPath)} (already exists)`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  create  ${path.relative(process.cwd(), destPath)}`);
      }
    }
  }
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

function hasSyntropicMarker(filePath) {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath, 'utf8').includes('<!-- syntropic -->');
}

function renderTemplate(templateFile, replacements) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  if (!fs.existsSync(templatePath)) return null;
  let content = fs.readFileSync(templatePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  return content;
}

function writeOrAppend(fullTemplate, appendTemplate, destPath, replacements) {
  const relPath = path.relative(process.cwd(), destPath);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  if (!fs.existsSync(destPath)) {
    // New file — write full template
    const content = renderTemplate(fullTemplate, replacements);
    if (content) fs.writeFileSync(destPath, content, 'utf8');
    console.log(`  create  ${relPath}`);
    return 'created';
  } else if (hasSyntropicMarker(destPath)) {
    console.log(`  skip  ${relPath} (Syntropic rules already present)`);
    return 'skipped';
  } else {
    // Existing file without Syntropic — append methodology
    const appendContent = renderTemplate(appendTemplate, replacements);
    if (appendContent) fs.appendFileSync(destPath, appendContent, 'utf8');
    console.log(`  append  ${relPath} (added Syntropic pipeline rules)`);
    return 'appended';
  }
}

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace('--', '');
      flags[key] = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
    } else {
      positional.push(args[i]);
    }
  }
  return { flags, positional };
}

function detectTools(targetDir) {
  const detected = [];
  if (fs.existsSync(path.join(targetDir, 'CLAUDE.md')) || fs.existsSync(path.join(targetDir, '.claude'))) {
    detected.push('claude');
  }
  if (fs.existsSync(path.join(targetDir, '.cursorrules'))) {
    detected.push('cursor');
  }
  if (fs.existsSync(path.join(targetDir, '.windsurfrules'))) {
    detected.push('windsurf');
  }
  if (fs.existsSync(path.join(targetDir, '.github', 'copilot-instructions.md'))) {
    detected.push('copilot');
  }
  if (fs.existsSync(path.join(targetDir, 'AGENTS.md')) || fs.existsSync(path.join(targetDir, '.agents'))) {
    detected.push('codex');
  }
  return detected;
}

async function run(args) {
  console.log('\n  syntropic init — Philosophy-as-code development pipeline\n');

  const { flags, positional } = parseFlags(args);

  // Determine target directory
  const projectArg = positional[0];
  let targetDir;

  if (projectArg) {
    targetDir = path.resolve(process.cwd(), projectArg);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`  Created ${projectArg}/\n`);
    }
  } else {
    targetDir = process.cwd();
  }

  // Gather project info — flags override interactive prompts
  const dirName = path.basename(targetDir);
  const isInteractive = process.stdin.isTTY !== false && !flags.yes;

  const projectName = flags.name || (isInteractive ? await ask(`  Project name (${dirName}): `) : '') || dirName;
  const testUrl = flags['test-url'] || '/test';
  const prodUrl = flags['prod-url'] || '/';
  const prodDomain = flags.domain || 'example.com';

  // Select AI tools
  let selectedTools;

  if (flags.tools) {
    // --tools claude,cursor,windsurf,copilot
    selectedTools = flags.tools.split(',').map(t => t.trim().toLowerCase());
  } else if (isInteractive) {
    const toolOptions = Object.entries(TOOLS).map(([key, val]) => ({ key, label: val.label }));
    selectedTools = await askMultiSelect('\n  Which AI coding tools do you use?', toolOptions);
    if (selectedTools.length === 0) selectedTools = ['claude'];
  } else {
    // Non-interactive default: all tools
    selectedTools = Object.keys(TOOLS);
  }

  const replacements = {
    '\\{\\{PROJECT_NAME\\}\\}': projectName,
    '\\{\\{TEST_URL\\}\\}': testUrl,
    '\\{\\{PROD_URL\\}\\}': prodUrl,
    '\\{\\{PROD_DOMAIN\\}\\}': prodDomain,
  };

  console.log('\n  Scaffolding...\n');

  // Always exclude instruction files from copyDir — we handle them via writeOrAppend
  const exclude = ['CLAUDE.md', 'AGENTS.md'];
  if (!selectedTools.includes('claude')) {
    exclude.push('.claude');
  }
  if (!selectedTools.includes('codex')) {
    exclude.push('.agents');
  }

  // Copy shared template files (workflows, scripts, agents)
  copyDir(TEMPLATES_DIR, targetDir, exclude);

  // Template mapping: [full template, append template]
  const templateMap = {
    claude:   ['CLAUDE.md',                     'claude-append.template'],
    cursor:   ['cursorrules.template',          'tool-append.template'],
    windsurf: ['windsurfrules.template',        'tool-append.template'],
    copilot:  ['copilot-instructions.template', 'tool-append.template'],
    codex:    ['agents-md.template',            'tool-append.template'],
  };

  // Generate instruction files — create new or append to existing
  const actions = {};
  for (const tool of selectedTools) {
    const [fullTpl, appendTpl] = templateMap[tool];
    const destPath = path.join(targetDir, TOOLS[tool].file);
    actions[tool] = writeOrAppend(fullTpl, appendTpl, destPath, replacements);
  }

  // Make health check executable
  const healthScript = path.join(targetDir, 'scripts', 'health-check.js');
  if (fs.existsSync(healthScript)) {
    fs.chmodSync(healthScript, '755');
  }

  // Build summary
  const toolFiles = selectedTools.map(t => {
    const info = TOOLS[t];
    const pad = info.file.padEnd(36);
    return `    ${pad}${info.label} instructions`;
  }).join('\n');

  const hasClaude = selectedTools.includes('claude');
  const hasCodex = selectedTools.includes('codex');
  const hasSkills = hasClaude || hasCodex;

  let extras = '';
  if (hasClaude) {
    extras += '\n    .claude/EVERGREEN_RULES.md          Full rule reference';
    extras += '\n    .claude/commands/*.md               Generic agents (dev, qa, research, plan, devops, security)';
    extras += '\n    .claude/skills/syntropic-pipeline/  Discoverable skill for Claude Code';
  }
  if (hasCodex) {
    extras += '\n    .agents/skills/syntropic-pipeline/  Discoverable skill for Codex';
  }

  console.log(`
  Done! Your project is set up with the Syntropic pipeline.

  What was created:
${toolFiles}${extras}
    .github/workflows/                  Daily health check with auto-remediation
    scripts/health-check.js             Local health check script

  Tools configured: ${selectedTools.map(t => TOOLS[t].label).join(', ')}

  Next steps:
    1. Review your instruction files and adjust for your project
    2. Start building! Use the EG7 pipeline:
       Full:        research -> plan -> dev -> qa -> test
       Lightweight: plan -> dev -> qa -> test
       Minimum:     dev -> test

  The methodology is your superpower. Ship and iterate.

  Want deeper analysis? Our Intelligent Analyser runs 8 philosophy
  lenses against your idea: syntropicworks.com/intelligent-analyser

  Learn more: https://www.syntropicworks.com
`);
}

module.exports = run;
