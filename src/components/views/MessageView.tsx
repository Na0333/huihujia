import React, { useState } from 'react';
import { ArrowLeft, Bell, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function MessageView({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'warning',
      title: '设备离线提醒',
      content: '客厅摄像头已离线超过 30 分钟，请检查网络连接状态。',
      time: '10 分钟前',
      isRead: false,
    },
    {
      id: 2,
      type: 'system',
      title: '系统更新成功',
      content: '慧护家已成功更新至最新版本，为您提供更稳定的照护体验。',
      time: '2 小时前',
      isRead: false,
    },
    {
      id: 3,
      type: 'saftey',
      title: '每日夜间安防报告',
      content: '昨夜（22:00-06:00）全屋设备运行正常，无异常活动记录。',
      time: '今天 08:00',
      isRead: true,
    },
    {
      id: 4,
      type: 'info',
      title: '关怀提示',
      content: '今天天气转凉，记得提醒张阿姨添加衣物。',
      time: '昨天 15:30',
      isRead: true,
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={20} className="text-error" />;
      case 'system': return <Bell size={20} className="text-secondary" />;
      case 'saftey': return <ShieldCheck size={20} className="text-primary" />;
      default: return <Info size={20} className="text-tertiary-container" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-error-container/50';
      case 'system': return 'bg-secondary-container/50';
      case 'saftey': return 'bg-primary-container/30';
      default: return 'bg-tertiary-container/30';
    }
  };

  const markAllAsRead = () => {
    setMessages(messages.map(m => ({ ...m, isRead: true })));
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="flex flex-col h-full bg-surface relative z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-surface/90 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
             className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[20px] font-bold text-on-surface">消息中心</h1>
        </div>
        {unreadCount > 0 && (
          <button 
             onClick={markAllAsRead}
             className="text-[14px] font-bold text-primary active:opacity-70 transition-opacity"
          >
            全部已读
          </button>
        )}
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-outline">
             <Bell size={48} className="mb-4 opacity-50" />
             <p className="font-medium text-[15px]">暂无新消息</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`p-4 rounded-[20px] flex gap-4 transition-all relative overflow-hidden ${
                msg.isRead ? 'bg-surface-container-lowest border border-outline-variant/10' : 'bg-surface-container-lowest border border-primary/20 shadow-sm'
              }`}
            >
              {!msg.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )}
              
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconBg(msg.type)}`}>
                {getIcon(msg.type)}
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-[16px] leading-tight ${msg.isRead ? 'font-medium text-on-surface-variant' : 'font-bold text-on-surface'}`}>
                    {msg.title}
                  </h3>
                  <span className="text-[12px] text-outline shrink-0 mt-0.5">{msg.time}</span>
                </div>
                <p className={`text-[14px] leading-snug mt-1 ${msg.isRead ? 'text-outline' : 'text-on-surface-variant'}`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
