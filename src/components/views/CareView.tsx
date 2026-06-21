import React, { useState } from 'react';
import { MapPin, ChevronRight, Shield, Clock, Wind, Plug, Lightbulb, Flame, Moon, Lamp, Sparkles, Phone, Video, Headphones, BellRing, Thermometer } from 'lucide-react';
import { CuteAIAvatar } from '../CuteAIAvatar';

export default function CareView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isIndexExpanded, setIsIndexExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [careModeStatus, setCareModeStatus] = useState<null | 'on' | 'later'>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-8 relative">
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-5 py-2.5 rounded-full text-[14px] font-medium shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative px-5 pt-5 pb-10 mb-2">
        <div 
          className="absolute inset-0 bg-cover bg-center h-[320px] -z-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface"></div>
        </div>

        <header className="flex items-center justify-center relative mb-6">
           <MapPin className="text-primary absolute left-0" size={24} fill="currentColor" />
           <h1 className="text-[20px] font-bold text-on-surface">张阿姨家</h1>
        </header>

        <div className="relative z-10">
          <h2 className="text-[32px] font-display font-bold text-on-surface mb-2">家人关怀</h2>
          <p className="text-[16px] text-on-surface-variant font-medium mb-6">让关爱随时随地，守护家人每一天</p>
          
          {/* Main Profile & Status Card */}
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-[28px] p-5 shadow-soft-card flex flex-col md:flex-row gap-5 border border-white/50">
            {/* Left Profile Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative shrink-0">
                 <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover"/>
                 </div>
                 <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-outline-variant/10">
                    <HeartIconFilled />
                 </div>
              </div>
              <div className="flex flex-col gap-1.5">
                 <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[20px] font-bold text-on-surface">张阿姨</span>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[11px] px-2.5 py-0.5 rounded-full font-bold">妈妈</span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed text-[11px] px-2.5 py-0.5 rounded-full font-bold">独居中</span>
                 </div>
                 <div className="flex items-center text-[13px] font-medium text-on-surface-variant">
                    <MapPin size={14} className="mr-1" />
                    慧护家小区 3-1-1201
                 </div>
              </div>
            </div>

            {/* Right Peace of Mind Index */}
            <div 
               onClick={() => setIsIndexExpanded(!isIndexExpanded)}
               className={`bg-surface-container-low/70 rounded-2xl p-3 pr-4 flex flex-col gap-4 border border-outline-variant/20 cursor-pointer transition-all overflow-hidden ${isIndexExpanded ? 'w-full md:w-auto h-auto' : ''}`}
            >
               <div className="flex items-center justify-between gap-4 w-full">
                 <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                       <path className="text-surface-variant stroke-current" d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" strokeWidth="4" />
                       <path className="text-secondary stroke-current drop-shadow-sm" style={{ strokeDasharray: '92, 100' }} d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" strokeLinecap="round" strokeWidth="4" />
                    </svg>
                    <span className="absolute text-[18px] font-display font-bold text-secondary">92<span className="text-[10px] font-sans font-medium mix-blend-multiply opacity-80">分</span></span>
                 </div>
                 <div className="flex flex-col relative z-20 flex-1">
                    <span className="text-[14px] font-bold text-on-surface">今日安心指数</span>
                    <span className="text-[12px] text-on-surface-variant mt-0.5 font-medium">今日状态平稳</span>
                 </div>
                 <ChevronRight className={`text-outline transition-transform ${isIndexExpanded ? 'rotate-90' : ''}`} size={18} />
               </div>
               
               {isIndexExpanded && (
                 <div className="flex flex-col gap-3 pt-2 border-t border-outline-variant/20 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center text-[13px]">
                       <span className="text-on-surface-variant">设备在线率</span>
                       <span className="font-bold text-secondary">100%</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                       <span className="text-on-surface-variant">异常报警次数</span>
                       <span className="font-bold text-secondary">0 次</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                       <span className="text-on-surface-variant">生活规律评分</span>
                       <span className="font-bold text-secondary">95 分</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Home Status */}
      <section className="px-5 mb-8">
         <h3 className="text-[18px] font-bold text-on-surface mb-3">今日家庭状态</h3>
         <div className="bg-surface-container-lowest rounded-[24px] p-4 shadow-soft-card grid grid-cols-4 gap-1 divide-x divide-outline-variant/30">
            <StatusIcon icon={<Shield className="text-secondary" size={28} />} title="家中安全" sub="一切正常" cl="text-secondary" />
            <StatusIcon icon={<Clock className="text-primary" size={28} />} title="作息规律" sub="作息良好" cl="text-secondary" />
            <StatusIcon icon={<Wind className="text-primary-container" size={28} />} title="空调运行" sub="温度 25°C" cl="text-secondary" />
            <StatusIcon icon={<Plug className="text-tertiary-container" size={28} />} title="设备安全" sub="无高风险" cl="text-secondary" />
         </div>
      </section>

      {/* Timeline */}
      <section className="px-5 mb-8">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-[18px] font-bold text-on-surface">今日动态时间线</h3>
            <button 
               onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
               className="flex items-center text-[13px] bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full font-bold hover:bg-surface-container-high transition-colors"
            >
               {isTimelineExpanded ? '收起' : '查看全部'} <ChevronRight size={16} className={`ml-1 transition-transform ${isTimelineExpanded ? 'rotate-[-90deg]' : ''}`} />
            </button>
         </div>

         <div className="bg-surface-container-lowest rounded-[24px] p-5 shadow-soft-card pl-6 relative">
            <div className={`absolute left-9 top-6 ${isTimelineExpanded ? 'bottom-2' : 'bottom-6'} w-0.5 bg-surface-variant transition-all`}></div>
            
            <TimelineItem time="07:30" icon={<Lightbulb className="text-tertiary-container" size={18} fill="currentColor" />} text="客厅灯开启" />
            <TimelineItem time="08:00" icon={<Flame className="text-secondary" size={18} />} text="早餐时间，厨房设备短时运行" />
            <TimelineItem time="12:15" icon={<Wind className="text-primary-container" size={18} />} text="空调已自动调节到舒适温度" />
            <TimelineItem time="21:08" icon={<Moon className="text-primary" size={18} fill="currentColor" />} text="起夜灯自动开启" />
            <TimelineItem time="21:20" icon={<Lamp className="text-tertiary" size={18} />} text="卧室灯已关闭" isLast={!isTimelineExpanded} />
            
            {isTimelineExpanded && (
               <div className="animate-in fade-in slide-in-from-top-4 mt-6">
                  <TimelineItem time="22:30" icon={<Clock className="text-on-surface-variant" size={18} />} text="检测到处于深睡状态" />
                  <TimelineItem time="23:15" icon={<Thermometer className="text-primary" size={18} />} text="自动开启夜间保暖模式" isLast />
               </div>
            )}
         </div>
      </section>

      {/* AI Care Suggestions */}
      <section className="px-5 mb-8">
         <div className="glass-panel rounded-[24px] p-5 shadow-soft-card flex items-start gap-4 border border-outline-variant/20">
            <div className="w-16 h-16 shrink-0">
               <CuteAIAvatar className="w-full h-full drop-shadow-md" />
            </div>
            <div className="flex-1">
               <h3 className="text-[18px] font-bold text-on-primary-container mb-3 flex items-center gap-1.5">
                  AI 关怀建议
                  <Sparkles size={18} className="text-primary" />
               </h3>
               <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-2 text-[14px] font-medium text-on-surface-variant leading-snug">
                     <Lightbulb size={16} className="text-primary mt-0.5 shrink-0" /> 
                     <span>根据最近 3 天夜间起夜频率，建议开启持续夜灯守护模式。</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] font-medium text-on-surface-variant leading-snug">
                     <Thermometer size={16} className="text-primary mt-0.5 shrink-0" />
                     <span>今日室外降温较快，建议晚间提前开启保暖模式。</span>
                  </li>
               </ul>
               <div className="flex gap-3">
                  <button 
                     onClick={() => {
                        setCareModeStatus('on');
                        showToast("已开启守护模式");
                     }}
                     disabled={careModeStatus !== null}
                     className={`flex-1 py-2.5 rounded-xl font-bold shadow-sm text-[14px] active:scale-95 transition-all border ${careModeStatus === 'on' ? 'bg-primary text-white border-primary cursor-default active:scale-100' : careModeStatus === 'later' ? 'bg-surface-container text-outline border-outline-variant/30 cursor-not-allowed opacity-50' : 'bg-surface-container-lowest text-primary border-white/50'}`}
                  >
                     {careModeStatus === 'on' ? '已开启' : '开启守护模式'}
                  </button>
                  <button 
                     onClick={() => {
                        setCareModeStatus('later');
                        showToast("稍后再次提醒");
                     }}
                     disabled={careModeStatus !== null}
                     className={`flex-1 py-2.5 rounded-xl font-bold border text-[14px] active:scale-95 transition-all ${careModeStatus === 'later' ? 'bg-primary text-white border-primary cursor-default active:scale-100' : careModeStatus === 'on' ? 'bg-surface-container text-outline border-outline-variant/30 cursor-not-allowed opacity-50' : 'bg-surface-container-lowest/80 text-on-surface-variant border-outline-variant/30'}`}
                  >
                     {careModeStatus === 'later' ? '已设为稍后' : '稍后提醒'}
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Quick Care Operations */}
      <section className="px-5">
         <h3 className="text-[18px] font-bold text-on-surface mb-3">快捷关怀操作</h3>
         <div className="grid grid-cols-4 gap-3">
            <QuickApp onClick={() => showToast("正在呼叫家人...")} icon={<Phone className="text-secondary" size={24} fill="currentColor"/>} label={["一键联系","家人"]} bg="bg-secondary-container/40" />
            <QuickApp onClick={() => showToast("正在发起视频通话...")} icon={<Video className="text-tertiary" size={24} fill="currentColor"/>} label={["一键","视频通话"]} bg="bg-tertiary-container/30" />
            <QuickApp onClick={() => showToast("已开启远程协助")} icon={<Headphones className="text-primary" size={24}/>} label={["远程","协助"]} bg="bg-primary-fixed/60" />
            <QuickApp onClick={() => showToast("提醒已发送")} icon={<BellRing className="text-tertiary-container" size={24} fill="currentColor"/>} label={["发送","提醒"]} bg="bg-tertiary-fixed/60" />
         </div>
      </section>
    </div>
  );
}

function StatusIcon({ icon, title, sub, cl }: { icon: React.ReactNode, title: string, sub: string, cl: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-1 py-1">
      <div className="mb-2.5 opacity-90">{icon}</div>
      <span className="text-[13px] font-bold text-on-surface leading-tight mb-1">{title}</span>
      <span className={`text-[11px] font-medium ${cl}`}>{sub}</span>
    </div>
  );
}

function TimelineItem({ time, icon, text, isLast = false }: { time: string, icon: React.ReactNode, text: string, isLast?: boolean }) {
  return (
     <div className={`relative flex items-center gap-4 ${isLast ? '' : 'mb-6'}`}>
        <div className="absolute -left-[18px] w-3 h-3 rounded-full bg-secondary border-[3px] border-surface-container-lowest outline outline-2 outline-secondary z-10 shrink-0"></div>
        <div className="flex-1 flex flex-col justify-center translate-y-px">
           <div className="flex items-center gap-3">
              <span className="text-[14px] font-display font-bold text-on-surface min-w-[42px]">{time}</span>
              <div className="bg-surface-container-low p-1.5 rounded-full shrink-0 shadow-sm border border-outline-variant/20">{icon}</div>
              <span className="text-[15px] font-medium text-on-surface leading-snug">{text}</span>
           </div>
        </div>
     </div>
  );
}

function QuickApp({ icon, label, bg, onClick }: { icon: React.ReactNode, label: string[], bg: string, onClick?: () => void }) {
  return (
     <button onClick={onClick} className="flex flex-col items-center justify-center bg-surface-container-lowest p-3 rounded-[20px] shadow-sm active:scale-95 transition-transform h-[100px] border border-outline-variant/10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2.5 shrink-0 ${bg}`}>
           {icon}
        </div>
        <span className="text-[12px] font-bold text-on-surface text-center leading-[1.2]">
           {label[0]}<br/>{label[1]}
        </span>
     </button>
  );
}

function HeartIconFilled() {
   return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary-container">
         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
   );
}
