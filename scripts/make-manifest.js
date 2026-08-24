// e:\trea工作空间\dayu-shuangshu\scripts\make-manifest.js
// 为 dist 目录生成 Pages 部署 manifest：{"path":{"contentType":"..."}}
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.txt': 'text/plain', '.md': 'text/markdown',
  '.pdf': 'application/pdf', '.zip': 'application/zip',
};

function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...walk(full, rel));
    else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase();
      out.push({ path: rel, contentType: MIME[ext] || 'application/octet-stream' });
    }
  }
  return out;
}

const entries = walk(DIST);
const manifest = {};
for (const { path: p, contentType } of entries) {
  manifest[p] = { contentType };
}

const outPath = path.join(__dirname, '..', 'manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest: ${entries.length} files -> ${outPath}`);
console.log('First 5:', entries.slice(0, 5).map(e => `${e.path} (${e.contentType})`));
