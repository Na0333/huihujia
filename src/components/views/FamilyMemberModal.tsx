import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Tag, AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react';

export default function FamilyMemberModal({ 
  onClose, 
  memberInfo,
  onSave,
  onDelete
}: { 
  onClose: () => void, 
  memberInfo?: any,
  onSave?: (member: any) => void,
  onDelete?: (memberId: number) => void
}) {
  const [name, setName] = useState(memberInfo?.name || '');
  const [phone, setPhone] = useState(memberInfo?.phone || '');
  const [relation, setRelation] = useState(memberInfo?.relation || '');
  const [isEmergency, setIsEmergency] = useState(memberInfo?.isEmergency || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = !!memberInfo;

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...memberInfo,
        id: memberInfo?.id || Date.now(),
        name,
        phone,
        relation,
        isEmergency
      });
    }
  };

  const handleDelete = () => {
    if (onDelete && memberInfo?.id) {
      onDelete(memberInfo.id);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col animate-in slide-in-from-right-8 duration-300">
      <header className="flex items-center justify-between px-5 py-4 bg-surface/90 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/20">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[20px] font-bold text-on-surface ml-1">{isEdit ? '编辑家人信息' : '邀请家人'}</h1>
        </div>
        {/* Header Delete Button - only in edit mode */}
        {isEdit && onDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-error hover:bg-error-container/40 transition-colors active:scale-95"
            aria-label="删除此联系人"
          >
            <Trash2 size={22} />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary text-[28px] font-bold shadow-sm">
            {name ? name.substring(0, 1) : <User size={36} />}
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-[14px] font-bold text-on-surface-variant flex items-center gap-1.5 pl-1">
                <User size={16} /> 姓名/称呼
             </label>
             <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：小明"
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-on-surface"
             />
          </div>

          <div className="flex flex-col gap-1.5">
             <label className="text-[14px] font-bold text-on-surface-variant flex items-center gap-1.5 pl-1">
                <Phone size={16} /> 手机号码
             </label>
             <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="输入 11 位手机号"
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-on-surface"
             />
          </div>

          <div className="flex flex-col gap-1.5">
             <label className="text-[14px] font-bold text-on-surface-variant flex items-center gap-1.5 pl-1">
                <Tag size={16} /> 关系备注
             </label>
             <input 
                type="text" 
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="例如：儿子、女儿、主照护人"
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-on-surface"
             />
          </div>
        </div>

        <div className="h-px w-full bg-outline-variant/20 my-2" />

        {/* Emergency Setting */}
        <div className="flex items-center justify-between bg-error-container/30 border border-error/20 p-4 rounded-xl">
           <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 font-bold text-error">
                <ShieldAlert size={18} /> 设置为紧急联系人
              </span>
              <span className="text-[12px] text-on-surface-variant max-w-[200px]">
                 当发生异常报警时，系统将优先通过电话及短信通知该联系人
              </span>
           </div>
           
           {/* Toggle Switch */}
           <button 
             onClick={() => setIsEmergency(!isEmergency)}
             className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out ${isEmergency ? 'bg-error' : 'bg-surface-variant'}`}
           >
             <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ease-in-out ${isEmergency ? 'translate-x-6' : 'translate-x-[2px]'}`} />
           </button>
        </div>

        {/* Delete Section - only in edit mode */}
        {isEdit && onDelete && (
          <>
            <div className="h-px w-full bg-outline-variant/20 my-2" />
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-error/30 text-error font-bold text-[15px] hover:bg-error-container/20 active:scale-[0.98] transition-all"
            >
              <Trash2 size={18} />
              删除此联系人
            </button>
          </>
        )}
      </div>

      {/* Bottom Action */}
      <div className="p-5 bg-surface border-t border-outline-variant/20 pb-8">
        <button 
           onClick={handleSave}
           className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-[16px] shadow-sm active:scale-[0.98] transition-transform"
        >
          {isEdit ? '保存更改' : '发送邀请'}
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-[28px] mx-6 w-full max-w-[320px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Dialog Icon */}
            <div className="flex flex-col items-center pt-7 pb-4 px-6">
              <div className="w-14 h-14 rounded-full bg-error-container/50 flex items-center justify-center mb-4">
                <Trash2 size={28} className="text-error" />
              </div>
              <h2 className="text-[20px] font-bold text-on-surface text-center">
                确认删除
              </h2>
              <p className="text-[14px] text-on-surface-variant text-center mt-2 leading-relaxed">
                确定要删除 <span className="font-bold text-on-surface">{memberInfo?.name}</span> 的信息吗？此操作无法撤销。
              </p>
            </div>
            {/* Dialog Actions */}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-bold text-[15px] active:scale-[0.97] transition-all hover:bg-surface-container-high"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-[15px] active:scale-[0.97] transition-all hover:brightness-110 shadow-sm"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
