import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  onPress?: () => void
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, type?: ToastType, options?: { duration?: number; onPress?: () => void }) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, type = 'info', options) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, message, type, onPress: options?.onPress }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, options?.duration ?? 3000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
