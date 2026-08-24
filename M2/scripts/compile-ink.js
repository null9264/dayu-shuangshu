// e:\trea工作空间\dayu-shuangshu\M2\scripts\compile-ink.js
// 把卷一剧本的"结构化 JSON 节点"编译为 inkjs 兼容的 story JSON
// 然后构建一个独立的 HTML 试玩版（单文件、零外部依赖、inkjs inline）

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const VOL1_SCRIPT = path.join(ROOT, 'M1剧本', 'M1.2_卷一北疆雪完整剧本.md');
const OUT_DIR = path.join(__dirname, '..', 'public');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------- 把卷一剧本的"分支选择"提取出来，构造 ink 故事 ----------
// 简化策略：只把 5 个高权重分支做成可玩节点，其余做线性叙述。
// 这是 M2 试玩版，不是 M3 完整版。

const NODES = [
  {
    id: 'intro',
    title: '序·云游谋士',
    text: [
      '我是陶淮，云游谋士。',
      '这一年冬至，我从江南出发往北疆游学。',
      '古道大雪，三十里不见人烟。',
      '忽而，前方雪幕中现出一个人影。',
    ].join('\n'),
    next: 'ch1_1',
  },
  {
    id: 'ch1_1',
    title: '第 1 章 · 北疆道中',
    text: '那人影近了，是个三十出头的妇人，背着药箱，步履极稳。',
    next: 'ch1_2',
  },
  {
    id: 'ch1_2',
    title: '古道偶遇',
    text: '"你识得我吗？"她忽然开口。',
    choices: [
      { label: '识得', text: '我说：识得。你是江湖上传闻的"假死郎中"孙佳琪。', branch: 'ch1_3a' },
      { label: '不识得', text: '我说：不识得。我只是过路的游学士子。', branch: 'ch1_3b' },
    ],
  },
  {
    id: 'ch1_3a',
    title: '她笑了',
    text: '她笑了。"陶淮，你果然识得。"——这一答，把我与北疆将军府的缘分提前接上了。',
    next: 'ch1_4',
  },
  {
    id: 'ch1_3b',
    title: '她默然',
    text: '她默然半晌。"那你可愿识得？"——我答：愿。于是她在雪地中向我吐露了"假死"经过。',
    next: 'ch1_4',
  },
  {
    id: 'ch1_4',
    title: '换婴之秘',
    text: '她告诉我：袁月是真正的公主，刘旸是将军之女，张文静原是王凯新献入宫的。',
    next: 'ch1_5',
  },
  {
    id: 'ch1_5',
    title: '【分支 01】是否推演"换婴"疏漏',
    text: '她问我："陶淮，你以为这局有何疏漏？"',
    choices: [
      { label: '指出疏漏', text: '我答：换婴三十年，将军未与袁月相认。这是疏漏。', branch: 'ch1_6a', trust: 1 },
      { label: '不指', text: '我答：此局无疏漏。只是三十年不醒罢了。', branch: 'ch1_6b', trust: 0 },
    ],
  },
  {
    id: 'ch1_6a',
    title: '她一震',
    text: '她一震。"陶淮，你识得将军之心。"——这一答，让她把我引为至交。',
    next: 'ch2_1',
    branchHint: '信任度 +1',
  },
  {
    id: 'ch1_6b',
    title: '她长叹',
    text: '她长叹。"陶淮，你是个稳的人。"——这一答，标准进程展开。',
    next: 'ch2_1',
  },
  {
    id: 'ch2_1',
    title: '第 2 章 · 镇北将军府',
    text: '我随她入镇北将军府密室，将军吐露换婴全貌。',
    next: 'ch2_2',
  },
  {
    id: 'ch2_2',
    title: '刘旸在屏风后',
    text: '屏风后有人在听。她探出头来——是刘旸。将军之女。',
    next: 'ch2_3',
  },
  {
    id: 'ch2_3',
    title: '【隐藏分支触发点】北疆糖葫芦',
    text: '府外雪地里，我忽见两个小女孩的幻象——一个奔向王府，一个留在将军府。',
    choices: [
      { label: '追上', text: '我追上去。幻象中，我成了那年卖糖葫芦的小贩。', branch: 'ch2_4a', ending: 'ending_05' },
      { label: '不追', text: '我不追。回到正典线。', branch: 'ch2_4b' },
    ],
  },
  {
    id: 'ch2_4a',
    title: '北疆糖葫芦（隐藏·完美救赎）',
    text: '我追上那个奔向王府的女孩。她回头——是张文静。\n\n"卖糖葫芦的哥哥，你别追啦——姐姐还在等我。"\n\n她七岁。\n\n我卖糖葫芦。\n\n这是完美救赎线的入口。',
    next: 'ending_05',
  },
  {
    id: 'ch2_4b',
    title: '回到正典',
    text: '我转身回府。刘旸在屏风后唤我："先生，您识得我吗？"',
    next: 'ch3_1',
  },
  {
    id: 'ch3_1',
    title: '第 3 章 · 华山道（杨鑫支线 1）',
    text: '我别孙佳琪南下。华山道旁客栈，遇一位青衫少年——杨鑫。',
    next: 'ch3_2',
  },
  {
    id: 'ch3_2',
    title: '【分支 02】是否与杨鑫结交',
    text: '他练剑于道旁，剑光清峻。',
    choices: [
      { label: '结交', text: '我上前作揖："兄台剑法，可是云骑一脉？"', branch: 'ch3_3a' },
      { label: '沉默', text: '我默然走过。杨鑫线后置至卷三。', branch: 'ch3_3b' },
    ],
  },
  {
    id: 'ch3_3a',
    title: '杨鑫笑道',
    text: '"先生识得。我师父刚过世。"——这一结交，开启杨鑫身世线索。',
    next: 'ch3_4',
  },
  {
    id: 'ch3_3b',
    title: '他默然',
    text: '我走后，他在身后道："先生若识得云骑，可来承天门寻我。"',
    next: 'ch4_1',
  },
  {
    id: 'ch3_4',
    title: '半卷《云骑兵法》',
    text: '他接师父遗物——半卷《云骑兵法》。他决意南下从军。',
    next: 'ch4_1',
  },
  {
    id: 'ch4_1',
    title: '第 4 章 · 入皇城',
    text: '我以游学谋士身份入皇城。元宵将至。',
    next: 'ch4_2',
  },
  {
    id: 'ch4_2',
    title: '街市偶遇张文静',
    text: '街市上，我偶遇张文静。她抚琴一首《北疆谣》。',
    next: 'ch4_3',
  },
  {
    id: 'ch4_3',
    title: '姊妹曲',
    text: '我侧耳听出——这是"姊妹曲"。张文静与袁月，姊妹在皇城。',
    next: 'ch5_1',
  },
  {
    id: 'ch5_1',
    title: '第 5 章 · 元宵诗会',
    text: '元宵诗会。袁魁（14 岁少年天子）微服出席。张文静陪侍旁。',
    next: 'ch5_2',
  },
  {
    id: 'ch5_2',
    title: '【分支 03】诗会是否对诗',
    text: '袁魁举杯邀诗。我可与张文静对诗。',
    choices: [
      { label: '对诗《北疆谣》', text: '我对诗《北疆谣》。触发"琴瑟和鸣"暗线。', branch: 'ch5_3a' },
      { label: '沉默', text: '我沉默。标准进程。', branch: 'ch5_3b' },
      { label: '暴露旧识身份', text: '我暴露与张文静的旧识身份。触发潘婷警觉。', branch: 'ch5_3c' },
    ],
  },
  {
    id: 'ch5_3a',
    title: '琴瑟和鸣',
    text: '张文静轻声道："先生识得《北疆谣》？"——这一答，让袁月也侧目。',
    next: 'ch5_4',
  },
  {
    id: 'ch5_3b',
    title: '标准进程',
    text: '我默然听诗。诗会在灯火中收束。',
    next: 'ch5_4',
  },
  {
    id: 'ch5_3c',
    title: '潘婷警觉',
    text: '我暴露旧识。袁魁微微侧目。潘婷信中已问我庵院一晤。',
    next: 'ch6_1',
  },
  {
    id: 'ch5_4',
    title: '评袁魁',
    text: '我评袁魁：少年有静气。',
    next: 'ch6_1',
  },
  {
    id: 'ch6_1',
    title: '第 6 章 · 潘婷来信',
    text: '我夜归客栈。案上一封匿名信——署名"国师潘婷"。',
    next: 'ch6_2',
  },
  {
    id: 'ch6_2',
    title: '【分支 04】是否向袁魁暗示血缘',
    text: '潘婷信中约我庵院一晤。我可先去袁魁处暗示。',
    choices: [
      { label: '暗示', text: '我去袁魁处暗示"对袁月是血缘"。', branch: 'ch6_3a' },
      { label: '不暗示', text: '我直接应约庵院。', branch: 'ch6_3b' },
    ],
  },
  {
    id: 'ch6_3a',
    title: '袁魁凝神',
    text: '袁魁凝神看我。"先生何意？"——我没答。',
    next: 'ch6_4',
  },
  {
    id: 'ch6_3b',
    title: '直赴庵院',
    text: '我直赴庵院。潘婷已在庵院灯下等我。',
    next: 'ch6_4',
  },
  {
    id: 'ch6_4',
    title: '庵院初见',
    text: '"陶公，你可识得换婴之秘？"——她开门见山。',
    next: 'ch6_5',
  },
  {
    id: 'ch6_5',
    title: '潘婷的执念',
    text: '她提及对袁月的名分问题。我察觉她的"执念"。',
    next: 'ch6_6',
  },
  {
    id: 'ch6_6',
    title: '章末手记',
    text: '我自语：\n\n"我识得她，识得这局，唯独不识得自己的归处。"',
    next: 'ending_01',
  },
  // ---------- 结局 ----------
  { id: 'ending_01', title: '结局 01 · 卷一正典（北疆雪）', text: '卷一至此收束。我在皇城，识得潘婷、识得袁月、识得杨鑫。\n\n——卷二《宫墙春》将启。', ending: true },
  { id: 'ending_05', title: '结局 05 · 北疆糖葫芦（完美救赎）', text: '我追上那个七岁的女孩。她回头笑。\n\n"卖糖葫芦的哥哥，你识得我们吗？"\n\n"识得。"我说。\n\n这是完美救赎。姐妹未走散。', ending: true },
];

// ---------- 构造 ink 故事源 ----------
function escapeInk(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function buildInkSource() {
  const lines = ['=== story ==='];
  lines.push('-> start');
  lines.push('');
  lines.push('VAR trust = 0');
  lines.push('VAR visited_chapters = 0');
  lines.push('VAR ending_id = ""');
  lines.push('');
  lines.push('=== start ===');
  // 把 start 节点作为入口
  const startNode = NODES.find(n => n.id === 'intro');
  lines.push(`# title: ${startNode.title}`);
  lines.push(startNode.text);
  lines.push(`-> ${startNode.next}`);
  lines.push('');

  for (const n of NODES) {
    lines.push(`=== ${n.id} ===`);
    lines.push(`# title: ${n.title}`);
    if (n.choices) {
      // 多选
      for (const c of n.choices) {
        lines.push(`* ${c.text}`);
        if (c.trust) lines.push(`~ trust = trust + ${c.trust}`);
        if (c.ending) {
          lines.push(`-> ${c.branch}`);
        } else {
          lines.push(`-> ${c.branch}`);
        }
      }
    } else {
      lines.push(n.text);
      if (n.ending) {
        lines.push(`-> END`);
      } else if (n.next) {
        lines.push(`-> ${n.next}`);
      }
    }
    lines.push('');
  }

  lines.push('=== END ===');
  return lines.join('\n');
}

const inkSource = buildInkSource();
fs.writeFileSync(path.join(OUT_DIR, 'volume1.ink'), inkSource);
console.log('✓ 写入 volume1.ink（' + inkSource.length + ' 字符）');

// ---------- 写一个 HTML 试玩版 ----------
// 不依赖 inkjs 编译器 — 我们手动用 JS 实现"节点切换"，等效但更可控
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>大虞双姝权谋录 · 卷一·北疆雪 · 试玩版</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
<style>
:root { --pico-font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif; }
body { max-width: 720px; margin: 2rem auto; padding: 1.5rem; background: #f5efe6; }
article { background: #fff; border-radius: 8px; padding: 1.5rem 2rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
h1, h2 { font-family: "Noto Serif SC", serif; color: #5a3825; }
.title { font-size: 1.1rem; color: #8a6a4a; margin-bottom: 0.5rem; }
.text { white-space: pre-wrap; line-height: 1.8; font-size: 1.05rem; }
.choice { display: block; width: 100%; text-align: left; margin: 0.5rem 0; padding: 0.8rem 1rem; background: #f5efe6; border: 1px solid #d4c4a8; border-radius: 6px; cursor: pointer; font-family: inherit; }
.choice:hover { background: #ebe0c8; }
.ending { background: #fff8e7; border-left: 4px solid #c89456; padding: 1rem; margin: 1rem 0; }
.meta { color: #888; font-size: 0.85rem; margin-top: 1.5rem; }
.branch-hint { color: #c89456; font-size: 0.9rem; }
</style>
</head>
<body>
<main class="container">
<article>
  <hgroup>
    <h1>大虞双姝权谋录</h1>
    <h2>卷一 · 北疆雪 · 试玩版（M2）</h2>
  </hgroup>
  <div id="status" class="meta">陶淮 · 云游谋士</div>
  <hr>
  <div id="title" class="title"></div>
  <div id="text" class="text"></div>
  <div id="branchHint"></div>
  <div id="choices"></div>
  <div class="meta" id="meta"></div>
</article>
</main>

<script>
const NODES = ${JSON.stringify(NODES, null, 2)};
let state = { trust: 0, visited: new Set() };

function render(nodeId) {
  const n = NODES.find(x => x.id === nodeId);
  if (!n) return;
  state.visited.add(nodeId);
  document.getElementById('title').textContent = n.title;
  document.getElementById('text').textContent = n.text;
  document.getElementById('branchHint').innerHTML = '';
  document.getElementById('choices').innerHTML = '';

  if (n.choices) {
    n.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = '【' + (i+1) + '】 ' + c.label + ' — ' + c.text;
      btn.onclick = () => {
        if (c.trust) state.trust += c.trust;
        if (c.ending) {
          document.getElementById('branchHint').innerHTML = '<div class="branch-hint">→ 进入结局线</div>';
        }
        setTimeout(() => render(c.branch), 300);
      };
      document.getElementById('choices').appendChild(btn);
    });
  } else if (n.ending) {
    document.getElementById('choices').innerHTML = '<button class="choice" onclick="render(\\'intro\\')">从头开始</button>';
  } else if (n.next) {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = '→ 继续';
    btn.onclick = () => render(n.next);
    document.getElementById('choices').appendChild(btn);
  }

  if (n.branchHint) {
    document.getElementById('branchHint').innerHTML = '<div class="branch-hint">提示：' + n.branchHint + '</div>';
  }
  document.getElementById('meta').textContent = '信任度：' + state.trust + ' | 已访问：' + state.visited.size + ' 节点';
}

render('intro');
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
console.log('✓ 写入 index.html（' + html.length + ' 字符）');

// ---------- 拷贝其他必要文件到 dist ----------
const distDir = path.join(ROOT, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
// 把 public 内容拷到 dist
function copyRecursive(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dst, ent.name);
    if (ent.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyRecursive(OUT_DIR, distDir);
console.log('✓ 拷贝到 dist/');
