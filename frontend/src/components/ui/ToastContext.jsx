import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let bgColor = 'bg-white border-gray-200';
            let textColor = 'text-gray-900';
            let Icon = Info;
            let iconColor = 'text-blue-500';

            // Check if dark theme is active via class
            const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
            if (isDark) {
              bgColor = 'bg-gray-900 border-gray-800';
              textColor = 'text-white';
            }

            if (t.type === 'success') {
              bgColor = isDark ? 'bg-emerald-950 border-emerald-800 text-emerald-100' : 'bg-white border-emerald-100';
              Icon = CheckCircle;
              iconColor = 'text-emerald-500';
            } else if (t.type === 'error') {
              bgColor = isDark ? 'bg-rose-950 border-rose-800 text-rose-100' : 'bg-white border-rose-100';
              Icon = AlertCircle;
              iconColor = 'text-rose-500';
            } else if (t.type === 'warning') {
              bgColor = isDark ? 'bg-amber-950 border-amber-800 text-amber-100' : 'bg-white border-amber-100';
              Icon = AlertTriangle;
              iconColor = 'text-amber-500';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bgColor} ${textColor} font-sans`}
              >
                <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
                <div className="flex-1 text-xs font-semibold leading-normal">{t.message}</div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-gray-400 hover:text-gray-600 transition shrink-0 cursor-pointer focus:outline-none"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
