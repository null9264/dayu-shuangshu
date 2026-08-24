// 凭证从环境变量读取（不要硬编码 Token，避免 secret scanning 拦截）
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'c1c7e033bc1a278bb282bcfef965f244';

if (!TOKEN) {
  console.error('请先设置环境变量: $env:CLOUDFLARE_API_TOKEN = "<your_token>"');
  process.exit(1);
}

(async () => {
  // 1. 检查项目是否已存在
  const get = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/dayu-shuangshu`, {
    headers: { 'Authorization': 'Bearer ' + TOKEN },
  });
  if (get.status === 200) {
    console.log('Project exists. Deleting...');
    const del = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/dayu-shuangshu`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + TOKEN },
    });
    console.log('Delete:', del.status, await del.text());
  } else {
    console.log('Project not found, status:', get.status);
  }

  // 2. 创建新项目（不指定 production_branch）
  const create = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'dayu-shuangshu' }),
  });
  const t = await create.text();
  console.log('Create status:', create.status);
  console.log('Create response:', t);
})();
