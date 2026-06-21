# 慧护家 AI 智能管家

这是一个 React + Vite + Express 的家庭照护演示应用。AI 管家通过服务端接口调用 DeepSeek 模型，支持流式对话解答。

## 本地运行

**前置要求：** Node.js

1. 安装依赖：

   ```bash
   npm install
   ```

2. 复制环境变量示例并填写 DeepSeek API Key：

   ```bash
   cp .env.example .env
   ```

   在 `.env` 中配置：

   ```bash
   DEEPSEEK_API_KEY=你的DeepSeek API Key
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   DEEPSEEK_MODEL=deepseek-v4-flash
   ```

3. 启动应用：

   ```bash
   npm run dev
   ```

4. 打开：

   ```text
   http://localhost:3000
   ```

## AI 对话接口

- 前端聊天页：`src/components/views/AIChatView.tsx`
- 服务端接口：`POST /api/chat`
- 配置检查：`GET /api/chat/config`

服务端会读取 `.env` 中的 `DEEPSEEK_API_KEY`，不要把真实 Key 写入前端代码或提交到仓库。

如果 `DEEPSEEK_API_KEY` 未配置或认证失败，AI 管家会自动切换到内置照护模式，保证演示和基础对话仍可继续；更换有效 Key 并重启服务后会恢复 DeepSeek 云端模型。

## 部署到 Vercel

仓库已经包含 `vercel.json` 和 `api/server.ts`。Vercel 中使用以下设置：

```text
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: 留空（自动使用 npm install）
```

在 Vercel 的 Environment Variables 中配置：

```text
DEEPSEEK_API_KEY=你的DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

前端静态资源由 Vite 构建，所有 `/api/*` 请求会转发给 Vercel Node Function。

### 可选：持久化用户和家庭联系人

Vercel Function 不能把 `data/app-db.json` 当作持久数据库使用。若需要保存注册用户和家庭联系人，可创建 Upstash Redis 数据库并添加：

```text
KV_REST_API_URL=你的 Upstash REST URL
KV_REST_API_TOKEN=你的 Upstash REST Token
KV_DB_KEY=huihujia:app-db
```

代码也兼容 Upstash 默认的 `UPSTASH_REDIS_REST_URL` 和
`UPSTASH_REDIS_REST_TOKEN` 变量。未配置 Redis 时，线上会自动使用内存演示数据；
登录、注册和联系人编辑仍可操作，但数据可能在函数重启后恢复默认值。
