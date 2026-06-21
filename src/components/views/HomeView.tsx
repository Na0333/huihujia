import React, { useState } from 'react';
import { ChevronDown, MessageCircle, CloudSun, ShieldCheck, Shield, Leaf, Zap, Sparkles, AlertTriangle, Thermometer, Moon, ChevronRight } from 'lucide-react';
import { CuteAIAvatar } from '../CuteAIAvatar';

export default function HomeView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [currentHome, setCurrentHome] = useState("张阿姨家");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [reminders, setReminders] = useState([
    { id: 1, title: '厨房插座已开启 3 小时，建议关闭以保障安全', time: '08:32', type: 'error' as const },
    { id: 2, title: '今晚室温较低，建议为老人开启睡眠保暖模式', time: '08:20', type: 'primary' as const },
    { id: 3, title: '检测到夜间起夜，已自动点亮走廊柔光灯', time: '昨晚 21:12', type: 'variant' as const },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleOptimize = () => {
    if (reminders.length === 0) return showToast("已是最佳状态");
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setReminders([]);
      showToast("全屋状态已优化");
    }, 1200);
  };

  const getReminderIcon = (type: string) => {
    switch(type) {
      case 'error': return <AlertTriangle size={16} />;
      case 'primary': return <Thermometer size={18} />;
      case 'variant': return <Moon size={16} />;
    }
  };

  const getReminderClass = (type: string) => {
    switch(type) {
      case 'error': return 'bg-error-container/60 text-on-error-container';
      case 'primary': return 'bg-primary-fixed/60 text-primary';
      case 'variant': return 'bg-surface-variant/80 text-on-surface-variant';
    }
  };

  return (
    <div className="flex flex-col pb-6 relative">
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-5 py-2.5 rounded-full text-[14px] font-medium shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}
      <div 
        className="ambient-bg" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRACsKbY7BaKL42LOLQlogNpiiS7ELZet-c4k6w_gsDKVa2cxjfV-cDBeWivkyST_bTSoq0v9qeBWxuHlW27IusCo1WSEL9bZ24oqFH2WRildMAgcfuNGiN3o-x-vCNgV4mFOER2qfCvh9lBT7TodscWywmGOSYrcUH6yWgqufIFakFFHlWzqhD3zTCZKnmzMNVTCBXEwKraSBefhOW0gfukMvihsaQrgn3G0x6A9ZhKr0Q2Ompafc6w-ZblW8ET20Mp3cRVm7jQHB')" }}
      />
      
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-4 sticky top-0 z-40 bg-gradient-to-b from-surface/80 to-surface/0 backdrop-blur-[2px]">
        <div className="relative">
          <div 
            className="flex items-center gap-1 cursor-pointer bg-surface/40 hover:bg-surface/60 rounded-xl px-2 py-1 backdrop-blur-md transition-colors"
            onClick={() => setIsHomeDropdownOpen(!isHomeDropdownOpen)}
          >
            <span className="text-[20px] font-bold text-on-surface shrink-0">{currentHome}</span>
            <ChevronDown className={`text-primary transition-transform duration-300 ${isHomeDropdownOpen ? 'rotate-180' : ''}`} size={20} />
          </div>
          
          {isHomeDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              {['张阿姨家', '王奶奶家'].map(home => (
                <div 
                  key={home}
                  className={`px-4 py-3 text-[15px] font-medium cursor-pointer hover:bg-surface-container transition-colors ${currentHome === home ? 'text-primary' : 'text-on-surface'}`}
                  onClick={() => {
                    setCurrentHome(home);
                    setIsHomeDropdownOpen(false);
                    showToast(`已切换至${home}`);
                  }}
                >
                  {home}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (onNavigate) {
                onNavigate('messages');
              } else {
                showToast("打开消息中心");
              }
            }}
            className="relative p-2 rounded-full bg-surface/40 hover:bg-surface/60 backdrop-blur-md transition-colors"
          >
            <MessageCircle className="text-on-surface-variant" size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface shrink-0"></span>
          </button>
          <div 
            onClick={() => showToast("打开个人设置")}
            className="w-10 h-10 rounded-full overflow-hidden border-[2.5px] border-surface shadow-sm cursor-pointer hover:scale-95 transition-transform shrink-0"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFg42TD8dUbiUKcsQaYh5oYQOSXYLWSxW6lQUicJq9KFXNgiuhzGWu3mGiHfm23YGIEvUDJfv3bYw9Og8CsQDCthkcu4S6kkZIOiRXdjD2_0SN_uITULWNcf_0C50wGZTHaO0E3tU4i_NUMTSCnO5BSVqODoKHn5NMeZVN8c7V6a3pFHIgzuMnkpe0FW8j7WFXApCAcVHIQJT3nQ6kKp7DIu2EFgyBvNb6zWrmZQ7wOq2oyBYLvtw16j3o1uxhgHlH56C6tuUkasvT" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="px-5 flex flex-col gap-8 relative z-10 pt-2">
        {/* Greeting Section */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-on-surface-variant bg-surface/40 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
            <CloudSun className="text-tertiary-container" size={18} fill="currentColor" />
            <span>18°C 晴转多云</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant mx-0.5"></span>
            <span>5月20日 周二</span>
          </div>
          <h1 className="text-[32px] font-display font-bold text-on-surface tracking-tight leading-[1.2] mt-2">
            早上好，今天<br/>家中状态平稳
          </h1>
        </section>

        {/* Bento Board Overview */}
        <section className="glass-panel rounded-[24px] p-5 shadow-soft-card">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary-container/40 text-secondary flex justify-center items-center">
                <ShieldCheck size={16} strokeWidth={2.5} />
              </div>
              <h2 className="text-[18px] font-bold text-on-surface">今日家庭状态总览</h2>
            </div>
            <ChevronRight className="text-outline cursor-pointer" size={20} />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Safety */}
            <div onClick={() => showToast("查看安防详细状态")} className="flex flex-col items-center p-3 bg-surface-container-lowest/80 rounded-2xl shadow-sm text-center cursor-pointer hover:bg-surface-container-lowest active:scale-95 transition-all">
              <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.5" />
                  <path className="text-secondary stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="92, 100" strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <Shield className="text-secondary" size={20} fill="currentColor" />
              </div>
              <span className="text-[12px] text-on-surface-variant">安全状态</span>
              <span className="text-[14px] font-bold text-secondary mt-0.5">正常</span>
              <span className="text-[10px] text-outline mt-1 leading-tight">一切安全</span>
            </div>

             {/* Comfort */}
             <div onClick={() => showToast("查看温湿度详情")} className="flex flex-col items-center p-3 bg-surface-container-lowest/80 rounded-2xl shadow-sm text-center cursor-pointer hover:bg-surface-container-lowest active:scale-95 transition-all">
              <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.5" />
                  <path className="text-secondary-fixed-dim stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <Leaf className="text-secondary-fixed-dim" size={20} fill="currentColor" />
              </div>
              <span className="text-[12px] text-on-surface-variant">舒适状态</span>
              <span className="text-[14px] font-bold text-secondary-fixed-dim mt-0.5">良好</span>
              <span className="text-[10px] text-outline mt-1 leading-tight">温湿适宜</span>
            </div>

            {/* Energy */}
            <div onClick={() => showToast("查看用电报告")} className="flex flex-col items-center p-3 bg-surface-container-lowest/80 rounded-2xl shadow-sm text-center cursor-pointer hover:bg-surface-container-lowest active:scale-95 transition-all">
              <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.5" />
                  <path className="text-tertiary-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3.5" />
                </svg>
                <Zap className="text-tertiary-container" size={20} fill="currentColor" />
              </div>
              <span className="text-[12px] text-on-surface-variant">能耗状态</span>
              <span className="text-[14px] font-bold text-tertiary-container mt-0.5">偏高</span>
              <span className="text-[10px] text-outline mt-1 leading-tight">今日用电较多</span>
            </div>
          </div>
        </section>

        {/* AI Reminders */}
        <section className="bg-surface-container-lowest rounded-[24px] p-5 shadow-soft-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary-fixed/40 rounded-br-full blur-3xl -z-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative shrink-0">
                <CuteAIAvatar className="w-full h-full drop-shadow-sm" />
                <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-primary-fixed rounded-full flex items-center justify-center border-2 border-white">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-[18px] font-bold flex items-center gap-1.5">
                AI管家主动提醒
                <Sparkles className="text-primary" size={18} />
              </h2>
            </div>
            <div className="flex items-center text-[14px] cursor-pointer text-on-surface-variant font-medium hover:text-primary transition-colors">
              <span className="text-error mr-1">{reminders.length}</span> 条待处理
              <ChevronRight size={18} />
            </div>
          </div>

          <div className="flex flex-col relative z-10 text-[14px]">
            {reminders.length === 0 ? (
              <div className="py-8 text-center text-on-surface-variant font-medium">一切正常，暂无待处理提醒</div>
            ) : (
              reminders.map((reminder, idx) => (
                <div 
                  key={reminder.id}
                  onClick={() => {
                    setReminders(prev => prev.filter(r => r.id !== reminder.id));
                    showToast("已处理提醒项");
                  }}
                  className={`flex items-start gap-4 py-3.5 cursor-pointer active:bg-surface-variant/30 px-1 -mx-1 rounded-lg transition-colors ${idx !== reminders.length - 1 ? 'border-b border-surface-variant/70' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getReminderClass(reminder.type)}`}>
                    {getReminderIcon(reminder.type)}
                  </div>
                  <div className="flex-1 flex justify-between gap-3">
                    <p className="text-on-surface leading-snug font-medium">{reminder.title}</p>
                    <span className="text-[12px] text-outline shrink-0 mt-0.5">{reminder.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button 
              onClick={handleOptimize}
              disabled={isOptimizing || reminders.length === 0}
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(237,142,79,0.3)] active:scale-95 transition-all ${
                isOptimizing ? 'bg-surface-variant text-on-surface-variant shadow-none w-[116px] justify-center' : 
                reminders.length === 0 ? 'bg-surface-container text-outline shadow-none cursor-not-allowed' : 
                'bg-gradient-to-r from-tertiary-container to-tertiary text-white'
              }`}
            >
              {isOptimizing ? (
                <div className="w-4 h-4 border-[2px] border-on-surface-variant/30 border-t-on-surface-variant rounded-full animate-spin shrink-0"></div>
              ) : (
                <Sparkles size={16} />
              )}
              {isOptimizing ? '正在优化' : '一键优化'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
