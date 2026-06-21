import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { AlertCircle, Mic, Power, Send, ShieldAlert, Sparkles, Square, Volume2 } from 'lucide-react';
import { CuteAIAvatar } from '../CuteAIAvatar';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatMode = 'deepseek' | 'local';

type ChatConfig = {
  provider: string;
  model: string;
  remoteModel?: string;
  ready: boolean;
  fallbackReady?: boolean;
  mode?: ChatMode;
  lastRemoteFailure?: {
    status?: number;
    message: string;
  } | null;
};

const QUICK_PROMPTS = [
  '帮我检查一下当前家中有哪些风险',
  '给张阿姨生成一份今天的照护提醒',
  '厨房插座运行太久应该怎么处理',
  '今晚气温低，老人睡前要注意什么',
];

function appendAssistantContent(setMessages: Dispatch<SetStateAction<Message[]>>, content: string) {
  setMessages(prev => {
    const next = [...prev];
    const lastMessage = next[next.length - 1];

    if (!lastMessage || lastMessage.role !== 'assistant') {
      return [...next, { role: 'assistant', content }];
    }

    next[next.length - 1] = {
      ...lastMessage,
      content: lastMessage.content + content,
    };

    return next;
  });
}

function replaceEmptyAssistantMessage(setMessages: Dispatch<SetStateAction<Message[]>>, content: string) {
  setMessages(prev => {
    const next = [...prev];
    const lastMessage = next[next.length - 1];

    if (lastMessage?.role === 'assistant' && !lastMessage.content.trim()) {
      next[next.length - 1] = { ...lastMessage, content };
      return next;
    }

    return [...next, { role: 'assistant', content }];
  });
}

export default function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    let isMounted = true;

    // 纯前端模式：直接设置配置
    if (isMounted) {
      setConfig({
        provider: 'DeepSeek (前端直连)',
        model: 'deepseek-chat',
        ready: true,
        mode: 'deepseek',
      });
    }

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const handleSend = async (text = inputValue) => {
    const trimmedText = text.trim();

    if (!trimmedText || isLoading) return;

    const userMessage = { role: 'user' as const, content: trimmedText };
    const nextMessages = [...messages, userMessage];
    const controller = new AbortController();

    abortControllerRef.current = controller;
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      // 从 Vite 环境变量中读取 API Key（请在部署环境或本地 `.env` 中配置 `VITE_DEEPSEEK_API_KEY`）
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: nextMessages,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || 'DeepSeek 服务暂时不可用');
      }

      if (!response.body) {
        throw new Error('当前浏览器无法读取流式响应');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
            try {
              const data = JSON.parse(trimmedLine.slice(6));
              const content = data.choices[0]?.delta?.content || '';
              if (content) {
                appendAssistantContent(setMessages, content);
              }
            } catch (e) {
              console.error('解析流数据失败:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        replaceEmptyAssistantMessage(setMessages, '已停止本次回复。');
      } else {
        console.error('Chat error:', error);
        replaceEmptyAssistantMessage(setMessages, `连接出错：${error.message || 'DeepSeek 对话请求失败'}`);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const isLocalMode = config?.mode === 'local' || config?.ready === false;
  const statusLabel = isLocalMode ? '内置照护' : config?.model || 'DeepSeek';
  const statusDotClass = isLocalMode ? 'bg-tertiary-container' : 'bg-secondary-fixed-dim animate-pulse';

  return (
    <div className="flex flex-col h-full bg-surface">
      <header className="flex items-center justify-between px-5 py-4 bg-surface/90 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <ShieldAlert className="text-tertiary-container" size={24} fill="currentColor" />
        <h1 className="text-[20px] font-bold text-on-surface">AI管家</h1>
        <div className="flex items-center gap-2 bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm border border-outline-variant/20">
          <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
          <span className="text-[12px] text-on-surface-variant font-medium max-w-[110px] truncate">{statusLabel}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto chat-scroll px-5 pb-6 flex flex-col gap-6 relative">
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tertiary-fixed to-primary-fixed-dim p-[2px] shadow-sm shrink-0">
               <CuteAIAvatar className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-1.5 mt-0.5">
              <h2 className="text-[18px] font-bold text-on-surface">你好，我是慧护家AI管家</h2>
              <p className="text-[15px] text-on-surface-variant leading-relaxed">我可以帮你检查家中状态、照护长辈、控制设备</p>
              
              <div className="bg-tertiary-fixed/40 rounded-2xl rounded-tl-sm p-3 mt-1 flex items-center gap-2 w-max max-w-full">
                <Volume2 className="text-tertiary-container shrink-0" size={16} />
                <span className="text-[13px] font-medium text-on-tertiary-container leading-snug">今天气温较低，记得提醒家人注意保暖哦~</span>
              </div>
            </div>
          </div>
        </div>

        {isLocalMode && (
          <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-container shrink-0 flex items-center justify-center shadow-sm">
              <AlertCircle size={18} />
            </div>
            <div className="bg-tertiary-fixed/50 text-on-tertiary-container rounded-[20px] rounded-tl-sm p-4 shadow-sm text-[14px] leading-relaxed font-medium">
              当前使用内置照护模式，可以继续对话。配置有效 <span className="font-bold">DEEPSEEK_API_KEY</span> 并重启服务后，会自动恢复云端模型。
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <>
            <div className="flex items-start gap-3 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="w-9 h-9 rounded-full shrink-0 shadow-sm mt-1">
                 <CuteAIAvatar className="w-full h-full" />
              </div>
              
              <div className="flex flex-col gap-3 w-full max-w-[calc(100%-2.5rem)]">
                <div className="bg-surface-container-lowest rounded-[20px] rounded-tl-sm p-4 shadow-sm inline-block">
                   <p className="text-[15px] leading-relaxed text-on-surface font-medium">
                      我已检查当前家庭状态，发现 <span className="text-tertiary-container font-bold text-[16px]">3</span> 项需要关注的地方：
                   </p>
                </div>

                <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-[24px] overflow-hidden flex flex-col border border-surface-variant shadow-soft-card">
                  <div className="bg-tertiary-fixed/30 px-4 py-3 flex justify-between items-center border-b border-outline-variant/10">
                    <h3 className="text-[14px] font-bold text-on-surface">AI 家庭状态分析</h3>
                    <span className="text-[12px] text-on-surface-variant">今天 09:30</span>
                  </div>
                  
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center shrink-0">
                        <Power className="text-tertiary-container" size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[15px] font-bold text-on-surface truncate pb-0.5">厨房插座 (电饭煲)</span>
                          <span className="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium whitespace-nowrap">待机偏久</span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant">已运行 3 小时 15 分钟</p>
                        <p className="text-[12px] text-tertiary-container mt-0.5 font-medium">建议关闭或定时断电</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSend('请帮我优化当前家庭状态，并说明每一步的原因')}
                      disabled={isLoading}
                      className="flex-[1.2] min-h-11 rounded-xl bg-gradient-to-r from-tertiary-container to-tertiary text-white shadow-md text-[13px] font-bold active:scale-95 transition-transform whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:active:scale-100"
                    >
                      立即优化
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pl-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="min-h-11 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-left text-[13px] font-medium leading-snug text-on-surface-variant shadow-sm transition-all active:scale-[0.98] hover:border-primary/40 hover:text-primary cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="mb-1 text-primary" size={14} />
                  {prompt}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg, index) => (
          msg.role === 'user' ? (
            <div key={index} className="flex flex-col items-end gap-1.5 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="用户头像" className="w-full h-full object-cover"/>
                </div>
                <div className="bg-primary-container text-on-primary-container rounded-[20px] rounded-tr-sm px-4 py-3 shadow-sm max-w-[80vw]">
                  <p className="text-[15px] font-medium leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="flex items-start gap-3 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-2">
              <div className="w-9 h-9 rounded-full shrink-0 shadow-sm mt-1">
                 <CuteAIAvatar className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-3 w-full max-w-[calc(100%-2.5rem)]">
                <div className="bg-surface-container-lowest rounded-[20px] rounded-tl-sm p-4 shadow-sm inline-block">
                   <div className="text-[15px] leading-relaxed text-on-surface font-medium markdown-body [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                   </div>
                   {isLoading && index === messages.length - 1 && (
                     <div className="flex gap-1 mt-2" aria-label="AI管家正在回复">
                       <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                   )}
                </div>
              </div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </main>

      <div className="px-4 py-3 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="语音输入"
            className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 active:scale-95 transition-transform cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Mic size={20} />
          </button>
          <div className="flex-1 min-h-11 bg-surface-container-low rounded-full px-4 py-2.5 border border-outline-variant/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all flex items-center">
            <input 
              type="text" 
              aria-label="输入给AI管家的问题"
              placeholder="和 AI 管家说点什么..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-[16px] placeholder:text-outline text-on-surface placeholder:font-medium leading-normal"
            />
          </div>
          {isLoading ? (
            <button 
              type="button"
              aria-label="停止回复"
              onClick={handleStop}
              className="w-11 h-11 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-error"
            >
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button 
              type="button"
              aria-label="发送消息"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm disabled:opacity-50 disabled:active:scale-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Send size={18} className="translate-x-px translate-y-px" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
