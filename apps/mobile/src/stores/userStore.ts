import { create } from 'zustand'
import type { User } from '@tanren/shared'

type Theme = 'system' | 'light' | 'dark'

interface UserState {
  profile: User | null
  theme: Theme
  setProfile: (user: User) => void
  toggleTheme: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  theme: 'system',
  setProfile: (profile) => set({ profile }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}))
