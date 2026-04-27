import { createMMKV } from 'react-native-mmkv'
import type { StateStorage } from 'zustand/middleware'

export const storage = createMMKV({
  id: 'tanren-default',
})

export const STORAGE_KEYS = {
  INTRO_SEEN: 'tanren-intro-seen-v1',
} as const

export const mmkvStateStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => { storage.remove(name) },
}
