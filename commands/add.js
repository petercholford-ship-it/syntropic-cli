/**
 * syntropic add <tool> [tool...]
 *
 * Adds Syntropic pipeline support for additional AI coding tools
 * to an existing project. Creates new instruction files or appends
 * rules to existing ones.
 *
 * Examples:
 *   syntropic add cursor
 *   syntropic add cursor windsurf copilot
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

const TEMPLATE_MAP = {
  claude:   ['CLAUDE.md',                     'claude-append.template'],
  cursor:   ['cursorrules.template',          'tool-append.template'],
  windsurf: ['windsurfrules.template',        'tool-append.template'],
  copilot:  ['copilot-instructions.template', 'tool-append.template'],
  codex:    ['agents-md.template',            'tool-append.template'],
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

function copySkillsDir(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copySkillsDir(srcPath, destPath);
    } else if (!fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  create  ${path.relative(process.cwd(), destPath)}`);
    }
  }
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
    const content = renderTemplate(fullTemplate, replacements);
    if (content) fs.writeFileSync(destPath, content, 'utf8');
    console.log(`  create  ${relPath}`);
    return 'created';
  } else if (hasSyntropicMarker(destPath)) {
    console.log(`  skip  ${relPath} (Syntropic rules already present)`);
    return 'skipped';
  } else {
    const appendContent = renderTemplate(appendTemplate, replacements);
    if (appendContent) fs.appendFileSync(destPath, appendContent, 'utf8');
    console.log(`  append  ${relPath} (added Syntropic pipeline rules)`);
    return 'appended';
  }
}

function detectExistingConfig(targetDir) {
  // Try to read project config from existing Syntropic instruction files
  for (const tool of Object.values(TOOLS)) {
    const filePath = path.join(targetDir, tool.file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const config = {};

      // Extract test URL
      const testMatch = content.match(/Test page:\s*(\S+)/);
      if (testMatch) config.testUrl = testMatch[1];

      // Extract prod URL
      const prodMatch = content.match(/Production:\s*(\S+)/);
      if (prodMatch) config.prodUrl = prodMatch[1];

      // Extract domain
      const domainMatch = content.match(/Production domain:\*?\*?\s*(\S+)/);
      if (domainMatch) config.prodDomain = domainMatch[1];

      // Extract project name
      const nameMatch = content.match(/## Project:\s*(.+)/);
      if (nameMatch) config.projectName = nameMatch[1].trim();

      if (Object.keys(config).length > 0) return config;
    }
  }
  return null;
}

async function run(args) {
  const validTools = Object.keys(TOOLS);
  const requestedTools = args.map(a => a.toLowerCase()).filter(a => validTools.includes(a));

  if (requestedTools.length === 0) {
    console.log(`
  syntropic add — Add AI tool support to an existing project

  Usage:
    syntropic add cursor                Add Cursor support
    syntropic add windsurf copilot      Add multiple tools
    syntropic add claude                Add Claude Code support

  Available tools: ${validTools.join(', ')}
`);
    process.exit(0);
  }

  const targetDir = process.cwd();
  console.log(`\n  syntropic add — Adding ${requestedTools.map(t => TOOLS[t].label).join(', ')}\n`);

  // Try to detect project config from existing instruction files
  const existing = detectExistingConfig(targetDir);
  const isInteractive = process.stdin.isTTY !== false;

  const dirName = path.basename(targetDir);
  const projectName = existing?.projectName || (isInteractive ? await ask(`  Project name (${dirName}): `) : '') || dirName;
  const testUrl = existing?.testUrl || (isInteractive ? await ask('  Test page URL path (e.g. /test): ') : '') || '/test';
  const prodUrl = existing?.prodUrl || (isInteractive ? await ask('  Production URL path (e.g. /): ') : '') || '/';
  const prodDomain = existing?.prodDomain || (isInteractive ? await ask('  Production domain (e.g. example.com): ') : '') || 'example.com';

  if (existing) {
    console.log(`  Detected config: ${projectName} (${prodDomain})\n`);
  }

  const replacements = {
    '\\{\\{PROJECT_NAME\\}\\}': projectName,
    '\\{\\{TEST_URL\\}\\}': testUrl,
    '\\{\\{PROD_URL\\}\\}': prodUrl,
    '\\{\\{PROD_DOMAIN\\}\\}': prodDomain,
  };

  for (const tool of requestedTools) {
    const [fullTpl, appendTpl] = TEMPLATE_MAP[tool];
    const destPath = path.join(targetDir, TOOLS[tool].file);
    writeOrAppend(fullTpl, appendTpl, destPath, replacements);
  }

  // If adding Claude, copy agents + skills
  if (requestedTools.includes('claude')) {
    const claudeDir = path.join(targetDir, '.claude');
    const templateClaudeDir = path.join(TEMPLATES_DIR, '.claude');
    if (fs.existsSync(templateClaudeDir)) {
      const { copyDir } = require('./init');
      if (typeof copyDir === 'function') {
        copyDir(templateClaudeDir, claudeDir);
      } else {
        // Inline copy for agents
        const commandsDir = path.join(templateClaudeDir, 'commands');
        const destCommandsDir = path.join(claudeDir, 'commands');
        if (fs.existsSync(commandsDir)) {
          if (!fs.existsSync(destCommandsDir)) fs.mkdirSync(destCommandsDir, { recursive: true });
          for (const file of fs.readdirSync(commandsDir)) {
            const dest = path.join(destCommandsDir, file);
            if (!fs.existsSync(dest)) {
              fs.copyFileSync(path.join(commandsDir, file), dest);
              console.log(`  create  ${path.relative(process.cwd(), dest)}`);
            }
          }
        }
        // Copy EVERGREEN_RULES.md
        const egSrc = path.join(templateClaudeDir, 'EVERGREEN_RULES.md');
        const egDest = path.join(claudeDir, 'EVERGREEN_RULES.md');
        if (fs.existsSync(egSrc) && !fs.existsSync(egDest)) {
          fs.copyFileSync(egSrc, egDest);
          console.log(`  create  ${path.relative(process.cwd(), egDest)}`);
        }
        // Copy skills
        const skillsSrc = path.join(templateClaudeDir, 'skills');
        const skillsDest = path.join(claudeDir, 'skills');
        if (fs.existsSync(skillsSrc)) {
          copySkillsDir(skillsSrc, skillsDest);
        }
      }
    }
  }

  // If adding Codex, copy .agents/skills
  if (requestedTools.includes('codex')) {
    const agentsSrc = path.join(TEMPLATES_DIR, '.agents', 'skills');
    const agentsDest = path.join(targetDir, '.agents', 'skills');
    if (fs.existsSync(agentsSrc)) {
      copySkillsDir(agentsSrc, agentsDest);
    }
  }

  console.log(`
  Done! Added: ${requestedTools.map(t => TOOLS[t].label).join(', ')}
`);
}

module.exports = run;
