import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
          info: <Info className="h-5 w-5 text-blue-600 shrink-0" />
        };

        const bgStyles = {
          success: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10',
          error: 'bg-white border-rose-200 text-slate-800 shadow-rose-500/10',
          info: 'bg-white border-blue-200 text-slate-800 shadow-blue-500/10'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-5 ${
              bgStyles[toast.type] || bgStyles.info
            }`}
          >
            <div className="flex items-start space-x-3">
              {icons[toast.type] || icons.info}
              <div className="text-sm font-medium leading-tight pt-0.5">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
