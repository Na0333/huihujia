import express, { type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const deepseekApiKey = process.env.DEEPSEEK_API_KEY?.trim() || "";
const deepseekBaseURL = process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com";
const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const LOCAL_ASSISTANT_MODEL = "local-care-assistant";
const hasConfiguredDeepSeekKey = Boolean(deepseekApiKey && deepseekApiKey !== "your_deepseek_api_key_here");

const deepseek = new OpenAI({
  apiKey: deepseekApiKey || "local-fallback-only",
  baseURL: deepseekBaseURL,
});

const thinkingMode = process.env.DEEPSEEK_THINKING === "enabled" ? "enabled" : "disabled";
const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_LENGTH = 4000;

let chatMode: "deepseek" | "local" = hasConfiguredDeepSeekKey ? "deepseek" : "local";
let lastRemoteFailure: { status?: number; message: string } | null = null;

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type UserRecord = {
  id: number;
  username: string;
  password: string;
  createdAt: string;
};

type FamilyMember = {
  id: number;
  name: string;
  phone: string;
  relation: string;
  isEmergency: boolean;
  avatar?: string;
};

type AppDb = {
  users: UserRecord[];
  familyMembers: FamilyMember[];
};

const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 1,
    name: "小慧",
    phone: "13800138000",
    relation: "主照护人/女儿",
    isEmergency: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "小明",
    phone: "13900139000",
    relation: "家人/儿子",
    isEmergency: false,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
  },
];

const DEFAULT_DB: AppDb = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin",
      createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    },
  ],
  familyMembers: DEFAULT_FAMILY_MEMBERS,
};

const DB_PATH = path.join(process.cwd(), "data", "app-db.json");
const IS_VERCEL = process.env.VERCEL === "1";
const KV_REST_API_URL = (
  process.env.KV_REST_API_URL
  || process.env.UPSTASH_REDIS_REST_URL
  || ""
).replace(/\/+$/, "");
const KV_REST_API_TOKEN = (
  process.env.KV_REST_API_TOKEN
  || process.env.UPSTASH_REDIS_REST_TOKEN
  || ""
).trim();
const KV_DB_KEY = process.env.KV_DB_KEY?.trim() || "huihujia:app-db";
const hasRemoteStorage = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);

let memoryDb: AppDb = structuredClone(DEFAULT_DB);

const SYSTEM_PROMPT = `
你是“慧护家 AI 智能管家”，一个面向家庭照护与智能家居场景的中文对话助手。

你的职责：
1. 回答用户关于家庭安全、长辈照护、健康记录、设备使用、用药提醒、能耗优化的问题。
2. 根据当前家庭状态给出简明、可执行、温暖的建议。
3. 遇到安全风险、疑似健康异常、摔倒、呼救、烟雾、漏水、燃气、电器过热等场景，优先提示立即联系家属、物业或急救/消防等真实服务。
4. 不要声称已经真实控制硬件；如果用户要求控制设备，请用“我可以帮你发起/建议执行”的方式确认，并提醒需要真实设备接入。
5. 不替代医生诊断，不提供高风险医疗处置结论；健康相关回答要建议咨询专业医生。

当前演示家庭状态：
- 厨房电饭煲插座已运行 3 小时 15 分钟，建议断电或设置定时。
- 今天气温偏低，建议为长辈开启睡眠保暖模式。
- 夜间起夜已自动点亮走廊柔光灯。
- 家庭安全状态正常，舒适状态良好，今日能耗略高。

回复风格：
- 使用简体中文。
- 优先 2 到 4 条要点，必要时给出下一步操作。
- 语气专业、体贴、可靠，不夸大能力。
`.trim();

function normalizeMessages(messages: unknown): ChatMessage[] | null {
  if (!Array.isArray(messages)) {
    return null;
  }

  const normalized = messages
    .filter((message): message is Partial<ChatMessage> => {
      return Boolean(message) && typeof message === "object";
    })
    .map((message) => {
      const role = message.role;
      const content = typeof message.content === "string" ? message.content.trim() : "";

      if ((role !== "user" && role !== "assistant") || !content) {
        return null;
      }

      return {
        role,
        content: content.slice(0, MAX_MESSAGE_LENGTH),
      };
    })
    .filter((message): message is ChatMessage => message !== null);

  return normalized.slice(-MAX_HISTORY_MESSAGES);
}

function getPublicChatConfig() {
  const isDeepSeekReady = chatMode === "deepseek" && hasConfiguredDeepSeekKey;

  return {
    provider: isDeepSeekReady ? "DeepSeek" : "内置照护助手",
    model: isDeepSeekReady ? model : LOCAL_ASSISTANT_MODEL,
    remoteModel: model,
    ready: isDeepSeekReady,
    fallbackReady: true,
    mode: isDeepSeekReady ? "deepseek" : "local",
    lastRemoteFailure,
  };
}

function getLatestUserContent(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function includesAny(content: string, keywords: string[]) {
  return keywords.some((keyword) => content.includes(keyword));
}

function buildLocalAssistantReply(
  messages: ChatMessage[],
  reason: "missing-key" | "auth-failed" | "remote-error" | "manual" = "manual",
) {
  const latestUserContent = getLatestUserContent(messages).toLowerCase();
  const cloudNotice = reason === "auth-failed"
    ? "\n\n当前云端模型认证未通过，已临时切换为内置照护模式；更换有效 DeepSeek API Key 并重启服务后，会自动恢复云端对话。"
    : reason === "missing-key"
      ? "\n\n当前未配置 DeepSeek API Key，正在使用内置照护模式回复；填写有效 Key 并重启服务后，会自动切换到云端模型。"
      : reason === "remote-error"
        ? "\n\n云端模型暂时不可用，我先用内置照护模式继续帮你处理。"
        : "";

  if (includesAny(latestUserContent, ["优化", "状态", "风险", "检查", "家庭"])) {
    return `我先按当前家庭状态给你一版优化方案：

1. 厨房电饭煲插座已运行 3 小时 15 分钟，先确认是否还在使用；如果只是保温或待机，建议关闭插座或设置 30 分钟内自动断电，降低过热和耗电风险。
2. 今晚气温偏低，睡前把卧室温度维持在舒适区间，并提醒长辈加一层薄被或穿保暖睡衣，避免夜间着凉。
3. 夜间起夜已经联动走廊柔光灯，可以继续保留自动照明；如果长辈最近起夜变频繁，建议同步关注饮水、血糖或睡眠情况。
4. 今日能耗略高，优先检查厨房、客厅待机设备和空调/取暖设备，处理“长时间运行但无人使用”的设备最有效。${cloudNotice}`;
  }

  if (includesAny(latestUserContent, ["照护", "提醒", "张阿姨", "老人", "长辈"])) {
    return `可以，今天的照护提醒建议这样安排：

1. 早晚各确认一次室温和衣物保暖，今天偏冷，睡前尤其要避免脚部和肩颈受凉。
2. 留意厨房电饭煲插座，若饭后不再使用，提醒家人关闭或设置定时断电。
3. 保留走廊夜间柔光灯，减少起夜摸黑和跌倒风险。
4. 晚间简单询问长辈是否头晕、胸闷、睡眠差或起夜明显增多；如有持续异常，建议联系家属并咨询医生。${cloudNotice}`;
  }

  if (includesAny(latestUserContent, ["插座", "电饭煲", "厨房", "用电", "耗电", "断电"])) {
    return `厨房插座运行时间偏长，建议按这个顺序处理：

1. 先确认电饭煲是否仍在烹饪；如果已经进入保温或空载待机，就不要继续长时间通电。
2. 如果家里有人在场，可以发起关闭插座或设置 30 分钟定时断电。
3. 如果长辈独自在家，先用电话或消息确认锅内状态，再执行断电，避免影响正在烹饪的食物。
4. 后续可以给电饭煲插座设置“饭后 2 小时提醒”或“超过 3 小时二次确认”的自动化规则。${cloudNotice}`;
  }

  if (includesAny(latestUserContent, ["气温", "保暖", "睡前", "冷", "低温", "今晚"])) {
    return `今晚偏冷，老人睡前可以重点注意这几项：

1. 卧室保持温暖但不要过热，避免整夜强风直吹。
2. 睡前准备容易穿脱的外套和防滑拖鞋，方便夜间起身。
3. 走廊柔光灯保持自动开启，减少摸黑行走。
4. 若长辈有心血管、呼吸道或关节不适，低温天要多观察症状变化，必要时联系医生。${cloudNotice}`;
  }

  if (includesAny(latestUserContent, ["设备", "打开", "关闭", "控制", "模式"])) {
    return `我可以帮你梳理设备操作建议，但当前演示环境不会直接控制真实硬件：

1. 如果要关闭厨房插座，建议先确认电饭煲已经不在烹饪。
2. 如果要开启睡眠保暖模式，建议设置温和温度，并避免风口直吹长辈。
3. 夜间照明建议保留自动联动，优先保障起夜安全。
4. 接入真实设备后，可以把这些建议变成“确认后执行”的自动化流程。${cloudNotice}`;
  }

  if (includesAny(latestUserContent, ["健康", "用药", "血压", "心率", "医生", "药"])) {
    return `健康相关问题我可以帮你整理观察和提醒，但不能替代医生诊断：

1. 先记录症状出现时间、持续多久、是否反复，以及血压、心率等可测数据。
2. 用药提醒要以医生处方和药盒标签为准，不建议自行加量、停药或混用。
3. 如果出现胸痛、呼吸困难、意识异常、严重摔倒或持续高热，应立即联系家属并寻求急救/医疗帮助。
4. 日常可以把晨晚测量、服药、饮水和睡眠情况做成固定提醒。${cloudNotice}`;
  }

  return `我在，可以继续帮你看家庭安全、长辈照护、设备使用和能耗优化。

你可以直接告诉我想处理的事情，例如“检查当前家中风险”“给张阿姨生成照护提醒”或“厨房插座运行太久怎么办”。我会按当前家庭状态给出具体步骤。${cloudNotice}`;
}

function setupSseHeaders(res: Response) {
  if (res.headersSent) {
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-DeepSeek-Model", model);
  res.flushHeaders?.();
}

function writeSse(res: Response, payload: Record<string, unknown>) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function getStreamChunks(content: string) {
  return content.match(/[\s\S]{1,28}/g) || [content];
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function streamLocalAssistantReply(
  res: Response,
  messages: ChatMessage[],
  reason: "missing-key" | "auth-failed" | "remote-error" | "manual" = "manual",
) {
  setupSseHeaders(res);

  const content = buildLocalAssistantReply(messages, reason);

  for (const chunk of getStreamChunks(content)) {
    writeSse(res, { content: chunk, provider: "内置照护助手", model: LOCAL_ASSISTANT_MODEL, mode: "local" });
    await wait(12);
  }

  writeSse(res, { done: true, provider: "内置照护助手", model: LOCAL_ASSISTANT_MODEL, mode: "local" });
  res.end();
}

function getErrorStatus(error: any): number | undefined {
  return error?.status || error?.statusCode || error?.response?.status;
}

function getErrorMessage(error: any) {
  return String(error?.message || error?.error?.message || "DeepSeek 对话请求失败。");
}

function isAuthError(error: any) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);

  return status === 401 || /authentication|api key|apikey|unauthorized|invalid/i.test(message);
}

function cleanText(value: unknown, maxLength = 80) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sanitizeUser(user: UserRecord) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

function normalizeFamilyMember(member: Partial<FamilyMember>, fallbackId: number): FamilyMember | null {
  const name = cleanText(member.name);
  const phone = cleanText(member.phone, 20);
  const relation = cleanText(member.relation);
  const avatar = cleanText(member.avatar, 500);

  if (!name || !phone || !relation) {
    return null;
  }

  return {
    id: Number(member.id) || fallbackId,
    name,
    phone,
    relation,
    isEmergency: Boolean(member.isEmergency),
    ...(avatar ? { avatar } : {}),
  };
}

function ensureSingleEmergency(members: FamilyMember[]) {
  const emergencyIndex = members.findIndex(member => member.isEmergency);

  if (emergencyIndex === -1) {
    return members;
  }

  return members.map((member, index) => ({
    ...member,
    isEmergency: index === emergencyIndex,
  }));
}

async function readDb(): Promise<AppDb> {
  if (hasRemoteStorage) {
    try {
      const stored = await runKvCommand(["GET", KV_DB_KEY]);

      if (typeof stored === "string") {
        return normalizeDb(JSON.parse(stored) as Partial<AppDb>);
      }

      await writeDb(DEFAULT_DB);
      return structuredClone(DEFAULT_DB);
    } catch (error) {
      console.error("Remote storage read failed, using memory fallback:", error);
      return structuredClone(memoryDb);
    }
  }

  if (IS_VERCEL) {
    return structuredClone(memoryDb);
  }

  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return normalizeDb(JSON.parse(raw) as Partial<AppDb>);
  } catch {
    await writeDb(DEFAULT_DB);
    return structuredClone(DEFAULT_DB);
  }
}

async function writeDb(db: AppDb) {
  memoryDb = structuredClone(db);

  if (hasRemoteStorage) {
    await runKvCommand(["SET", KV_DB_KEY, JSON.stringify(db)]);
    return;
  }

  if (IS_VERCEL) {
    return;
  }

  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf8");
  } catch (error) {
    console.warn("Local storage write failed (read-only filesystem?), using memory fallback only.");
  }
}

function normalizeDb(db: Partial<AppDb>): AppDb {
  return {
    users: Array.isArray(db.users) && db.users.length > 0
      ? db.users as UserRecord[]
      : structuredClone(DEFAULT_DB.users),
    familyMembers: Array.isArray(db.familyMembers) && db.familyMembers.length > 0
      ? db.familyMembers as FamilyMember[]
      : structuredClone(DEFAULT_DB.familyMembers),
  };
}

async function runKvCommand(command: unknown[]) {
  const response = await fetch(KV_REST_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Remote storage request failed with status ${response.status}.`);
  }

  const payload = await response.json() as { result?: unknown; error?: string };

  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result;
}

const app = express();

  app.use(express.json());

  app.post("/api/auth/login", async (req: Request, res: Response): Promise<void> => {
    const username = cleanText(req.body?.username, 40);
    const password = cleanText(req.body?.password, 80);

    if (!username || !password) {
      res.status(400).json({ error: "请输入用户名和密码。" });
      return;
    }

    const user = memoryDb.users.find(item => item.username === username && item.password === password);

    if (!user) {
      res.status(401).json({ error: "用户名或密码不正确。" });
      return;
    }

    res.json({ user: sanitizeUser(user) });
  });

  app.post("/api/auth/register", async (req: Request, res: Response): Promise<void> => {
    const username = cleanText(req.body?.username, 40);
    const password = cleanText(req.body?.password, 80);

    if (!username || !password) {
      res.status(400).json({ error: "请输入用户名和密码。" });
      return;
    }

    if (username.length < 3 || password.length < 3) {
      res.status(400).json({ error: "用户名和密码至少需要 3 位。" });
      return;
    }

    const exists = memoryDb.users.some(item => item.username === username);

    if (exists) {
      res.status(409).json({ error: "该用户名已注册，请直接登录。" });
      return;
    }

    const user: UserRecord = {
      id: Date.now(),
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    memoryDb.users.push(user);

    res.json({ user: sanitizeUser(user) });
  });

  app.get("/api/family-members", async (_req: Request, res: Response) => {
    res.json({ members: memoryDb.familyMembers });
  });

  app.put("/api/family-members", async (req: Request, res: Response): Promise<void> => {
    const rawMembers = Array.isArray(req.body) ? req.body : req.body?.members;

    if (!Array.isArray(rawMembers)) {
      res.status(400).json({ error: "members 必须是数组。" });
      return;
    }

    const normalized = rawMembers
      .map((member, index) => normalizeFamilyMember(member, Date.now() + index))
      .filter((member): member is FamilyMember => member !== null);

    memoryDb.familyMembers = ensureSingleEmergency(normalized);

    res.json({ members: memoryDb.familyMembers });
  });

  app.get("/api/chat/config", (_req: Request, res: Response) => {
    res.json({
      ...getPublicChatConfig(),
      storage: hasRemoteStorage ? "upstash-redis" : IS_VERCEL ? "memory" : "file",
      storagePersistent: hasRemoteStorage || !IS_VERCEL,
    });
  });

  app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = normalizeMessages(req.body?.messages);
      
      if (!messages) {
        res.status(400).json({ error: "messages 必须是数组。" });
        return;
      }

      if (messages.length === 0) {
        res.status(400).json({ error: "请输入要咨询的问题。" });
        return;
      }

      if (chatMode === "local") {
        await streamLocalAssistantReply(
          res,
          messages,
          hasConfiguredDeepSeekKey ? "auth-failed" : "missing-key",
        );
        return;
      }

      const completionOptions: Record<string, unknown> = {
        model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        max_tokens: Number(process.env.DEEPSEEK_MAX_TOKENS || 1200),
        stream: true,
        extra_body: {
          thinking: { type: thinkingMode },
        },
      };

      if (thinkingMode === "enabled") {
        completionOptions.reasoning_effort = process.env.DEEPSEEK_REASONING_EFFORT || "high";
      } else {
        completionOptions.temperature = Number(process.env.DEEPSEEK_TEMPERATURE || 0.4);
      }

      setupSseHeaders(res);

      const stream = (await deepseek.chat.completions.create(completionOptions as any)) as unknown as AsyncIterable<any>;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta as { content?: string; reasoning_content?: string };
        const content = delta?.content || "";

        if (content) {
          writeSse(res, { content, provider: "DeepSeek", model, mode: "deepseek" });
        }
      }

      writeSse(res, { done: true, provider: "DeepSeek", model, mode: "deepseek" });
      res.end();
    } catch (error: any) {
      const status = getErrorStatus(error);
      const message = getErrorMessage(error);
      console.error("Chat completion error:", { status, message });

      const messages = normalizeMessages(req.body?.messages) || [];

      if (isAuthError(error)) {
        chatMode = "local";
        lastRemoteFailure = { status, message: "DeepSeek API Key 认证失败" };
        await streamLocalAssistantReply(res, messages, "auth-failed");
        return;
      }

      if (res.headersSent) {
        await streamLocalAssistantReply(res, messages, "remote-error");
        return;
      }

      res.status(500).json({ error: "DeepSeek 云端服务暂时不可用，请稍后重试。" });
    }
  });

export default app;
