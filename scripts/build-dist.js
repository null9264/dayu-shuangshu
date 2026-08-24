// e:\trea工作空间\dayu-shuangshu\scripts\build-dist.js
// 整合 dist/：
// 1. 拷所有 M1剧本/*.md → dist/M1剧本/
// 2. 拷所有 assets/*.{png,jpg} → dist/assets/
// 3. 拷 M1.1 总章 + M1 设计大纲 → dist/
// 4. 拷 M2 试玩版 → dist/play/
// 5. 写一个总览 index.html（含分卷导航 + 资产预览）

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dst, ent.name);
    if (ent.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function log(msg) { console.log(`[build] ${msg}`); }

// 1. 拷 M1剧本
copyDir(path.join(ROOT, 'M1剧本'), path.join(DIST, 'M1剧本'));
log('拷 M1剧本/');

// 2. 拷 assets
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
log('拷 assets/');

// 3. 拷设计大纲（用 file:// 不便，改用文字摘要）
const designOutline = path.join(ROOT, '..', '大虞双姝权谋录_设计大纲', '大虞双姝权谋录_设计大纲.html');
if (fs.existsSync(designOutline)) {
  fs.copyFileSync(designOutline, path.join(DIST, '设计大纲.htm'));
  log('拷 设计大纲.htm');
}

// 4. 拷 M2 试玩版
copyDir(path.join(ROOT, 'M2', 'public'), path.join(DIST, 'play'));
log('拷 M2/public/ → play/');

// 5. 写总览 index.html
const VOLUMES = [
  { id: 'v1', title: '卷一·北疆雪', file: 'M1剧本/M1.2_卷一北疆雪完整剧本.md', desc: '6 章 18 节点 · 走散、归来、布局', img: 'assets/volume1_北疆雪.jpg' },
  { id: 'v2', title: '卷二·宫墙春', file: 'M1剧本/M1.5_卷二宫墙春完整剧本.md', desc: '7 章 22 节点 · 入局、献妃、密信', img: 'assets/volume2_宫墙春.jpg' },
  { id: 'v3', title: '卷三·灯下误', file: 'M1剧本/M1.5_卷三灯下误完整剧本.md', desc: '6 章 20 节点 · 执念、归来、误读', img: 'assets/volume3_灯下误.jpg' },
  { id: 'v4', title: '卷四·庵院月', file: 'M1剧本/M1.5_卷四庵院月完整剧本.md', desc: '5 章 16 节点 · 掳走、醒悟、帝王现身', img: 'assets/volume4_庵院对谈.jpg' },
  { id: 'v5', title: '卷五·长街火', file: 'M1剧本/M1.5_卷五长街火完整剧本.md', desc: '8 章 24 节点 · 收网、囚室、终局', img: 'assets/volume5_主帅之战.jpg' },
];

const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>大虞双姝权谋录 · 五卷全本</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
<style>
:root { --pico-font-family: "Noto Serif SC", "Songti SC", serif; --brand: #5a3825; }
body { background: #f5efe6; max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
header.hero { text-align: center; padding: 2rem 0; border-bottom: 1px solid #d4c4a8; margin-bottom: 2rem; }
header.hero h1 { color: var(--brand); font-size: 2.4rem; margin-bottom: 0.4rem; }
header.hero p.tagline { color: #8a6a4a; font-style: italic; }
.play-cta { display: inline-block; background: var(--brand); color: #fff; padding: 0.8rem 2rem; border-radius: 6px; text-decoration: none; margin: 1rem 0; }
.play-cta:hover { background: #3a2815; }
.volumes { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.volume-card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); transition: transform 0.2s; }
.volume-card:hover { transform: translateY(-4px); }
.volume-card img { width: 100%; height: 180px; object-fit: cover; }
.volume-card .body { padding: 1rem 1.2rem; }
.volume-card h3 { color: var(--brand); margin: 0 0 0.4rem 0; }
.volume-card .desc { color: #8a6a4a; font-size: 0.9rem; margin-bottom: 0.8rem; }
.volume-card a.read { display: inline-block; margin-top: 0.5rem; color: var(--brand); text-decoration: none; font-weight: bold; }
.volume-card a.read:hover { text-decoration: underline; }
.assets { margin-top: 3rem; }
.assets h2 { color: var(--brand); }
.assets-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.assets-grid figure { margin: 0; }
.assets-grid img { width: 100%; border-radius: 4px; }
.assets-grid figcaption { font-size: 0.85rem; color: #8a6a4a; text-align: center; margin-top: 0.3rem; }
footer { margin-top: 3rem; text-align: center; color: #888; font-size: 0.85rem; }
</style>
</head>
<body>
<header class="hero">
  <h1>大虞双姝权谋录</h1>
  <p class="tagline">云游谋士·陶淮 ｜ 五卷全本 ｜ 共 32 章 / 100 节点 / 9.2 万字</p>
  <a href="play/index.html" class="play-cta">▶ 进入 M2 试玩版（卷一可玩）</a>
  <p style="margin-top:0.5rem;font-size:0.85rem;color:#8a6a4a;">卷一含 5 个高权重分支点、1 个隐藏结局（北疆糖葫芦）</p>
</header>

<section>
  <h2 style="color:var(--brand);">五卷剧本</h2>
  <div class="volumes">
${VOLUMES.map(v => `    <article class="volume-card">
      <img src="${v.img}" alt="${v.title}">
      <div class="body">
        <h3>${v.title}</h3>
        <p class="desc">${v.desc}</p>
        <a class="read" href="${v.file}">📖 阅读全本 →</a>
      </div>
    </article>`).join('\n')}
  </div>
</section>

<section class="assets">
  <h2>立绘与场景图</h2>
  <div class="assets-grid">
    <figure><img src="assets/character_陶淮.jpg" alt="陶淮"><figcaption>陶淮 · 云游谋士</figcaption></figure>
    <figure><img src="assets/character_袁魁_帝王.jpg" alt="袁魁"><figcaption>袁魁 · 少年天子</figcaption></figure>
    <figure><img src="assets/character_潘婷_醒悟.jpg" alt="潘婷"><figcaption>潘婷 · 国师·醒悟</figcaption></figure>
    <figure><img src="assets/volume4_庵院对谈.jpg" alt="庵院对谈"><figcaption>卷四 · 庵院对谈</figcaption></figure>
    <figure><img src="assets/volume5_主帅之战.jpg" alt="主帅之战"><figcaption>卷五 · 主帅之战</figcaption></figure>
  </div>
</section>

<section style="margin-top:3rem;">
  <h2 style="color:var(--brand);">其他资源</h2>
  <ul>
    <li><a href="M1剧本/M1.1_五卷总章结构.md">📑 五卷总章结构（M1.1 骨架层）</a></li>
    <li><a href="设计大纲.htm">📋 项目设计大纲（含角色卡 / 分支矩阵 / 结局设计）</a></li>
    <li><a href="play/">🎮 M2 HTML 试玩版（卷一可玩）</a></li>
  </ul>
</section>

<footer>
  <p>大虞双姝权谋录 · M1.5 阶段交付 · 卷三-卷五剧本已完整</p>
  <p>GitHub 仓库：<a href="https://github.com/null9264/dayu-shuangshu" target="_blank">null9264/dayu-shuangshu</a></p>
</footer>
</body>
</html>
`;

fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);
log('写总览 index.html');

log('✓ dist/ 构建完成');
