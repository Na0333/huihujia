import React, { useState } from 'react';
import { ArrowRight, Heart, ShieldCheck, UserPlus } from 'lucide-react';

type AuthUser = {
  id: number;
  username: string;
  createdAt: string;
};

type LoginViewProps = {
  onLogin: (user: AuthUser) => void;
  onRegister: () => void;
  initialUsername?: string;
  notice?: string | null;
};

export default function LoginView({
  onLogin,
  onRegister,
  initialUsername = '',
  notice = null,
}: LoginViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const submitLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setMessage('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // 纯前端演示：读取 localStorage 中注册的账号进行校验
    let authenticated = false;
    try {
      const registered = JSON.parse(localStorage.getItem('huihujia_users') || '[]');
      const found = registered.find(
        (u: { username: string; password: string }) =>
          u.username === trimmedUsername && u.password === trimmedPassword
      );
      if (found) authenticated = true;
    } catch {
      // ignore
    }

    setIsLoading(false);

    if (authenticated) {
      onLogin({
        id: Date.now(),
        username: trimmedUsername,
        createdAt: new Date().toISOString(),
      });
    } else {
      setMessage('用户名或密码不正确');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="flex flex-col h-screen relative font-sans w-full max-w-md mx-auto bg-surface shadow-2xl overflow-hidden sm:border-x sm:border-surface-variant">
      <div 
        className="absolute inset-0 bg-cover bg-center h-1/2 opacity-60"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-surface/20 to-surface"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-8 pt-20">
        <div className="flex flex-col items-center mb-10 mt-10">
          <div className="w-20 h-20 bg-surface-container-lowest rounded-[28px] shadow-lg flex items-center justify-center mb-4 border border-outline-variant/20 relative">
             <Heart className="text-secondary opacity-20 absolute" size={56} />
             <ShieldCheck className="text-primary relative z-10" size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-[28px] font-display font-bold text-on-surface tracking-tight mb-2">慧护家</h1>
          <p className="text-[15px] font-medium text-on-surface-variant">让关爱随时随地，守护家人每一天</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-busy={isLoading}>
          <div className="flex flex-col gap-1.5">
             <label htmlFor="username" className="text-[13px] font-bold text-on-surface-variant ml-1">用户名</label>
             <input 
               id="username"
               type="text" 
               placeholder="请输入用户名" 
               className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl px-4 py-3.5 text-[16px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none shadow-sm"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               autoComplete="username"
               autoFocus={initialUsername !== 'admin'}
               required
             />
          </div>
          
          <div className="flex flex-col gap-1.5 mb-1">
             <label htmlFor="password" className="text-[13px] font-bold text-on-surface-variant ml-1">密码</label>
             <input 
                id="password"
                type="password" 
                placeholder="请输入密码" 
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl px-4 py-3.5 text-[16px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
          </div>

          {/* 注意：不要在生产环境中使用前端静态默认凭据。请通过后端用户管理或环境变量配置管理员账号。 */}

          {notice && !message && (
            <div
              className="rounded-2xl border border-secondary/20 bg-secondary-container/30 px-4 py-3 text-[13px] font-bold leading-snug text-on-secondary-container"
              role="status"
            >
              {notice}
            </div>
          )}

          {message && (
            <div
              className="rounded-2xl border border-error/20 bg-error-container/60 px-4 py-3 text-[13px] font-bold leading-snug text-on-error-container"
              role="alert"
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-3">
            <button 
               type="submit" 
               disabled={isLoading}
               className="w-full min-h-12 bg-primary text-white rounded-2xl py-4 font-bold text-[16px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            >
               {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               ) : (
                  <>
                    登录
                    <ArrowRight size={18} />
                  </>
               )}
            </button>

            <button 
               type="button" 
               disabled={isLoading}
               onClick={onRegister}
               className="w-full min-h-12 bg-surface-container-lowest text-primary border border-primary/30 rounded-2xl py-4 font-bold text-[16px] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
               注册
               <UserPlus size={18} />
            </button>
          </div>
        </form>

        <div className="mt-auto pb-10 text-center text-[12px] text-on-surface-variant font-medium">
          登录即代表同意 <a href="#" className="text-primary hover:underline">用户协议</a> 和 <a href="#" className="text-primary hover:underline">隐私政策</a>
        </div>
      </div>
    </div>
  );
}
