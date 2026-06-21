var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// functions-src/server-wrapper.ts
var server_wrapper_exports = {};
__export(server_wrapper_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(server_wrapper_exports);
var import_serverless_http = __toESM(require("serverless-http"));

// backend/app.ts
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_openai = __toESM(require("openai"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var deepseekApiKey = process.env.DEEPSEEK_API_KEY?.trim() || "";
var deepseekBaseURL = process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com";
var model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
var LOCAL_ASSISTANT_MODEL = "local-care-assistant";
var hasConfiguredDeepSeekKey = Boolean(deepseekApiKey && deepseekApiKey !== "your_deepseek_api_key_here");
var deepseek = new import_openai.default({
  apiKey: deepseekApiKey || "local-fallback-only",
  baseURL: deepseekBaseURL
});
var thinkingMode = process.env.DEEPSEEK_THINKING === "enabled" ? "enabled" : "disabled";
var MAX_HISTORY_MESSAGES = 24;
var MAX_MESSAGE_LENGTH = 4e3;
var chatMode = hasConfiguredDeepSeekKey ? "deepseek" : "local";
var lastRemoteFailure = null;
var DEFAULT_FAMILY_MEMBERS = [
  {
    id: 1,
    name: "\u5C0F\u6167",
    phone: "13800138000",
    relation: "\u4E3B\u7167\u62A4\u4EBA/\u5973\u513F",
    isEmergency: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "\u5C0F\u660E",
    phone: "13900139000",
    relation: "\u5BB6\u4EBA/\u513F\u5B50",
    isEmergency: false,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
  }
];
var DEFAULT_DB = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin",
      createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
    }
  ],
  familyMembers: DEFAULT_FAMILY_MEMBERS
};
var DB_PATH = import_path.default.join(process.cwd(), "data", "app-db.json");
var IS_VERCEL = process.env.VERCEL === "1";
var KV_REST_API_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/+$/, "");
var KV_REST_API_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
var KV_DB_KEY = process.env.KV_DB_KEY?.trim() || "huihujia:app-db";
var hasRemoteStorage = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
var memoryDb = structuredClone(DEFAULT_DB);
var SYSTEM_PROMPT = `
\u4F60\u662F\u201C\u6167\u62A4\u5BB6 AI \u667A\u80FD\u7BA1\u5BB6\u201D\uFF0C\u4E00\u4E2A\u9762\u5411\u5BB6\u5EAD\u7167\u62A4\u4E0E\u667A\u80FD\u5BB6\u5C45\u573A\u666F\u7684\u4E2D\u6587\u5BF9\u8BDD\u52A9\u624B\u3002

\u4F60\u7684\u804C\u8D23\uFF1A
1. \u56DE\u7B54\u7528\u6237\u5173\u4E8E\u5BB6\u5EAD\u5B89\u5168\u3001\u957F\u8F88\u7167\u62A4\u3001\u5065\u5EB7\u8BB0\u5F55\u3001\u8BBE\u5907\u4F7F\u7528\u3001\u7528\u836F\u63D0\u9192\u3001\u80FD\u8017\u4F18\u5316\u7684\u95EE\u9898\u3002
2. \u6839\u636E\u5F53\u524D\u5BB6\u5EAD\u72B6\u6001\u7ED9\u51FA\u7B80\u660E\u3001\u53EF\u6267\u884C\u3001\u6E29\u6696\u7684\u5EFA\u8BAE\u3002
3. \u9047\u5230\u5B89\u5168\u98CE\u9669\u3001\u7591\u4F3C\u5065\u5EB7\u5F02\u5E38\u3001\u6454\u5012\u3001\u547C\u6551\u3001\u70DF\u96FE\u3001\u6F0F\u6C34\u3001\u71C3\u6C14\u3001\u7535\u5668\u8FC7\u70ED\u7B49\u573A\u666F\uFF0C\u4F18\u5148\u63D0\u793A\u7ACB\u5373\u8054\u7CFB\u5BB6\u5C5E\u3001\u7269\u4E1A\u6216\u6025\u6551/\u6D88\u9632\u7B49\u771F\u5B9E\u670D\u52A1\u3002
4. \u4E0D\u8981\u58F0\u79F0\u5DF2\u7ECF\u771F\u5B9E\u63A7\u5236\u786C\u4EF6\uFF1B\u5982\u679C\u7528\u6237\u8981\u6C42\u63A7\u5236\u8BBE\u5907\uFF0C\u8BF7\u7528\u201C\u6211\u53EF\u4EE5\u5E2E\u4F60\u53D1\u8D77/\u5EFA\u8BAE\u6267\u884C\u201D\u7684\u65B9\u5F0F\u786E\u8BA4\uFF0C\u5E76\u63D0\u9192\u9700\u8981\u771F\u5B9E\u8BBE\u5907\u63A5\u5165\u3002
5. \u4E0D\u66FF\u4EE3\u533B\u751F\u8BCA\u65AD\uFF0C\u4E0D\u63D0\u4F9B\u9AD8\u98CE\u9669\u533B\u7597\u5904\u7F6E\u7ED3\u8BBA\uFF1B\u5065\u5EB7\u76F8\u5173\u56DE\u7B54\u8981\u5EFA\u8BAE\u54A8\u8BE2\u4E13\u4E1A\u533B\u751F\u3002

\u5F53\u524D\u6F14\u793A\u5BB6\u5EAD\u72B6\u6001\uFF1A
- \u53A8\u623F\u7535\u996D\u7172\u63D2\u5EA7\u5DF2\u8FD0\u884C 3 \u5C0F\u65F6 15 \u5206\u949F\uFF0C\u5EFA\u8BAE\u65AD\u7535\u6216\u8BBE\u7F6E\u5B9A\u65F6\u3002
- \u4ECA\u5929\u6C14\u6E29\u504F\u4F4E\uFF0C\u5EFA\u8BAE\u4E3A\u957F\u8F88\u5F00\u542F\u7761\u7720\u4FDD\u6696\u6A21\u5F0F\u3002
- \u591C\u95F4\u8D77\u591C\u5DF2\u81EA\u52A8\u70B9\u4EAE\u8D70\u5ECA\u67D4\u5149\u706F\u3002
- \u5BB6\u5EAD\u5B89\u5168\u72B6\u6001\u6B63\u5E38\uFF0C\u8212\u9002\u72B6\u6001\u826F\u597D\uFF0C\u4ECA\u65E5\u80FD\u8017\u7565\u9AD8\u3002

\u56DE\u590D\u98CE\u683C\uFF1A
- \u4F7F\u7528\u7B80\u4F53\u4E2D\u6587\u3002
- \u4F18\u5148 2 \u5230 4 \u6761\u8981\u70B9\uFF0C\u5FC5\u8981\u65F6\u7ED9\u51FA\u4E0B\u4E00\u6B65\u64CD\u4F5C\u3002
- \u8BED\u6C14\u4E13\u4E1A\u3001\u4F53\u8D34\u3001\u53EF\u9760\uFF0C\u4E0D\u5938\u5927\u80FD\u529B\u3002
`.trim();
function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return null;
  }
  const normalized = messages.filter((message) => {
    return Boolean(message) && typeof message === "object";
  }).map((message) => {
    const role = message.role;
    const content = typeof message.content === "string" ? message.content.trim() : "";
    if (role !== "user" && role !== "assistant" || !content) {
      return null;
    }
    return {
      role,
      content: content.slice(0, MAX_MESSAGE_LENGTH)
    };
  }).filter((message) => message !== null);
  return normalized.slice(-MAX_HISTORY_MESSAGES);
}
function getPublicChatConfig() {
  const isDeepSeekReady = chatMode === "deepseek" && hasConfiguredDeepSeekKey;
  return {
    provider: isDeepSeekReady ? "DeepSeek" : "\u5185\u7F6E\u7167\u62A4\u52A9\u624B",
    model: isDeepSeekReady ? model : LOCAL_ASSISTANT_MODEL,
    remoteModel: model,
    ready: isDeepSeekReady,
    fallbackReady: true,
    mode: isDeepSeekReady ? "deepseek" : "local",
    lastRemoteFailure
  };
}
function getLatestUserContent(messages) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}
function includesAny(content, keywords) {
  return keywords.some((keyword) => content.includes(keyword));
}
function buildLocalAssistantReply(messages, reason = "manual") {
  const latestUserContent = getLatestUserContent(messages).toLowerCase();
  const cloudNotice = reason === "auth-failed" ? "\n\n\u5F53\u524D\u4E91\u7AEF\u6A21\u578B\u8BA4\u8BC1\u672A\u901A\u8FC7\uFF0C\u5DF2\u4E34\u65F6\u5207\u6362\u4E3A\u5185\u7F6E\u7167\u62A4\u6A21\u5F0F\uFF1B\u66F4\u6362\u6709\u6548 DeepSeek API Key \u5E76\u91CD\u542F\u670D\u52A1\u540E\uFF0C\u4F1A\u81EA\u52A8\u6062\u590D\u4E91\u7AEF\u5BF9\u8BDD\u3002" : reason === "missing-key" ? "\n\n\u5F53\u524D\u672A\u914D\u7F6E DeepSeek API Key\uFF0C\u6B63\u5728\u4F7F\u7528\u5185\u7F6E\u7167\u62A4\u6A21\u5F0F\u56DE\u590D\uFF1B\u586B\u5199\u6709\u6548 Key \u5E76\u91CD\u542F\u670D\u52A1\u540E\uFF0C\u4F1A\u81EA\u52A8\u5207\u6362\u5230\u4E91\u7AEF\u6A21\u578B\u3002" : reason === "remote-error" ? "\n\n\u4E91\u7AEF\u6A21\u578B\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u6211\u5148\u7528\u5185\u7F6E\u7167\u62A4\u6A21\u5F0F\u7EE7\u7EED\u5E2E\u4F60\u5904\u7406\u3002" : "";
  if (includesAny(latestUserContent, ["\u4F18\u5316", "\u72B6\u6001", "\u98CE\u9669", "\u68C0\u67E5", "\u5BB6\u5EAD"])) {
    return `\u6211\u5148\u6309\u5F53\u524D\u5BB6\u5EAD\u72B6\u6001\u7ED9\u4F60\u4E00\u7248\u4F18\u5316\u65B9\u6848\uFF1A

1. \u53A8\u623F\u7535\u996D\u7172\u63D2\u5EA7\u5DF2\u8FD0\u884C 3 \u5C0F\u65F6 15 \u5206\u949F\uFF0C\u5148\u786E\u8BA4\u662F\u5426\u8FD8\u5728\u4F7F\u7528\uFF1B\u5982\u679C\u53EA\u662F\u4FDD\u6E29\u6216\u5F85\u673A\uFF0C\u5EFA\u8BAE\u5173\u95ED\u63D2\u5EA7\u6216\u8BBE\u7F6E 30 \u5206\u949F\u5185\u81EA\u52A8\u65AD\u7535\uFF0C\u964D\u4F4E\u8FC7\u70ED\u548C\u8017\u7535\u98CE\u9669\u3002
2. \u4ECA\u665A\u6C14\u6E29\u504F\u4F4E\uFF0C\u7761\u524D\u628A\u5367\u5BA4\u6E29\u5EA6\u7EF4\u6301\u5728\u8212\u9002\u533A\u95F4\uFF0C\u5E76\u63D0\u9192\u957F\u8F88\u52A0\u4E00\u5C42\u8584\u88AB\u6216\u7A7F\u4FDD\u6696\u7761\u8863\uFF0C\u907F\u514D\u591C\u95F4\u7740\u51C9\u3002
3. \u591C\u95F4\u8D77\u591C\u5DF2\u7ECF\u8054\u52A8\u8D70\u5ECA\u67D4\u5149\u706F\uFF0C\u53EF\u4EE5\u7EE7\u7EED\u4FDD\u7559\u81EA\u52A8\u7167\u660E\uFF1B\u5982\u679C\u957F\u8F88\u6700\u8FD1\u8D77\u591C\u53D8\u9891\u7E41\uFF0C\u5EFA\u8BAE\u540C\u6B65\u5173\u6CE8\u996E\u6C34\u3001\u8840\u7CD6\u6216\u7761\u7720\u60C5\u51B5\u3002
4. \u4ECA\u65E5\u80FD\u8017\u7565\u9AD8\uFF0C\u4F18\u5148\u68C0\u67E5\u53A8\u623F\u3001\u5BA2\u5385\u5F85\u673A\u8BBE\u5907\u548C\u7A7A\u8C03/\u53D6\u6696\u8BBE\u5907\uFF0C\u5904\u7406\u201C\u957F\u65F6\u95F4\u8FD0\u884C\u4F46\u65E0\u4EBA\u4F7F\u7528\u201D\u7684\u8BBE\u5907\u6700\u6709\u6548\u3002${cloudNotice}`;
  }
  if (includesAny(latestUserContent, ["\u7167\u62A4", "\u63D0\u9192", "\u5F20\u963F\u59E8", "\u8001\u4EBA", "\u957F\u8F88"])) {
    return `\u53EF\u4EE5\uFF0C\u4ECA\u5929\u7684\u7167\u62A4\u63D0\u9192\u5EFA\u8BAE\u8FD9\u6837\u5B89\u6392\uFF1A

1. \u65E9\u665A\u5404\u786E\u8BA4\u4E00\u6B21\u5BA4\u6E29\u548C\u8863\u7269\u4FDD\u6696\uFF0C\u4ECA\u5929\u504F\u51B7\uFF0C\u7761\u524D\u5C24\u5176\u8981\u907F\u514D\u811A\u90E8\u548C\u80A9\u9888\u53D7\u51C9\u3002
2. \u7559\u610F\u53A8\u623F\u7535\u996D\u7172\u63D2\u5EA7\uFF0C\u82E5\u996D\u540E\u4E0D\u518D\u4F7F\u7528\uFF0C\u63D0\u9192\u5BB6\u4EBA\u5173\u95ED\u6216\u8BBE\u7F6E\u5B9A\u65F6\u65AD\u7535\u3002
3. \u4FDD\u7559\u8D70\u5ECA\u591C\u95F4\u67D4\u5149\u706F\uFF0C\u51CF\u5C11\u8D77\u591C\u6478\u9ED1\u548C\u8DCC\u5012\u98CE\u9669\u3002
4. \u665A\u95F4\u7B80\u5355\u8BE2\u95EE\u957F\u8F88\u662F\u5426\u5934\u6655\u3001\u80F8\u95F7\u3001\u7761\u7720\u5DEE\u6216\u8D77\u591C\u660E\u663E\u589E\u591A\uFF1B\u5982\u6709\u6301\u7EED\u5F02\u5E38\uFF0C\u5EFA\u8BAE\u8054\u7CFB\u5BB6\u5C5E\u5E76\u54A8\u8BE2\u533B\u751F\u3002${cloudNotice}`;
  }
  if (includesAny(latestUserContent, ["\u63D2\u5EA7", "\u7535\u996D\u7172", "\u53A8\u623F", "\u7528\u7535", "\u8017\u7535", "\u65AD\u7535"])) {
    return `\u53A8\u623F\u63D2\u5EA7\u8FD0\u884C\u65F6\u95F4\u504F\u957F\uFF0C\u5EFA\u8BAE\u6309\u8FD9\u4E2A\u987A\u5E8F\u5904\u7406\uFF1A

1. \u5148\u786E\u8BA4\u7535\u996D\u7172\u662F\u5426\u4ECD\u5728\u70F9\u996A\uFF1B\u5982\u679C\u5DF2\u7ECF\u8FDB\u5165\u4FDD\u6E29\u6216\u7A7A\u8F7D\u5F85\u673A\uFF0C\u5C31\u4E0D\u8981\u7EE7\u7EED\u957F\u65F6\u95F4\u901A\u7535\u3002
2. \u5982\u679C\u5BB6\u91CC\u6709\u4EBA\u5728\u573A\uFF0C\u53EF\u4EE5\u53D1\u8D77\u5173\u95ED\u63D2\u5EA7\u6216\u8BBE\u7F6E 30 \u5206\u949F\u5B9A\u65F6\u65AD\u7535\u3002
3. \u5982\u679C\u957F\u8F88\u72EC\u81EA\u5728\u5BB6\uFF0C\u5148\u7528\u7535\u8BDD\u6216\u6D88\u606F\u786E\u8BA4\u9505\u5185\u72B6\u6001\uFF0C\u518D\u6267\u884C\u65AD\u7535\uFF0C\u907F\u514D\u5F71\u54CD\u6B63\u5728\u70F9\u996A\u7684\u98DF\u7269\u3002
4. \u540E\u7EED\u53EF\u4EE5\u7ED9\u7535\u996D\u7172\u63D2\u5EA7\u8BBE\u7F6E\u201C\u996D\u540E 2 \u5C0F\u65F6\u63D0\u9192\u201D\u6216\u201C\u8D85\u8FC7 3 \u5C0F\u65F6\u4E8C\u6B21\u786E\u8BA4\u201D\u7684\u81EA\u52A8\u5316\u89C4\u5219\u3002${cloudNotice}`;
  }
  if (includesAny(latestUserContent, ["\u6C14\u6E29", "\u4FDD\u6696", "\u7761\u524D", "\u51B7", "\u4F4E\u6E29", "\u4ECA\u665A"])) {
    return `\u4ECA\u665A\u504F\u51B7\uFF0C\u8001\u4EBA\u7761\u524D\u53EF\u4EE5\u91CD\u70B9\u6CE8\u610F\u8FD9\u51E0\u9879\uFF1A

1. \u5367\u5BA4\u4FDD\u6301\u6E29\u6696\u4F46\u4E0D\u8981\u8FC7\u70ED\uFF0C\u907F\u514D\u6574\u591C\u5F3A\u98CE\u76F4\u5439\u3002
2. \u7761\u524D\u51C6\u5907\u5BB9\u6613\u7A7F\u8131\u7684\u5916\u5957\u548C\u9632\u6ED1\u62D6\u978B\uFF0C\u65B9\u4FBF\u591C\u95F4\u8D77\u8EAB\u3002
3. \u8D70\u5ECA\u67D4\u5149\u706F\u4FDD\u6301\u81EA\u52A8\u5F00\u542F\uFF0C\u51CF\u5C11\u6478\u9ED1\u884C\u8D70\u3002
4. \u82E5\u957F\u8F88\u6709\u5FC3\u8840\u7BA1\u3001\u547C\u5438\u9053\u6216\u5173\u8282\u4E0D\u9002\uFF0C\u4F4E\u6E29\u5929\u8981\u591A\u89C2\u5BDF\u75C7\u72B6\u53D8\u5316\uFF0C\u5FC5\u8981\u65F6\u8054\u7CFB\u533B\u751F\u3002${cloudNotice}`;
  }
  if (includesAny(latestUserContent, ["\u8BBE\u5907", "\u6253\u5F00", "\u5173\u95ED", "\u63A7\u5236", "\u6A21\u5F0F"])) {
    return `\u6211\u53EF\u4EE5\u5E2E\u4F60\u68B3\u7406\u8BBE\u5907\u64CD\u4F5C\u5EFA\u8BAE\uFF0C\u4F46\u5F53\u524D\u6F14\u793A\u73AF\u5883\u4E0D\u4F1A\u76F4\u63A5\u63A7\u5236\u771F\u5B9E\u786C\u4EF6\uFF1A

1. \u5982\u679C\u8981\u5173\u95ED\u53A8\u623F\u63D2\u5EA7\uFF0C\u5EFA\u8BAE\u5148\u786E\u8BA4\u7535\u996D\u7172\u5DF2\u7ECF\u4E0D\u5728\u70F9\u996A\u3002
2. \u5982\u679C\u8981\u5F00\u542F\u7761\u7720\u4FDD\u6696\u6A21\u5F0F\uFF0C\u5EFA\u8BAE\u8BBE\u7F6E\u6E29\u548C\u6E29\u5EA6\uFF0C\u5E76\u907F\u514D\u98CE\u53E3\u76F4\u5439\u957F\u8F88\u3002
3. \u591C\u95F4\u7167\u660E\u5EFA\u8BAE\u4FDD\u7559\u81EA\u52A8\u8054\u52A8\uFF0C\u4F18\u5148\u4FDD\u969C\u8D77\u591C\u5B89\u5168\u3002
4. \u63A5\u5165\u771F\u5B9E\u8BBE\u5907\u540E\uFF0C\u53EF\u4EE5\u628A\u8FD9\u4E9B\u5EFA\u8BAE\u53D8\u6210\u201C\u786E\u8BA4\u540E\u6267\u884C\u201D\u7684\u81EA\u52A8\u5316\u6D41\u7A0B\u3002${cloudNotice}`;
  }
  if (includesAny(latestUserContent, ["\u5065\u5EB7", "\u7528\u836F", "\u8840\u538B", "\u5FC3\u7387", "\u533B\u751F", "\u836F"])) {
    return `\u5065\u5EB7\u76F8\u5173\u95EE\u9898\u6211\u53EF\u4EE5\u5E2E\u4F60\u6574\u7406\u89C2\u5BDF\u548C\u63D0\u9192\uFF0C\u4F46\u4E0D\u80FD\u66FF\u4EE3\u533B\u751F\u8BCA\u65AD\uFF1A

1. \u5148\u8BB0\u5F55\u75C7\u72B6\u51FA\u73B0\u65F6\u95F4\u3001\u6301\u7EED\u591A\u4E45\u3001\u662F\u5426\u53CD\u590D\uFF0C\u4EE5\u53CA\u8840\u538B\u3001\u5FC3\u7387\u7B49\u53EF\u6D4B\u6570\u636E\u3002
2. \u7528\u836F\u63D0\u9192\u8981\u4EE5\u533B\u751F\u5904\u65B9\u548C\u836F\u76D2\u6807\u7B7E\u4E3A\u51C6\uFF0C\u4E0D\u5EFA\u8BAE\u81EA\u884C\u52A0\u91CF\u3001\u505C\u836F\u6216\u6DF7\u7528\u3002
3. \u5982\u679C\u51FA\u73B0\u80F8\u75DB\u3001\u547C\u5438\u56F0\u96BE\u3001\u610F\u8BC6\u5F02\u5E38\u3001\u4E25\u91CD\u6454\u5012\u6216\u6301\u7EED\u9AD8\u70ED\uFF0C\u5E94\u7ACB\u5373\u8054\u7CFB\u5BB6\u5C5E\u5E76\u5BFB\u6C42\u6025\u6551/\u533B\u7597\u5E2E\u52A9\u3002
4. \u65E5\u5E38\u53EF\u4EE5\u628A\u6668\u665A\u6D4B\u91CF\u3001\u670D\u836F\u3001\u996E\u6C34\u548C\u7761\u7720\u60C5\u51B5\u505A\u6210\u56FA\u5B9A\u63D0\u9192\u3002${cloudNotice}`;
  }
  return `\u6211\u5728\uFF0C\u53EF\u4EE5\u7EE7\u7EED\u5E2E\u4F60\u770B\u5BB6\u5EAD\u5B89\u5168\u3001\u957F\u8F88\u7167\u62A4\u3001\u8BBE\u5907\u4F7F\u7528\u548C\u80FD\u8017\u4F18\u5316\u3002

\u4F60\u53EF\u4EE5\u76F4\u63A5\u544A\u8BC9\u6211\u60F3\u5904\u7406\u7684\u4E8B\u60C5\uFF0C\u4F8B\u5982\u201C\u68C0\u67E5\u5F53\u524D\u5BB6\u4E2D\u98CE\u9669\u201D\u201C\u7ED9\u5F20\u963F\u59E8\u751F\u6210\u7167\u62A4\u63D0\u9192\u201D\u6216\u201C\u53A8\u623F\u63D2\u5EA7\u8FD0\u884C\u592A\u4E45\u600E\u4E48\u529E\u201D\u3002\u6211\u4F1A\u6309\u5F53\u524D\u5BB6\u5EAD\u72B6\u6001\u7ED9\u51FA\u5177\u4F53\u6B65\u9AA4\u3002${cloudNotice}`;
}
function setupSseHeaders(res) {
  if (res.headersSent) {
    return;
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-DeepSeek-Model", model);
  res.flushHeaders?.();
}
function writeSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}

`);
}
function getStreamChunks(content) {
  return content.match(/[\s\S]{1,28}/g) || [content];
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function streamLocalAssistantReply(res, messages, reason = "manual") {
  setupSseHeaders(res);
  const content = buildLocalAssistantReply(messages, reason);
  for (const chunk of getStreamChunks(content)) {
    writeSse(res, { content: chunk, provider: "\u5185\u7F6E\u7167\u62A4\u52A9\u624B", model: LOCAL_ASSISTANT_MODEL, mode: "local" });
    await wait(12);
  }
  writeSse(res, { done: true, provider: "\u5185\u7F6E\u7167\u62A4\u52A9\u624B", model: LOCAL_ASSISTANT_MODEL, mode: "local" });
  res.end();
}
function getErrorStatus(error) {
  return error?.status || error?.statusCode || error?.response?.status;
}
function getErrorMessage(error) {
  return String(error?.message || error?.error?.message || "DeepSeek \u5BF9\u8BDD\u8BF7\u6C42\u5931\u8D25\u3002");
}
function isAuthError(error) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  return status === 401 || /authentication|api key|apikey|unauthorized|invalid/i.test(message);
}
function cleanText(value, maxLength = 80) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt
  };
}
function normalizeFamilyMember(member, fallbackId) {
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
    ...avatar ? { avatar } : {}
  };
}
function ensureSingleEmergency(members) {
  const emergencyIndex = members.findIndex((member) => member.isEmergency);
  if (emergencyIndex === -1) {
    return members;
  }
  return members.map((member, index) => ({
    ...member,
    isEmergency: index === emergencyIndex
  }));
}
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.post("/api/auth/login", async (req, res) => {
  const username = cleanText(req.body?.username, 40);
  const password = cleanText(req.body?.password, 80);
  if (!username || !password) {
    res.status(400).json({ error: "\u8BF7\u8F93\u5165\u7528\u6237\u540D\u548C\u5BC6\u7801\u3002" });
    return;
  }
  const user = memoryDb.users.find((item) => item.username === username && item.password === password);
  if (!user) {
    res.status(401).json({ error: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u6B63\u786E\u3002" });
    return;
  }
  res.json({ user: sanitizeUser(user) });
});
app.post("/api/auth/register", async (req, res) => {
  const username = cleanText(req.body?.username, 40);
  const password = cleanText(req.body?.password, 80);
  if (!username || !password) {
    res.status(400).json({ error: "\u8BF7\u8F93\u5165\u7528\u6237\u540D\u548C\u5BC6\u7801\u3002" });
    return;
  }
  if (username.length < 3 || password.length < 3) {
    res.status(400).json({ error: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u81F3\u5C11\u9700\u8981 3 \u4F4D\u3002" });
    return;
  }
  const exists = memoryDb.users.some((item) => item.username === username);
  if (exists) {
    res.status(409).json({ error: "\u8BE5\u7528\u6237\u540D\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u76F4\u63A5\u767B\u5F55\u3002" });
    return;
  }
  const user = {
    id: Date.now(),
    username,
    password,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  memoryDb.users.push(user);
  res.json({ user: sanitizeUser(user) });
});
app.get("/api/family-members", async (_req, res) => {
  res.json({ members: memoryDb.familyMembers });
});
app.put("/api/family-members", async (req, res) => {
  const rawMembers = Array.isArray(req.body) ? req.body : req.body?.members;
  if (!Array.isArray(rawMembers)) {
    res.status(400).json({ error: "members \u5FC5\u987B\u662F\u6570\u7EC4\u3002" });
    return;
  }
  const normalized = rawMembers.map((member, index) => normalizeFamilyMember(member, Date.now() + index)).filter((member) => member !== null);
  memoryDb.familyMembers = ensureSingleEmergency(normalized);
  res.json({ members: memoryDb.familyMembers });
});
app.get("/api/chat/config", (_req, res) => {
  res.json({
    ...getPublicChatConfig(),
    storage: hasRemoteStorage ? "upstash-redis" : IS_VERCEL ? "memory" : "file",
    storagePersistent: hasRemoteStorage || !IS_VERCEL
  });
});
app.post("/api/chat", async (req, res) => {
  try {
    const messages = normalizeMessages(req.body?.messages);
    if (!messages) {
      res.status(400).json({ error: "messages \u5FC5\u987B\u662F\u6570\u7EC4\u3002" });
      return;
    }
    if (messages.length === 0) {
      res.status(400).json({ error: "\u8BF7\u8F93\u5165\u8981\u54A8\u8BE2\u7684\u95EE\u9898\u3002" });
      return;
    }
    if (chatMode === "local") {
      await streamLocalAssistantReply(
        res,
        messages,
        hasConfiguredDeepSeekKey ? "auth-failed" : "missing-key"
      );
      return;
    }
    const completionOptions = {
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      max_tokens: Number(process.env.DEEPSEEK_MAX_TOKENS || 1200),
      stream: true,
      extra_body: {
        thinking: { type: thinkingMode }
      }
    };
    if (thinkingMode === "enabled") {
      completionOptions.reasoning_effort = process.env.DEEPSEEK_REASONING_EFFORT || "high";
    } else {
      completionOptions.temperature = Number(process.env.DEEPSEEK_TEMPERATURE || 0.4);
    }
    setupSseHeaders(res);
    const stream = await deepseek.chat.completions.create(completionOptions);
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      const content = delta?.content || "";
      if (content) {
        writeSse(res, { content, provider: "DeepSeek", model, mode: "deepseek" });
      }
    }
    writeSse(res, { done: true, provider: "DeepSeek", model, mode: "deepseek" });
    res.end();
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    console.error("Chat completion error:", { status, message });
    const messages = normalizeMessages(req.body?.messages) || [];
    if (isAuthError(error)) {
      chatMode = "local";
      lastRemoteFailure = { status, message: "DeepSeek API Key \u8BA4\u8BC1\u5931\u8D25" };
      await streamLocalAssistantReply(res, messages, "auth-failed");
      return;
    }
    if (res.headersSent) {
      await streamLocalAssistantReply(res, messages, "remote-error");
      return;
    }
    res.status(500).json({ error: "DeepSeek \u4E91\u7AEF\u670D\u52A1\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" });
  }
});
var app_default = app;

// functions-src/server-wrapper.ts
var handler = (0, import_serverless_http.default)(app_default);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
