// e:\trea工作空间\dayu-shuangshu\scripts\build-dist.js
// 整合 dist/

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

copyDir(path.join(ROOT, 'M1剧本'), path.join(DIST, 'M1剧本'));
log('拷 M1剧本/');

copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
log('拷 assets/');

const designOutline = path.join(ROOT, '..', '大虞双姝权谋录_设计大纲', '大虞双姝权谋录_设计大纲.html');
if (fs.existsSync(designOutline)) {
  fs.copyFileSync(designOutline, path.join(DIST, '设计大纲.htm'));
  log('拷 设计大纲.htm');
}

copyDir(path.join(ROOT, 'M2', 'public', 'play'), path.join(DIST, 'play'));
log('拷 M2/public/play/ → play/');

const VOLUMES = [
  { id: 'v1', title: '卷一·北疆雪', file: 'M1剧本/M1.2_卷一北疆雪完整剧本.md', desc: '6 章 18 节点 · 走散、归来、布局', img: 'assets/scroll_北疆古道.jpg' },
  { id: 'v2', title: '卷二·宫墙春', file: 'M1剧本/M1.5_卷二宫墙春完整剧本.md', desc: '7 章 22 节点 · 入局、献妃、密信', img: 'assets/scroll_元宵灯会.jpg' },
  { id: 'v3', title: '卷三·灯下误', file: 'M1剧本/M1.5_卷三灯下误完整剧本.md', desc: '6 章 20 节点 · 执念、归来、误读', img: 'assets/scroll_云隐庵.jpg' },
  { id: 'v4', title: '卷四·庵院月', file: 'M1剧本/M1.5_卷四庵院月完整剧本.md', desc: '5 章 16 节点 · 掳走、醒悟、帝王现身', img: 'assets/scroll_云隐庵.jpg' },
  { id: 'v5', title: '卷五·长街火', file: 'M1剧本/M1.5_卷五长街火完整剧本.md', desc: '8 章 24 节点 · 收网、囚室、终局', img: 'assets/volume5_主帅之战.jpg' },
];

const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>大虞双姝权谋录 · 五卷全本</title>
<style>
:root { --paper:#f5efe6; --ink:#2a2018; --ink-soft:#6b5a48; --accent:#8b3a1f; --accent-soft:#c89456; --hi:#ffd966; --border:#d4c4a8; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: "Noto Serif SC","Songti SC",serif; }
.wrap { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
.hero { text-align: center; padding: 2rem 0; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
.hero h1 { color: var(--accent); font-size: 2.4rem; margin: 0 0 0.4rem; }
.hero .tag { color: var(--ink-soft); font-style: italic; }
.cta { display: inline-block; margin: 1.2rem 0 0.4rem; background: var(--accent); color: #fff; padding: 0.9rem 2.2rem; border-radius: 6px; text-decoration: none; font-size: 1.05rem; }
.cta:hover { background: #5a2010; }
.cta-sub { color: var(--ink-soft); font-size: 0.85rem; margin: 0; }
h2.section { color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; margin-top: 2.5rem; }
.vol-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.4rem; }
.vol-card { background: #fffaf0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(60,40,20,0.1); transition: transform 0.2s; }
.vol-card:hover { transform: translateY(-4px); }
.vol-card img { width: 100%; height: 160px; object-fit: cover; }
.vol-card .b { padding: 1rem 1.2rem; }
.vol-card h3 { color: var(--accent); margin: 0 0 0.3rem; }
.vol-card .d { color: var(--ink-soft); font-size: 0.88rem; }
.vol-card a { display: inline-block; margin-top: 0.6rem; color: var(--accent); text-decoration: none; font-weight: bold; }
.vol-card a:hover { text-decoration: underline; }
.resources { margin-top: 2rem; }
.resources ul { line-height: 2; }
footer { margin-top: 3rem; text-align: center; color: var(--ink-soft); font-size: 0.85rem; padding: 2rem 0; border-top: 1px solid var(--border); }
</style>
</head>
<body>
<div class="wrap">
  <header class="hero">
    <h1>大虞双姝权谋录</h1>
    <p class="tag">云游谋士·陶淮 ｜ 五卷全本 ｜ 32 章 / 100 节点 / 9.2 万字</p>
    <a href="play/" class="cta">▶ 进入 M2.5 探索试玩版（卷一可玩）</a>
    <p class="cta-sub">清明上河图式卷轴 · 可点击人物/物件 · 5+1 结局纯靠探索解锁</p>
  </header>

  <h2 class="section">五卷剧本</h2>
  <div class="vol-grid">
${VOLUMES.map(v => `    <article class="vol-card">
      <img src="${v.img}" alt="${v.title}">
      <div class="b">
        <h3>${v.title}</h3>
        <p class="d">${v.desc}</p>
        <a href="${v.file}">📖 阅读全本 →</a>
      </div>
    </article>`).join('\n')}
  </div>

  <h2 class="section">立绘与场景图</h2>
  <div class="vol-grid">
    <article class="vol-card"><img src="assets/character_陶淮.jpg" alt="陶淮"><div class="b"><h3>陶淮</h3><p class="d">云游谋士</p></div></article>
    <article class="vol-card"><img src="assets/character_袁魁_帝王.jpg" alt="袁魁"><div class="b"><h3>袁魁</h3><p class="d">少年天子</p></div></article>
    <article class="vol-card"><img src="assets/character_潘婷_醒悟.jpg" alt="潘婷"><div class="b"><h3>潘婷</h3><p class="d">国师·醒悟</p></div></article>
    <article class="vol-card"><img src="assets/volume4_庵院对谈.jpg" alt="庵院对谈"><div class="b"><h3>庵院对谈</h3><p class="d">卷四高潮</p></div></article>
    <article class="vol-card"><img src="assets/volume5_主帅之战.jpg" alt="主帅之战"><div class="b"><h3>主帅之战</h3><p class="d">卷五高潮</p></div></article>
  </div>

  <div class="resources">
    <h2 class="section">其他资源</h2>
    <ul>
      <li><a href="M1剧本/M1.1_五卷总章结构.md">📑 五卷总章结构（M1.1 骨架层）</a></li>
      <li><a href="设计大纲.htm">📋 项目设计大纲（含角色卡 / 分支矩阵 / 结局设计）</a></li>
      <li><a href="play/">🎮 M2.5 HTML 探索试玩版（卷一可玩）</a></li>
    </ul>
  </div>

  <footer>
    <p>大虞双姝权谋录 · M2.5 阶段 · 探索式可玩</p>
    <p>GitHub：<a href="https://github.com/null9264/dayu-shuangshu" target="_blank">null9264/dayu-shuangshu</a></p>
  </footer>
</div>
</body>
</html>
`;

fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);
log('写总览 index.html');
log('✓ dist/ 构建完成');
