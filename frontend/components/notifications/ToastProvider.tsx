'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastType, title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, type, title, message };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toastStyles: Record<ToastType, { border: string; bg: string; text: string; icon: any }> = {
    success: {
      border: 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      bg: 'bg-slate-900/90',
      text: 'text-emerald-300',
      icon: CheckCircle2,
    },
    warning: {
      border: 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      bg: 'bg-slate-900/90',
      text: 'text-amber-300',
      icon: AlertTriangle,
    },
    error: {
      border: 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      bg: 'bg-slate-900/90',
      text: 'text-rose-300',
      icon: AlertCircle,
    },
    info: {
      border: 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      bg: 'bg-slate-900/90',
      text: 'text-cyan-300',
      icon: Info,
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay Stack */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const style = toastStyles[toast.type];
            const Icon = style.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`
                  pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl
                  ${style.bg} ${style.border} flex items-start gap-3 shadow-2xl
                `}
              >
                <div className={`p-1.5 rounded-xl bg-white/5 ${style.text} shrink-0 mt-0.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white leading-snug">{toast.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
