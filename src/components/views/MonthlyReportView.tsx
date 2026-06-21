import React from 'react';
import { ArrowLeft, BarChart2, TrendingUp, CheckCircle, Clock, ShieldCheck, Activity } from 'lucide-react';

export default function MonthlyReportView({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-8 duration-300 overflow-y-auto">
      <header className="flex items-center px-5 py-4 bg-background/90 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/20">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold text-on-surface ml-1">安心月报</h1>
      </header>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Top Summary */}
        <div className="bg-primary text-white rounded-[24px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <BarChart2 size={120} />
          </div>
          <div className="relative z-10">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[12px] font-bold tracking-wider mb-4 inline-block">2026年10月</span>
            <h2 className="text-[24px] font-bold leading-tight mb-1">张阿姨的<br/>本月守护报告</h2>
            <p className="text-primary-container text-[14px] mt-2">本月整体状况优良，生活规律平稳</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-[20px] p-4 flex flex-col border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <ShieldCheck size={18} className="text-secondary" />
              <span className="text-[13px] font-bold">安心评分</span>
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-[28px] font-display font-bold text-on-surface">96</span>
              <span className="text-[12px] text-outline">分</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-[20px] p-4 flex flex-col border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <CheckCircle size={18} className="text-primary" />
              <span className="text-[13px] font-bold">设备在线率</span>
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-[28px] font-display font-bold text-on-surface">100</span>
              <span className="text-[12px] text-outline">%</span>
            </div>
          </div>
        </div>

        {/* Life Patterns */}
        <div className="bg-surface-container-lowest rounded-[20px] p-5 border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-tertiary" />
            <h3 className="text-[16px] font-bold text-on-surface">生活作息分析</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-on-surface-variant">平均入睡时间</span>
                <span className="font-bold text-on-surface">22:15</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
                <div className="h-full bg-tertiary w-[80%] rounded-full"></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-on-surface-variant">平均起床时间</span>
                <span className="font-bold text-on-surface">06:40</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
                <div className="h-full bg-tertiary-container w-[70%] rounded-full"></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-on-surface-variant">夜间活动频次</span>
                <span className="font-bold text-secondary">低且规律</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-primary-container/30 rounded-[20px] p-5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={20} className="text-primary" />
            <h3 className="text-[16px] font-bold text-on-surface">AI 管家洞察</h3>
          </div>
          <p className="text-[14px] text-on-surface-variant leading-relaxed">
            与上月相比，张阿姨的作息时间更加规律，睡眠质量有所提升。建议继续保持，并在即将到来的降温季节提醒注意保暖。
          </p>
        </div>
      </div>
    </div>
  );
}
