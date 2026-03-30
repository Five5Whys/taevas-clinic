import { useState, useCallback } from 'react';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'info' });

  const showToast = useCallback((message: string, severity: ToastSeverity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  return { toast, showToast, hideToast };
};
