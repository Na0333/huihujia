import React from 'react';
import { ArrowLeft, Stethoscope, HeartPulse, Activity, FileText } from 'lucide-react';

export default function HealthRecordView({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-8 duration-300 overflow-y-auto">
      <header className="flex items-center px-5 py-4 bg-background/90 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/20">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold text-on-surface ml-1">健康档案</h1>
      </header>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Profile Basic Info */}
        <div className="flex items-center gap-4 bg-surface-container-lowest p-5 rounded-[20px] border border-outline-variant/20">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPJYRepo9f5a89-ITcnOzsg90VFIkdPr0iTGdrwVtSNqzSPuHkk4ayEtygfxNl1nqvqiOuaXfgybfxOZ8ZbQnGcNyaJDd5YBfTgGVheL3Xet9Fr-j6rNzNJWFqImPciNL1-G6SdDnJWQhX31etYSnITGDcQCtHnGnfYcYelAwaGCLT9AtoPlnY7mxw3AqtypBKhWOrWARYEOS3sGCXutSwkrPqKobGxj3HG57ic_vE7IYbeHySVG5EsmDzpmLAe-3OXlsUW4Y13njS" className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-on-surface mb-1">张阿姨</h2>
            <div className="flex gap-3 text-[13px] text-on-surface-variant font-medium">
              <span>女</span>
              <span>72岁</span>
              <span>血型: O型</span>
            </div>
          </div>
        </div>

        {/* Vital Signs (Static Data) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-error-container/20 rounded-[20px] p-4 flex flex-col border border-error/10">
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse size={18} className="text-error" />
              <span className="text-[13px] font-bold text-on-surface-variant">近期心率 (静息)</span>
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-[24px] font-display font-bold text-on-surface">68</span>
              <span className="text-[12px] text-outline">bpm</span>
            </div>
          </div>

          <div className="bg-primary-container/20 rounded-[20px] p-4 flex flex-col border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-primary" />
              <span className="text-[13px] font-bold text-on-surface-variant">血压 (最近)</span>
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-[24px] font-display font-bold text-on-surface">120/75</span>
              <span className="text-[12px] text-outline">mmHg</span>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-surface-container-lowest rounded-[20px] p-5 border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant/10">
            <Stethoscope size={20} className="text-secondary" />
            <h3 className="text-[16px] font-bold text-on-surface">既往病史</h3>
          </div>
          <ul className="flex flex-col gap-3">
            <li className="text-[14px] text-on-surface-variant flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary before:rounded-full before:mr-3">轻度高血压 (已控制)</li>
            <li className="text-[14px] text-on-surface-variant flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary before:rounded-full before:mr-3">骨质疏松与关节劳损</li>
          </ul>
        </div>

        {/* Recent Exams or Reports */}
        <div className="bg-surface-container-lowest rounded-[20px] p-5 border border-outline-variant/20 mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/10">
             <div className="flex items-center gap-2">
               <FileText size={20} className="text-tertiary" />
               <h3 className="text-[16px] font-bold text-on-surface">体检报告夹</h3>
             </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low active:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                   <FileText size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-on-surface">2026年年度常规体检</span>
                  <span className="text-[12px] text-outline">市立第三医院 • 2026-05-12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
