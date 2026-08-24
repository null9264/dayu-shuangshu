# 部署到 Cloudflare Pages

## 方式 A · Git 集成（推荐，参考 ashfall 的 DEPLOY.md）
1. 在 Cloudflare Dashboard 新建 Pages 项目 `dayu-shuangshu`
2. Settings → Builds → Connect to Git → GitHub → `null9264/dayu-shuangshu` / main
3. 框架 Vite，Build command `npm run build`，Output `dist`
4. 触发首次 Deploy，之后 `git push` 即自动上线

## 方式 B · 手动 wrangler 部署
需要 Cloudflare API Token（`https://dash.cloudflare.com/profile/api-tokens` → Create Token → Edit Cloudflare Pages）。

```bash
# 1. 装 wrangler
npm install -g wrangler

# 2. 登录
wrangler login

# 3. 创建 D1 数据库
wrangler d1 create dayu-shuangshu-db
# 把返回的 database_id 填到 wrangler.toml

# 4. 应用迁移
wrangler d1 migrations apply dayu-shuangshu-db --remote

# 5. 本地构建
npm run build

# 6. 部署
wrangler pages deploy dist --project-name dayu-shuangshu
```

## 当前状态
- 当前阶段（v0.2）：仅有设计大纲 + 首批 AI 资产，**尚未到可部署的游戏本体**。
- 等 M2 技术骨架完成后才会有 `npm run build` 输出。
- 设计大纲可直接通过 Cloudflare Pages Static Asset 部署（不需要 Functions / D1）。

## 临时预览（v0.2 设计阶段）
```bash
node _serve.js
# 浏览器访问 http://127.0.0.1:8765
```
