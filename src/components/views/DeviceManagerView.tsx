import React from 'react';
import { ArrowLeft, Smartphone, Watch, Plus } from 'lucide-react';

export default function DeviceManagerView({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-8 duration-300 overflow-y-auto">
      <header className="flex items-center px-5 py-4 bg-background/90 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/20">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[20px] font-bold text-on-surface ml-1">设备管理</h1>
      </header>

      <div className="px-5 py-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-bold text-on-surface-variant px-1 border-b border-outline-variant/20 pb-2">已添加的移动设备</h2>
          
          {/* iOS Device */}
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-[20px] shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl text-on-surface">
                <Smartphone size={24} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-on-surface">iPhone 15 Pro</span>
                <span className="text-[12px] text-outline">小慧的手机 (当前设备)</span>
              </div>
            </div>
            <span className="text-[12px] bg-secondary-container/30 text-secondary px-2 py-1 rounded font-bold">在线</span>
          </div>

          {/* Android Device */}
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-[20px] shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl text-on-surface">
                <Smartphone size={24} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-on-surface">HUAWEI Mate 60</span>
                <span className="text-[12px] text-outline">儿子的手机</span>
              </div>
            </div>
            <span className="text-[12px] bg-outline-variant/30 text-on-surface-variant px-2 py-1 rounded font-bold">离线</span>
          </div>

          {/* Wearable */}
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-[20px] shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center rounded-2xl text-primary">
                <Watch size={24} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-on-surface">健康监测手环</span>
                <span className="text-[12px] text-outline">张阿姨佩戴中</span>
              </div>
            </div>
            <span className="text-[12px] bg-secondary-container/30 text-secondary px-2 py-1 rounded font-bold">在线 • 电量 78%</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-[20px] text-primary font-bold active:bg-surface-container-low transition-colors">
          <Plus size={20} />
          添加新设备
        </button>
      </div>
    </div>
  );
}
