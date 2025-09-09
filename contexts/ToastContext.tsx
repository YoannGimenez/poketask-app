import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastData, ToastType } from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  showSuccess: (title: string, message?: string, imageUrl?: string) => void;
  showWarning: (title: string, message?: string, imageUrl?: string) => void;
  showError: (title: string, message?: string, imageUrl?: string) => void;
  toastFlee: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
    };

    setToasts(prev => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => {
      const filtered = prev.filter(toast => toast.id !== id);
      // Réorganiser les positions après suppression
      return filtered.map((toast, index) => ({
        ...toast,
        index,
      }));
    });
  };

  const showSuccess = (title: string, message?: string, imageUrl?: string) => {
    showToast({
      type: 'success',
      title,
      message,
      imageUrl,
      duration: 4000,
    });
  };

  const showWarning = (title: string, message?: string, imageUrl?: string) => {
    showToast({
      type: 'warning',
      title,
      message,
      imageUrl,
      duration: 5000,
    });
  };

  const showError = (title: string, message?: string, imageUrl?: string) => {
    showToast({
      type: 'error',
      title,
      message,
      imageUrl,
      duration: 6000,
    });
  };

  const toastFlee = (title: string, message?: string) => {
    showToast({
      type: 'flee',
      title,
      message,
      duration: 3000,
    });
  }

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showWarning,
    showError,
    toastFlee,
  };

  return (
      <ToastContext.Provider value={value}>
        {children}
        {toasts.map((toast, index) => (
            <Toast
                key={toast.id}
                toast={toast}
                index={index}
                onDismiss={dismissToast}
            />
        ))}
      </ToastContext.Provider>
  );
}