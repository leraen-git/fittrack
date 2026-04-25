import { create } from 'zustand'

export type DietGenStatus = 'idle' | 'generating' | 'done' | 'error'
export type DietGenMode = 'submit' | 'regenerate'

interface DietGenPayload {
  mode: DietGenMode
  submitInput?: Record<string, unknown>
}

interface DietGenerationState {
  status: DietGenStatus
  errorMessage: string | null
  payload: DietGenPayload | null
  start: (payload: DietGenPayload) => void
  finish: () => void
  fail: (message: string) => void
  reset: () => void
}

export const useDietGenerationStore = create<DietGenerationState>((set) => ({
  status: 'idle',
  errorMessage: null,
  payload: null,
  start: (payload) => set({ status: 'generating', payload, errorMessage: null }),
  finish: () => set({ status: 'done', payload: null }),
  fail: (message) => set({ status: 'error', errorMessage: message, payload: null }),
  reset: () => set({ status: 'idle', errorMessage: null, payload: null }),
}))
