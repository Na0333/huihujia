import React, { useState } from 'react';
import { Sun, Lightbulb, LightbulbOff, Wind, Moon, Footprints, Users, Phone, Shield, ShieldCheck, Lock, ShieldAlert, ChevronRight, Volume2 } from 'lucide-react';
import EmergencyContactView from './EmergencyContactView';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function SimpleModeView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showContacts, setShowContacts] = useState(false);

  const [familyMembers] = useFamilyMembers();

  // Device States
  const [isLight1On, setIsLight1On] = useState(true);
  const [isLight2On, setIsLight2On] = useState(false);
  const [isAcOn, setIsAcOn] = useState(true);
  const [isSleepModeOn, setIsSleepModeOn] = useState(false);
  const [isNightModeOn, setIsNightModeOn] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full pb-6 bg-surface relative overflow-y-auto hide-scrollbar">
      {showContacts && (
        <EmergencyContactView onBack={() => setShowContacts(false)} familyMembers={familyMembers} />
      )}

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-5 py-2.5 rounded-full text-[14px] font-medium shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 whitespace-nowrap">
          {toastMessage}
        </div>
      )}

      {/* Background Gradient/Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center h-[300px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface"></div>
      </div>

      <div className="relative z-10 px-6 pt-10">
        
        {/* Top Info */}
        <header className="flex flex-col gap-2 mb-8 drop-shadow-sm">
           <h1 className="text-[42px] font-display font-bold text-on-surface leading-none tracking-tight">20:36</h1>
           <div className="text-[18px] font-bold text-on-surface mt-2.5">简易模式</div>
           <div className="flex items-center text-[16px] font-medium text-on-surface-variant gap-2 opacity-90">
             <span>20:36</span>
             <Sun className="text-tertiary-container" size={20} fill="currentColor" />
             <span>晴 26°C | 6月18日</span>
           </div>
           
           <div className="flex items-center gap-2 mt-4 text-[18px] font-bold text-tertiary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
              <span>晚上好，请安心休息</span>
           </div>
        </header>

        {/* Big Grid Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <BigButton 
             onClick={() => {
               setIsLight1On(!isLight1On);
               showToast(isLight1On ? "已关闭客厅灯" : "已开启客厅灯");
             }}
             icon={isLight1On ? <Lightbulb size={32} strokeWidth={2.5} /> : <LightbulbOff size={32} strokeWidth={2.5} />} 
             title="客厅灯" 
             sub1="主照明" 
             sub2={isLight1On ? "已开启" : "已关闭"} 
             bg={isLight1On ? "bg-tertiary-fixed-dim/30" : "bg-surface-container-high/60"} 
             iconColor={isLight1On ? "text-tertiary" : "text-outline"}
             borderColor={isLight1On ? "border-tertiary-fixed-dim/50" : "border-outline-variant/30"}
           />
           <BigButton 
             onClick={() => {
               setIsLight2On(!isLight2On);
               showToast(isLight2On ? "已关闭卧室灯" : "已开启卧室灯");
             }}
             icon={isLight2On ? <Lightbulb size={32} strokeWidth={2.5} /> : <LightbulbOff size={32} strokeWidth={2.5} />} 
             title="卧室灯" 
             sub1="当前状态" 
             sub2={isLight2On ? "已开启" : "已关闭"} 
             bg={isLight2On ? "bg-tertiary-fixed-dim/30" : "bg-surface-container-high/60"} 
             iconColor={isLight2On ? "text-tertiary" : "text-outline"}
             borderColor={isLight2On ? "border-tertiary-fixed-dim/50" : "border-outline-variant/30"}
           />
           <BigButton 
             onClick={() => {
               setIsAcOn(!isAcOn);
               showToast(isAcOn ? "已关闭空调" : "已打开空调，26°C");
             }}
             icon={<Wind size={32} strokeWidth={2.5} />} 
             title="空调开关" 
             sub1={isAcOn ? "当前 26°C," : "空调已关闭"} 
             sub2={isAcOn ? "轻点关闭" : "轻点开启"} 
             bg={isAcOn ? "bg-primary-fixed/50" : "bg-surface-container-high/60"} 
             iconColor={isAcOn ? "text-primary" : "text-outline"}
             borderColor={isAcOn ? "border-primary-fixed/60" : "border-outline-variant/30"}
           />
           <BigButton 
             onClick={() => {
               const nextState = !isSleepModeOn;
               setIsSleepModeOn(nextState);
               showToast(nextState ? "已开启睡眠模式" : "已关闭睡眠模式");
             }}
             icon={<Moon size={32} strokeWidth={2.5} />} 
             title="睡眠模式" 
             sub1="自动调暗灯光" 
             sub2={isSleepModeOn ? "处于睡眠状态" : "轻点开启"} 
             bg={isSleepModeOn ? "bg-primary-container/40" : "bg-surface-container-high/60"} 
             iconColor={isSleepModeOn ? "text-primary-container" : "text-outline"}
             borderColor={isSleepModeOn ? "border-primary-container/50" : "border-outline-variant/30"}
           />
           <BigButton 
             onClick={() => {
               const nextState = !isNightModeOn;
               setIsNightModeOn(nextState);
               showToast(nextState ? "已开启起夜模式" : "已关闭起夜模式");
             }}
             icon={<Footprints size={32} strokeWidth={2.5} />} 
             title="起夜模式" 
             sub1="自动走廊灯" 
             sub2={isNightModeOn ? "处于起夜状态" : "轻点开启"} 
             bg={isNightModeOn ? "bg-tertiary-container/30" : "bg-surface-container-high/60"} 
             iconColor={isNightModeOn ? "text-tertiary-container" : "text-outline"}
             borderColor={isNightModeOn ? "border-tertiary-container/40" : "border-outline-variant/30"}
           />
           <BigButton 
             onClick={() => showToast("正在呼叫子女...")}
             icon={<Users size={32} strokeWidth={2.5} />} 
             title="呼叫子女" 
             sub1="一键联系家人" 
             sub2="" 
             bg="bg-secondary-container/40" 
             iconColor="text-secondary"
             borderColor="border-secondary-container/50"
           />
        </div>

        {/* SOS Warning Banner */}
        <button 
           onClick={() => showToast("正在紧急联系家人...")}
           className="w-full bg-error-container/40 rounded-[24px] p-5 flex items-center justify-start gap-5 mb-6 border border-error-container active:scale-95 transition-transform shadow-sm"
        >
           <div className="w-16 h-16 rounded-full bg-error text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldAlert size={36} strokeWidth={2.5} />
           </div>
           <div className="flex flex-col text-left">
             <span className="text-[18px] font-bold text-on-surface mb-1">紧急求助</span>
             <span className="text-[14px] text-on-surface-variant font-medium leading-snug">立即联系家人与<br/>紧急联系人</span>
           </div>
        </button>

        {/* Status Section */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-sm border border-outline-variant/20 overflow-hidden mb-6">
           <div className="bg-surface-container/50 px-5 py-3 flex items-center gap-2 border-b border-outline-variant/20">
              <ShieldCheck className="text-secondary" size={20} />
              <h3 className="text-[16px] font-bold text-on-surface">家中当前状态</h3>
           </div>
           <div className="p-4 grid grid-cols-4 gap-2 divide-x divide-outline-variant/30">
              <StatusCol 
                title="灯光" 
                stat={isLight1On && isLight2On ? "全开启" : (isLight1On || isLight2On ? "部分开启" : "已关闭")} 
                icon={isLight1On || isLight2On ? <Lightbulb size={22} className="text-tertiary" /> : <LightbulbOff size={22} className="text-outline" />} 
                bg={isLight1On || isLight2On ? "bg-tertiary-container/30" : "bg-surface-container/50"} 
                textColor={isLight1On || isLight2On ? "text-tertiary-container" : "text-outline"} 
              />
              <StatusCol 
                title="空调" 
                stat={isAcOn ? "26°C" : "已关闭"} 
                icon={<Wind size={22} className={isAcOn ? "text-primary" : "text-outline"} />} 
                bg={isAcOn ? "bg-primary-container/30" : "bg-surface-container/50"} 
                textColor={isAcOn ? "text-primary" : "text-outline"} 
              />
              <StatusCol 
                title="睡眠" 
                stat={isSleepModeOn ? "睡眠中" : "未开启"} 
                icon={<Moon size={22} className={isSleepModeOn ? "text-secondary" : "text-outline"} />} 
                bg={isSleepModeOn ? "bg-secondary-container/30" : "bg-surface-container/50"} 
                textColor={isSleepModeOn ? "text-secondary" : "text-outline"} 
              />
              <StatusCol 
                title="起夜" 
                stat={isNightModeOn ? "守护中" : "未开启"} 
                icon={<Footprints size={22} className={isNightModeOn ? "text-secondary" : "text-outline"} />} 
                bg={isNightModeOn ? "bg-secondary-container/30" : "bg-surface-container/50"} 
                textColor={isNightModeOn ? "text-secondary" : "text-outline"} 
              />
           </div>
        </div>

        {/* Contacts Section */}
        <div className="glass-panel rounded-[24px] shadow-sm overflow-hidden mb-8">
           <div className="bg-surface-container/30 px-5 py-3 flex justify-between items-center border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <Users className="text-primary" size={20} />
                <h3 className="text-[16px] font-bold text-on-surface">常用联系人</h3>
              </div>
              <button onClick={() => setShowContacts(true)} className="text-[14px] text-outline font-medium flex items-center active:opacity-70 transition-opacity">更多 <ChevronRight size={16}/></button>
           </div>
           
           <div className="p-4 grid grid-cols-2 gap-4">
              {familyMembers.slice(0, 2).map((member) => (
                <ContactCard 
                  key={member.id}
                  onClick={() => showToast(`正在呼叫 ${member.relation.split('/')[1] || member.relation}...`)} 
                  name={member.relation.split('/')[1] || member.relation} 
                  sub={member.name} 
                  avatar={member.avatar}
                />
              ))}
           </div>
        </div>

        {/* Sticky Big SOS Button (Optional extra layer of safety) */}
        <button onClick={() => showToast("正在触发紧急求助！")} className="w-full bg-error-container text-on-error-container rounded-[24px] py-4 shadow-sm active:scale-95 transition-transform flex items-center gap-3 justify-center border border-error/20">
           <div className="bg-error text-white rounded-full p-2 shadow-sm">
              <Phone fill="currentColor" size={28}/>
           </div>
           <span className="text-[20px] font-bold tracking-widest">紧急联系</span>
        </button>
        <div className="text-center mt-3 text-[14px] text-on-surface-variant font-medium opacity-80">点击后将立即通知家人</div>
        
      </div>
    </div>
  );
}

function BigButton({ icon, title, sub1, sub2, bg, iconColor, borderColor, onClick }: any) {
  return (
    <button onClick={onClick} className={`${bg} ${borderColor} border rounded-[28px] p-5 flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-all duration-300 min-h-[160px]`}>
       <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm ${iconColor} transition-colors duration-300`}>
         {icon}
       </div>
       <span className="text-[18px] font-bold text-on-surface mb-1.5">{title}</span>
       <span className="text-[14px] font-medium text-on-surface-variant leading-tight">{sub1}<br/>{sub2}</span>
    </button>
  );
}

function StatusCol({ title, stat, icon, bg, textColor }: any) {
  return (
     <div className="flex flex-col items-center justify-center px-1">
        <div className="mb-2 transition-colors duration-300">{icon}</div>
        <span className="text-[15px] font-bold text-on-surface mb-1.5">{title}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap transition-colors duration-300 ${bg} ${textColor}`}>{stat}</span>
     </div>
  );
}

function ContactCard({ name, sub, avatar, onClick }: any) {
  return (
     <div className="border border-outline-variant/30 rounded-[20px] p-4 glass-panel shadow-sm flex flex-col hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start mb-3">
           <div className="w-14 h-14 rounded-full bg-surface-container-high overflow-hidden shadow-sm">
             <img src={avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"} alt={name} className="w-full h-full object-cover" />
           </div>
           <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
             <Phone size={20} fill="currentColor" />
           </div>
        </div>
        <span className="text-[14px] text-on-surface-variant font-medium">{name}</span>
        <span className="text-[18px] font-bold text-on-surface mb-3">{sub}</span>
        <button onClick={onClick} className="bg-primary/15 text-primary outline outline-1 outline-primary/20 dark:bg-primary dark:text-on-primary dark:outline-none rounded-full py-2.5 w-full text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all">
           <Volume2 size={16} /> 语音联系
        </button>
     </div>
  );
}

