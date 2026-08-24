// e:\trea工作空间\dayu-shuangshu\scripts\push-m1-5.js
// 推送 M1.5 卷三/卷四/卷五 剧本到 GitHub 仓库
// 凭证从环境变量或命令行参数读取

const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;
const OWNER = 'null9264';
const REPO = 'dayu-shuangshu';
const BRANCH = 'main';

if (!TOKEN) {
  console.error('用法: node scripts/push-m1-5.js <github_token>');
  process.exit(1);
}

const FILES = [
  'M1剧本/M1.5_卷三灯下误完整剧本.md',
  'M1剧本/M1.5_卷四庵院月完整剧本.md',
  'M1剧本/M1.5_卷五长街火完整剧本.md',
];

function log(msg) { console.log(`[push] ${msg}`); }

function ghApi(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'api.github.com',
      path: apiPath,
      method,
      headers: {
        'Authorization': 'token ' + TOKEN,
        'User-Agent': 'dayu-shuangshu-pusher',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, (res) => {
      let chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString();
        try {
          resolve({ status: res.statusCode, body: JSON.parse(text) });
        } catch (e) {
          resolve({ status: res.statusCode, body: text });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getFileSha(filePath) {
  const r = await ghApi('GET', `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath).replace(/%2F/g, '/')}?ref=${BRANCH}`);
  if (r.status === 200 && r.body.sha) return r.body.sha;
  return null;
}

async function pushFile(localPath, repoPath) {
  const content = fs.readFileSync(localPath, 'utf8');
  const base64 = Buffer.from(content, 'utf8').toString('base64');
  const sha = await getFileSha(repoPath);

  const body = {
    message: `M1.5: 推送 ${path.basename(repoPath)}`,
    content: base64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const r = await ghApi('PUT', `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(repoPath).replace(/%2F/g, '/')}`, body);
  if (r.status === 200 || r.status === 201) {
    log(`✓ ${repoPath}`);
  } else {
    console.error(`✗ ${repoPath}: ${r.status}`, JSON.stringify(r.body).slice(0, 200));
  }
}

(async () => {
  const root = path.join(__dirname, '..');
  for (const rel of FILES) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) {
      console.error(`✗ 缺文件: ${abs}`);
      continue;
    }
    await pushFile(abs, rel);
  }
  log('完成');
})();
