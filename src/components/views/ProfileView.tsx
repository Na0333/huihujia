import React, { useState } from 'react';
import { MapPin, ShieldCheck, BarChart2, ClipboardPlus, PlusCircle, Edit2, MonitorSmartphone, LifeBuoy, HelpCircle, ChevronRight, Moon, Sun, Users } from 'lucide-react';
import MonthlyReportView from './MonthlyReportView';
import HealthRecordView from './HealthRecordView';
import FamilyMemberModal from './FamilyMemberModal';
import DeviceManagerView from './DeviceManagerView';
import EmergencyContactView from './EmergencyContactView';
import { FamilyMember, useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function ProfileView({ onLogout }: { onLogout?: () => void }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [activeOverlay, setActiveOverlay] = useState<null | 'monthly_report' | 'health_record' | 'family_member' | 'devices' | 'emergency_contact'>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const [familyMembers, setFamilyMembers] = useFamilyMembers();

  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const openFamilyModal = (member?: FamilyMember) => {
    setEditingMember(member || null);
    setActiveOverlay('family_member');
  };

  const saveMember = (member: FamilyMember) => {
    if (editingMember) {
      setFamilyMembers(prev => prev.map(item => item.id === member.id ? member : {
        ...item,
        isEmergency: member.isEmergency ? false : item.isEmergency,
      }));
      showToast("联系人信息已保存");
    } else {
      setFamilyMembers(prev => [
        ...prev.map(item => member.isEmergency ? { ...item, isEmergency: false } : item),
        member,
      ]);
      showToast("联系人已添加");
    }

    setActiveOverlay(null);
    setEditingMember(null);
  };

  const deleteMember = (memberId: number) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    setActiveOverlay(null);
    setEditingMember(null);
    showToast("联系人已删除");
  };

  const setEmergencyContact = (memberId: number) => {
    setFamilyMembers(prev => prev.map(member => ({
      ...member,
      isEmergency: member.id === memberId,
    })));
    showToast("紧急联系人已更新");
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      showToast('已切换为白天模式');
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      showToast('已切换为护眼黑夜模式');
    }
  };

  if (activeOverlay === 'monthly_report') {
    return <MonthlyReportView onBack={() => setActiveOverlay(null)} />;
  }

  if (activeOverlay === 'health_record') {
    return <HealthRecordView onBack={() => setActiveOverlay(null)} />;
  }

  if (activeOverlay === 'devices') {
    return <DeviceManagerView onBack={() => setActiveOverlay(null)} />;
  }

  if (activeOverlay === 'emergency_contact') {
    return (
      <EmergencyContactView
        onBack={() => setActiveOverlay(null)}
        familyMembers={familyMembers}
        onSetEmergency={setEmergencyContact}
      />
    );
  }

  if (activeOverlay === 'family_member') {
    return (
      <FamilyMemberModal
        onClose={() => {
          setActiveOverlay(null);
          setEditingMember(null);
        }}
        memberInfo={editingMember}
        onSave={saveMember}
        onDelete={deleteMember}
      />
    );
  }

  return (
    <div className="flex flex-col w-full h-full pb-8 bg-background relative overflow-y-auto hide-scrollbar pt-5">

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-5 py-2.5 rounded-full text-[14px] font-medium shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 whitespace-nowrap">
          {toastMessage}
        </div>
      )}

      {/* Header hidden on mobile per screenshot design, replaced by MapPin header */}
      <header className="flex justify-center items-center px-5 py-2 mb-4 relative">
         <div className="absolute left-5 text-primary flex items-center justify-center p-2 rounded-full hover:bg-surface-container/50 cursor-pointer">
           <MapPin size={24} strokeWidth={2.5}/>
         </div>
         <h1 className="text-[20px] font-bold text-on-surface">张阿姨家</h1>
         {/* Small avatar top right mimicking standard nav, though usually hidden if big avatar below */}
         <div className="absolute right-5 w-9 h-9 rounded-full overflow-hidden border-2 border-surface shadow-sm cursor-pointer hover:bg-surface-container">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFg42TD8dUbiUKcsQaYh5oYQOSXYLWSxW6lQUicJq9KFXNgiuhzGWu3mGiHfm23YGIEvUDJfv3bYw9Og8CsQDCthkcu4S6kkZIOiRXdjD2_0SN_uITULWNcf_0C50wGZTHaO0E3tU4i_NUMTSCnO5BSVqODoKHn5NMeZVN8c7V6a3pFHIgzuMnkpe0FW8j7WFXApCAcVHIQJT3nQ6kKp7DIu2EFgyBvNb6zWrmZQ7wOq2oyBYLvtw16j3o1uxhgHlH56C6tuUkasvT" className="w-full h-full object-cover" alt="Profile" />
         </div>
      </header>

      <main className="px-5 flex flex-col gap-8">
         {/* Profile summary block */}
         <section className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-sm shrink-0 bg-surface-container-high">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPJYRepo9f5a89-ITcnOzsg90VFIkdPr0iTGdrwVtSNqzSPuHkk4ayEtygfxNl1nqvqiOuaXfgybfxOZ8ZbQnGcNyaJDd5YBfTgGVheL3Xet9Fr-j6rNzNJWFqImPciNL1-G6SdDnJWQhX31etYSnITGDcQCtHnGnfYcYelAwaGCLT9AtoPlnY7mxw3AqtypBKhWOrWARYEOS3sGCXutSwkrPqKobGxj3HG57ic_vE7IYbeHySVG5EsmDzpmLAe-3OXlsUW4Y13njS" className="w-full h-full object-cover" alt="Profile" />
            </div>
            <div className="flex flex-col gap-2">
               <h2 className="text-[28px] font-display font-bold text-on-surface">张阿姨</h2>
               <div className="inline-flex items-center gap-1.5 bg-secondary-container/40 text-on-secondary-container px-3 py-1.5 rounded-full w-max shadow-sm border border-secondary/10">
                 <ShieldCheck size={16} strokeWidth={2.5}/>
                 <span className="text-[13px] font-bold tracking-wide">正在守护中</span>
               </div>
            </div>
         </section>

         {/* My Care Section */}
         <section className="flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-on-surface-variant px-1">我的照护</h3>
            <div className="grid grid-cols-2 gap-4">
               <button 
                  onClick={() => setActiveOverlay('monthly_report')}
                  className="bg-surface-container-lowest rounded-[20px] p-4 flex flex-col items-start shadow-soft-card active:scale-[0.98] transition-transform border border-outline-variant/20 min-h-[110px] justify-between cursor-pointer"
               >
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-2 shadow-sm border border-primary/10">
                     <BarChart2 size={24} strokeWidth={2.5} />
                  </div>
                  <div className="text-left w-full">
                     <div className="text-[16px] font-bold text-on-surface">安心月报</div>
                     <div className="text-[12px] text-outline font-medium mt-1 truncate">11月报告已生成</div>
                  </div>
               </button>
               
               <button 
                  onClick={() => setActiveOverlay('health_record')}
                  className="bg-surface-container-lowest rounded-[20px] p-4 flex flex-col items-start shadow-soft-card active:scale-[0.98] transition-transform border border-outline-variant/20 min-h-[110px] justify-between cursor-pointer"
               >
                  <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-2 shadow-sm border border-secondary/10">
                     <ClipboardPlus size={24} strokeWidth={2.5} />
                  </div>
                  <div className="text-left w-full">
                     <div className="text-[16px] font-bold text-on-surface">健康档案</div>
                     <div className="text-[12px] text-outline font-medium mt-1 truncate">体检数据与病史</div>
                  </div>
               </button>
            </div>
         </section>

         {/* Family Connection */}
         <section className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
               <h3 className="text-[18px] font-bold text-on-surface-variant">亲情互联</h3>
               <button onClick={() => openFamilyModal()} className="text-primary text-[15px] font-bold flex items-center gap-1 active:opacity-70 transition-opacity cursor-pointer">
                 <PlusCircle size={18} strokeWidth={2.5} />
                 添加家人
               </button>
            </div>

            <div className="bg-surface-container-lowest rounded-[20px] shadow-soft-card overflow-hidden border border-outline-variant/20">
               {familyMembers.length > 0 ? (
                 familyMembers.map((member, idx) => (
                   <div key={member.id} className={`flex items-center justify-between p-4 px-5 active:bg-surface-container-low transition-colors cursor-pointer ${idx !== familyMembers.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[18px] shadow-sm ${member.isEmergency ? 'bg-tertiary-fixed text-tertiary' : 'bg-primary-fixed-dim/40 text-primary'}`}>
                            {member.name.substring(0, 1)}
                         </div>
                         <div className="flex flex-col gap-0.5">
                            <span className="text-[16px] font-bold text-on-surface">{member.relation.split('/')[1] || member.relation} {member.name}</span>
                            <span className="text-[13px] font-medium text-outline">{member.relation.split('/')[0]}</span>
                         </div>
                      </div>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          openFamilyModal(member); 
                        }}
                        aria-label={`编辑${member.name}的信息`}
                        className="text-outline min-w-11 min-h-11 p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95 cursor-pointer flex items-center justify-center"
                      >
                         <Edit2 size={20} strokeWidth={2.5} />
                      </button>
                   </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed/60 text-primary flex items-center justify-center">
                       <Users size={24} />
                    </div>
                    <div>
                       <p className="text-[15px] font-bold text-on-surface">还没有添加家人</p>
                       <p className="text-[13px] text-outline mt-1">添加后可共享照护信息与紧急提醒</p>
                    </div>
                    <button
                      onClick={() => openFamilyModal()}
                      className="min-h-11 px-4 rounded-full bg-primary text-on-primary text-[14px] font-bold active:scale-[0.98] transition-transform"
                    >
                      添加家人
                    </button>
                 </div>
               )}
            </div>
         </section>

         {/* Settings & Help */}
         <section className="flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-on-surface-variant px-1">设置与帮助</h3>
            
            <div className="bg-surface-container-lowest rounded-[20px] shadow-soft-card overflow-hidden border border-outline-variant/20">
               <MenuButton onClick={() => setActiveOverlay('devices')} icon={<MonitorSmartphone size={24} />} title="设备管理" />
               <MenuButton onClick={() => setActiveOverlay('emergency_contact')} icon={<LifeBuoy size={24} />} title="紧急联系人设置" iconBg="bg-error-container/40 text-error" />
               <MenuButton onClick={toggleDarkMode} icon={isDarkMode ? <Sun size={24} /> : <Moon size={24} />} title={isDarkMode ? "切换为白天模式" : "切换为护眼黑夜模式"} />
               <MenuButton onClick={() => showToast("打开帮助与反馈...")} icon={<HelpCircle size={24} />} title="帮助与反馈" isLast />
            </div>

            <button 
               onClick={() => {
                 if (onLogout) {
                   onLogout();
                 } else {
                   showToast("退出登录");
                 }
               }} 
               className="mt-6 w-full bg-surface-container/80 text-on-surface-variant font-bold text-[16px] py-4 rounded-[20px] active:scale-[0.98] transition-transform cursor-pointer"
            >
               退出登录
            </button>
         </section>
      </main>
    </div>
  );
}

function MenuButton({ icon, title, isLast = false, iconBg = "bg-surface-container text-on-surface-variant", onClick }: { icon: React.ReactNode, title: string, isLast?: boolean, iconBg?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between py-4 px-5 active:bg-surface-container-low transition-colors cursor-pointer ${!isLast ? 'border-b border-outline-variant/20' : ''}`}>
       <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
             {icon}
          </div>
          <span className="text-[16px] font-bold text-on-surface tracking-wide">{title}</span>
       </div>
       <ChevronRight size={20} className="text-outline mr-0.5" />
    </button>
  );
}
