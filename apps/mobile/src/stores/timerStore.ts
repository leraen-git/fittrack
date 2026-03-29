import { create } from 'zustand'

interface TimerState {
  isRunning: boolean
  secondsRemaining: number
  totalSeconds: number
  exerciseName: string
  start: (seconds: number, exerciseName: string) => void
  pause: () => void
  skip: () => void
  addSeconds: (seconds: number) => void
  reset: () => void
  tick: () => void
}

export const useTimerStore = create<TimerState>((set) => ({
  isRunning: false,
  secondsRemaining: 0,
  totalSeconds: 0,
  exerciseName: '',

  start: (seconds, exerciseName) =>
    set({ isRunning: true, secondsRemaining: seconds, totalSeconds: seconds, exerciseName }),

  pause: () => set((s) => ({ isRunning: !s.isRunning })),

  skip: () => set({ isRunning: false, secondsRemaining: 0 }),

  addSeconds: (seconds) =>
    set((s) => ({
      secondsRemaining: Math.max(0, s.secondsRemaining + seconds),
      totalSeconds: Math.max(0, s.totalSeconds + seconds),
    })),

  reset: () => set({ isRunning: false, secondsRemaining: 0, totalSeconds: 0, exerciseName: '' }),

  tick: () =>
    set((s) => {
      if (!s.isRunning || s.secondsRemaining <= 0) return { isRunning: false }
      return { secondsRemaining: s.secondsRemaining - 1 }
    }),
}))
