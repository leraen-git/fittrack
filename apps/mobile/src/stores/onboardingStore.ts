import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mmkvStateStorage } from '../lib/storage'

interface OnboardingState {
  currentStep: number
  name: string | null
  gender: 'male' | 'female' | null
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null
  goal: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTENANCE' | null
  weeklyTarget: number | null
  heightCm: string
  weightKg: string
  startedAt: string

  setStep: (step: number) => void
  setField: <K extends keyof Omit<OnboardingState, 'setStep' | 'setField' | 'reset' | 'isExpired'>>(key: K, value: OnboardingState[K]) => void
  reset: () => void
  isExpired: () => boolean
}

const initialState = {
  currentStep: 0,
  name: null,
  gender: null,
  level: null,
  goal: null,
  weeklyTarget: null,
  heightCm: '',
  weightKg: '',
  startedAt: new Date().toISOString(),
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      setField: (key, value) => set({ [key]: value } as Partial<OnboardingState>),
      reset: () => set({ ...initialState, startedAt: new Date().toISOString() }),
      isExpired: () => {
        const age = Date.now() - new Date(get().startedAt).getTime()
        return age > 7 * 24 * 3600 * 1000
      },
    }),
    {
      name: 'onboarding-flow-v1',
      storage: createJSONStorage(() => mmkvStateStorage),
    },
  ),
)
