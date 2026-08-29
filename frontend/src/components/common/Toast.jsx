import React from 'react';
import { useLandData } from '../../context/LandDataContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useLandData();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    alert: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500 bg-emerald-50/95',
    warning: 'border-amber-500 bg-amber-50/95',
    alert: 'border-rose-500 bg-rose-50/95',
    error: 'border-rose-500 bg-rose-50/95',
    info: 'border-blue-500 bg-blue-50/95',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-gov-lg backdrop-blur bg-white border ${borders[toast.type] || borders.info} transition-all transform animate-in slide-in-from-right duration-300`}
        >
          {icons[toast.type] || icons.info}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
