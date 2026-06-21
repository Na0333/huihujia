import React from 'react';
import { ArrowLeft, User, Phone, Tag, ShieldAlert } from 'lucide-react';

export default function EmergencyContactView({ 
  onBack,
  familyMembers,
  onSetEmergency
}: { 
  onBack: () => void,
  familyMembers: any[],
  onSetEmergency?: (memberId: number) => void
}) {
  const emergencyContact = familyMembers.find(m => m.isEmergency) || familyMembers[0];

  return (
    <div className="absolute inset-0 z-[100] bg-surface flex flex-col animate-in slide-in-from-right-8 duration-300 overflow-y-auto">
      <header className="flex items-center px-5 py-4 bg-surface/90 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/20">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold text-on-surface ml-1">紧急联系人设置</h1>
      </header>

      <div className="px-5 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 bg-error-container/30 border border-error/20 p-4 rounded-xl text-error">
          <ShieldAlert size={28} className="shrink-0" />
          <p className="text-[13px] leading-snug font-medium">当家中设备检测到异常报警或健康异常时，系统将自动联系紧急联系人。</p>
        </div>

        {emergencyContact ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-[14px] font-bold text-on-surface-variant px-1 border-b border-outline-variant/20 pb-2">当前紧急联系人</h2>
            
            <div className="bg-surface-container-lowest p-5 rounded-[20px] shadow-sm border border-outline-variant/30 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-error"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-error-container/20 text-error rounded-full flex items-center justify-center text-[20px] font-bold overflow-hidden">
                  {emergencyContact.avatar ? (
                    <img src={emergencyContact.avatar} alt={emergencyContact.name} className="w-full h-full object-cover" />
                  ) : (
                    emergencyContact.name.substring(0, 1)
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[18px] font-bold text-on-surface">{emergencyContact.name}</span>
                    <span className="bg-surface-container text-on-surface-variant text-[11px] px-2 py-0.5 rounded font-medium">
                      {emergencyContact.relation}
                    </span>
                  </div>
                  <span className="text-[14px] text-outline font-medium tracking-wide">
                    {emergencyContact.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </span>
                </div>
              </div>
              
              <div className="h-px w-full bg-outline-variant/20"></div>
              
              <button className="text-primary font-bold text-[14px] py-1 text-center active:opacity-70">
                更改紧急联系人
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-[14px] font-bold text-on-surface-variant px-1 border-b border-outline-variant/20 pb-2">备用联系人</h2>
          
          <div className="flex flex-col gap-3">
            {familyMembers.filter(m => !m.isEmergency).map((member, idx) => (
              <div key={idx} className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-[16px] border border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-container/20 text-primary rounded-full flex items-center justify-center font-bold overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.substring(0, 1)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-on-surface">{member.name}</span>
                    <span className="text-[12px] text-outline">{member.relation}</span>
                  </div>
                </div>
                <button 
                  className="text-[13px] text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full font-bold active:bg-surface-variant transition-colors"
                  onClick={() => onSetEmergency && onSetEmergency(member.id)}
                >
                  设为紧急
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
