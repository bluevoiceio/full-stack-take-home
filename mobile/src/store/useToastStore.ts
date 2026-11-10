import { create } from 'zustand';

export interface Toast {
  title: string;
  caption?: string;
  variant: 'success' | 'error';
}

interface ToastState {
  toast: Toast | null;
  show: (toast: Toast) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>()(set => ({
  toast: null,
  show: toast => set({ toast }),
  hide: () => set({ toast: null }),
}));
