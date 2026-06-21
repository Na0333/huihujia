import React, { useState } from 'react';
import { ArrowLeft, Heart, ShieldCheck, UserPlus } from 'lucide-react';

type RegisterViewProps = {
  onBack: () => void;
  onRegistered: (username: string) => void;
};

export default function RegisterView({ onBack, onRegistered }: RegisterViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setMessage('请输入用户名和密码');
      return;
    }

    if (trimmedUsername.length < 3 || trimmedPassword.length < 3) {
      setMessage('用户名和密码至少需要 3 位');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // 纯前端注册：保存到 localStorage，之后可用来登录
    try {
      const registered = JSON.parse(localStorage.getItem('huihujia_users') || '[]');
      const exists = registered.some((u: { username: string }) => u.username === trimmedUsername);
      if (exists && trimmedUsername !== 'admin') {
        setMessage('该用户名已注册，请直接登录');
        setIsLoading(false);
        return;
      }
      registered.push({ username: trimmedUsername, password: trimmedPassword });
      localStorage.setItem('huihujia_users', JSON.stringify(registered));
    } catch {
      // ignore localStorage errors
    }

    setIsLoading(false);
    onRegistered(trimmedUsername);
  };

  return (
    <div className="flex flex-col h-screen relative font-sans w-full max-w-md mx-auto bg-surface shadow-2xl overflow-hidden sm:border-x sm:border-surface-variant">
      <div
        className="absolute inset-0 bg-cover bg-center h-1/2 opacity-60"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800')" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-surface/20 to-surface"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-8 pt-8">
        <button
          type="button"
          onClick={onBack}
          className="w-12 h-12 -ml-2 rounded-2xl bg-surface-container-lowest/80 text-on-surface-variant shadow-sm backdrop-blur flex items-center justify-center cursor-pointer active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          aria-label="返回登录页面"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="flex flex-col items-center mb-9 mt-8">
          <div className="w-20 h-20 bg-surface-container-lowest rounded-[28px] shadow-lg flex items-center justify-center mb-4 border border-outline-variant/20 relative">
            <Heart className="text-secondary opacity-20 absolute" size={56} />
            <ShieldCheck className="text-primary relative z-10" size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-[28px] font-display font-bold text-on-surface tracking-tight mb-2">创建账号</h1>
          <p className="text-[15px] font-medium text-on-surface-variant">加入慧护家，一起守护家人</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-busy={isLoading}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-username" className="text-[13px] font-bold text-on-surface-variant ml-1">
              用户名
            </label>
            <input
              id="register-username"
              type="text"
              placeholder="请输入用户名（至少 3 位）"
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl px-4 py-3.5 text-[16px] text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              minLength={3}
              maxLength={40}
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-[13px] font-bold text-on-surface-variant ml-1">
              密码
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="请输入密码（至少 3 位）"
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl px-4 py-3.5 text-[16px] text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={3}
              maxLength={80}
              required
            />
          </div>

          <p className="text-[12px] text-on-surface-variant px-1 font-medium">
            用户名和密码均不少于 3 位
          </p>

          {message && (
            <div
              className="rounded-2xl border border-error/20 bg-error-container/60 px-4 py-3 text-[13px] font-bold leading-snug text-on-error-container"
              role="alert"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-12 mt-3 bg-primary text-white rounded-2xl py-4 font-bold text-[16px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                完成注册
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-auto pb-10 text-center text-[13px] text-on-surface-variant font-medium">
          已有账号？
          <button
            type="button"
            onClick={onBack}
            className="ml-1 text-primary font-bold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
          >
            返回登录
          </button>
        </div>
      </div>
    </div>
  );
}
