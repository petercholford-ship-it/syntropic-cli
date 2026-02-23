/**
 * syntropic health
 *
 * Runs a local health check: build status, localhost refs, git state.
 * Mirrors EG1 pre-flight loop.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run() {
  console.log('\n  syntropic health — EG1 Pre-Flight Check\n');

  const checks = [];
  let hasErrors = false;

  // 1. Check instruction files
  const instructionFiles = [
    { name: 'Claude Code',     path: 'CLAUDE.md' },
    { name: 'Cursor',          path: '.cursorrules' },
    { name: 'Windsurf',        path: '.windsurfrules' },
    { name: 'GitHub Copilot',  path: path.join('.github', 'copilot-instructions.md') },
    { name: 'OpenAI Codex',   path: 'AGENTS.md' },
  ];

  const foundTools = [];
  for (const tool of instructionFiles) {
    if (fs.existsSync(path.join(process.cwd(), tool.path))) {
      foundTools.push(tool.name);
    }
  }

  if (foundTools.length > 0) {
    checks.push({ name: 'Instructions', status: 'pass', detail: `Found: ${foundTools.join(', ')}` });
  } else {
    checks.push({ name: 'Instructions', status: 'fail', detail: 'No instruction files — run "syntropic init"' });
    hasErrors = true;
  }

  // 2. Check .claude directory (Claude Code agents)
  const claudeDir = path.join(process.cwd(), '.claude');
  if (fs.existsSync(claudeDir) && fs.existsSync(path.join(claudeDir, 'commands'))) {
    const agents = fs.readdirSync(path.join(claudeDir, 'commands')).filter(f => f.endsWith('.md') && f !== 'README.md');
    checks.push({ name: 'Agents', status: 'pass', detail: `${agents.length} agents found` });
  } else if (foundTools.includes('Claude Code')) {
    checks.push({ name: 'Agents', status: 'warn', detail: 'No .claude/commands directory' });
  }

  // 3. npm build check
  const pkgJson = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgJson)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
      if (pkg.scripts && pkg.scripts.build) {
        try {
          execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
          checks.push({ name: 'Build', status: 'pass', detail: 'npm run build succeeded' });
        } catch (e) {
          checks.push({ name: 'Build', status: 'fail', detail: 'npm run build failed' });
          hasErrors = true;
        }
      } else {
        checks.push({ name: 'Build', status: 'skip', detail: 'No build script in package.json' });
      }
    } catch (e) {
      checks.push({ name: 'Build', status: 'warn', detail: 'Could not parse package.json' });
    }
  } else {
    checks.push({ name: 'Build', status: 'skip', detail: 'No package.json' });
  }

  // 4. Localhost grep
  try {
    const result = execSync(
      'grep -r "localhost\\|127\\.0\\.0\\.1" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" src/ pages/ components/ lib/ app/ 2>/dev/null || true',
      { encoding: 'utf8', timeout: 10000 }
    ).trim();

    if (result) {
      const lines = result.split('\n').length;
      checks.push({ name: 'Localhost refs', status: 'warn', detail: `${lines} reference(s) found — review before deploy` });
    } else {
      checks.push({ name: 'Localhost refs', status: 'pass', detail: 'Clean' });
    }
  } catch (e) {
    checks.push({ name: 'Localhost refs', status: 'skip', detail: 'No source directories found' });
  }

  // 5. Git status
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8', timeout: 5000 }).trim();
    if (status) {
      const files = status.split('\n').length;
      checks.push({ name: 'Git status', status: 'warn', detail: `${files} uncommitted change(s)` });
    } else {
      checks.push({ name: 'Git status', status: 'pass', detail: 'Clean working tree' });
    }
  } catch (e) {
    checks.push({ name: 'Git status', status: 'skip', detail: 'Not a git repository' });
  }

  // 6. npm audit
  if (fs.existsSync(pkgJson)) {
    try {
      const auditJson = execSync('npm audit --json 2>/dev/null || true', { encoding: 'utf8', timeout: 30000 });
      const audit = JSON.parse(auditJson);
      const vulns = audit.metadata?.vulnerabilities || {};
      const critical = vulns.critical || 0;
      const high = vulns.high || 0;
      const total = vulns.total || 0;

      if (critical > 0) {
        checks.push({ name: 'npm audit', status: 'fail', detail: `${total} vulnerabilities (${critical} critical, ${high} high)` });
        hasErrors = true;
      } else if (high > 0) {
        checks.push({ name: 'npm audit', status: 'warn', detail: `${total} vulnerabilities (${high} high)` });
      } else if (total > 0) {
        checks.push({ name: 'npm audit', status: 'pass', detail: `${total} low/moderate vulnerabilities` });
      } else {
        checks.push({ name: 'npm audit', status: 'pass', detail: 'No vulnerabilities' });
      }
    } catch (e) {
      checks.push({ name: 'npm audit', status: 'skip', detail: 'Could not run npm audit' });
    }
  }

  // Print results
  const icons = { pass: '  \x1b[32m✓\x1b[0m', fail: '  \x1b[31m✗\x1b[0m', warn: '  \x1b[33m!\x1b[0m', skip: '  \x1b[90m-\x1b[0m' };

  for (const check of checks) {
    console.log(`${icons[check.status]}  ${check.name}: ${check.detail}`);
  }

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;

  console.log(`\n  ${passCount} passed, ${warnCount} warnings, ${failCount} failed\n`);

  if (hasErrors) {
    console.log('  Fix failures before deploying.\n');
    process.exit(1);
  }
}

module.exports = run;
