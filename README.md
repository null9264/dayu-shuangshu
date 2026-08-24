# Dayu Shuangshu · 大虞双姝权谋录

> 一个**网页互动小说 + 群像多视角**的古风权谋游戏，5 卷结构、32 章、约 100 个剧情节点、35 个高权重分支点、7 种结局。玩家扮演"云游谋士 · 陶淮"，与孙佳琪、张文静、袁月、潘婷、袁魁、杨鑫、刘旸、王凯新等 11 位核心人物共赴这一局大虞棋局。

## 在线版
部署后填入（Cloudflare Pages）：`_即将上线_`

## 技术栈
- 前端：Vite + React 18 + TypeScript（规划中）
- 后端：Cloudflare Pages Functions + D1（规划中）
- 资产：trae-remote-official:seedream（立绘/场景）+ trae-remote-official:seedance（视频）
- 部署：wrangler + Cloudflare Pages

## 当前进度
- [x] v0.1 项目设计大纲
- [x] v0.2 决策对齐（王凯新-杨鑫彻底解耦、玩家身份定稿、全量发布、seedream+seedance 资产流）
- [x] AI 资产首批（4 张图 + 1 段视频）
- [x] M1.1 五卷总章结构
- [ ] M1.2 卷一首卷完整剧本（进行中）
- [ ] M2 技术骨架
- [ ] M3 五卷全量上线

## 本地预览
```bash
# 1. 安装依赖（待 M2 完成后）
npm install

# 2. 启动预览服务器（当前阶段直接打开 HTML）
node _serve.js
# 浏览器访问 http://127.0.0.1:8765
```

## 目录
```
.
├── 大虞双姝权谋录_设计大纲/      # 当前阶段：设计大纲 + 首批资产
│   ├── 大虞双姝权谋录_设计大纲.html
│   ├── M1剧本/                    # 剧本扩写输出
│   ├── assets/                    # 首批 AI 资产（5 份）
│   ├── _shared/                   # 字体 / JS 库
│   └── _serve.js                  # 本地预览服务器
├── CHANGELOG.md                   # 进度日志
├── README.md
└── LICENSE
```

## 对标项目
[null9264/ashfall](https://github.com/null9264/ashfall) —— 同账号的另一个 AI 独立项目，技术栈与防作弊范式的参考来源。

## 许可
MIT
