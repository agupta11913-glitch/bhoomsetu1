import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl', footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${maxWidth} overflow-hidden transform transition-all my-auto max-h-[92vh] flex flex-col`}>
        {/* Modal Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{title}</h3>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 transition ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2.5 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-100 bg-slate-50/80 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
