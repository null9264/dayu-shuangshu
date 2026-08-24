// e:\trea工作空间\dayu-shuangshu\scripts\install-wrangler-and-deploy.js
// 临时 npm 装 wrangler 到 .wrangler-deploy 目录，用 CLOUDFLARE_API_TOKEN 部署
// 这是最稳的方式 — wrangler 内部处理所有 BLAKE3 / manifest / Pages API 细节

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 凭证从环境变量或命令行参数读取，避免 secret scanning 拦截
const TOKEN = process.argv[2] || process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) {
  console.error('用法: node scripts/install-wrangler-and-deploy.js <cloudflare_api_token>');
  console.error('或设置环境变量 CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

const TOOL_DIR = path.join(__dirname, '..', '.wrangler-deploy');
const DIST = path.join(__dirname, '..', 'dist');

function log(msg) { console.log(`[deploy] ${msg}`); }

try {
  // 1. 临时 npm init + 装 wrangler
  if (!fs.existsSync(TOOL_DIR)) fs.mkdirSync(TOOL_DIR);
  const pkgPath = path.join(TOOL_DIR, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, JSON.stringify({ name: 'dayu-deploy', version: '0.0.1', private: true }, null, 2));
  }
  log('正在装 wrangler (临时) ...');
  execSync('npm install wrangler --no-save', { cwd: TOOL_DIR, stdio: 'inherit' });
  log('wrangler 装好');

  // 2. 用 API Token 部署到 Pages
  log('部署中...');
  const env = { ...process.env, CLOUDFLARE_API_TOKEN: TOKEN, CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || 'c1c7e033bc1a278bb282bcfef965f244' };
  execSync(`npx wrangler pages deploy "${DIST}" --project-name dayu-shuangshu --branch main --commit-dirty=true`, {
    cwd: TOOL_DIR,
    env,
    stdio: 'inherit',
  });

  log('✓ 部署完成');
} catch (e) {
  console.error('失败:', e.message);
  process.exit(1);
}
