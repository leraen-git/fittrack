import { create } from 'zustand'
import type { ExerciseSet, WorkoutTemplate } from '@fittrack/shared'

export interface SessionExercise {
  exerciseId: string
  exerciseName: string
  defaultSets: number
  defaultReps: number
  defaultWeight: number
  defaultRestSeconds: number
}

interface ActiveSessionState {
  currentWorkout: WorkoutTemplate | null
  exercises: SessionExercise[]
  currentExerciseIndex: number
  currentSetIndex: number
  sets: Map<string, Partial<ExerciseSet>[]>
  startedAt: Date | null

  startSession: (workout: WorkoutTemplate, exercises: SessionExercise[]) => void
  nextExercise: () => void
  prevExercise: () => void
  completeSet: (exerciseId: string, setIndex: number) => void
  updateSet: (exerciseId: string, setIndex: number, data: Partial<ExerciseSet>) => void
  initSetsForExercise: (exerciseId: string, count: number, defaults: Partial<ExerciseSet>) => void
  finishSession: () => void
}

export const useActiveSessionStore = create<ActiveSessionState>((set) => ({
  currentWorkout: null,
  exercises: [],
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  sets: new Map(),
  startedAt: null,

  startSession: (workout, exercises) =>
    set({
      currentWorkout: workout,
      exercises,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      startedAt: new Date(),
      sets: new Map(),
    }),

  nextExercise: () =>
    set((s) => ({
      currentExerciseIndex: Math.min(s.exercises.length - 1, s.currentExerciseIndex + 1),
      currentSetIndex: 0,
    })),

  prevExercise: () =>
    set((s) => ({
      currentExerciseIndex: Math.max(0, s.currentExerciseIndex - 1),
      currentSetIndex: 0,
    })),

  initSetsForExercise: (exerciseId, count, defaults) =>
    set((s) => {
      const allSets = new Map(s.sets)
      if (!allSets.has(exerciseId)) {
        allSets.set(
          exerciseId,
          Array.from({ length: count }, (_, i) => ({
            setNumber: i + 1,
            reps: defaults.reps ?? 0,
            weight: defaults.weight ?? 0,
            restSeconds: defaults.restSeconds ?? 90,
            isCompleted: false,
          })),
        )
      }
      return { sets: allSets }
    }),

  completeSet: (exerciseId, setIndex) =>
    set((s) => {
      const allSets = new Map(s.sets)
      const exerciseSets = [...(allSets.get(exerciseId) ?? [])]
      if (exerciseSets[setIndex]) {
        exerciseSets[setIndex] = {
          ...exerciseSets[setIndex],
          isCompleted: true,
          completedAt: new Date(),
        }
      }
      allSets.set(exerciseId, exerciseSets)
      return { sets: allSets }
    }),

  updateSet: (exerciseId, setIndex, data) =>
    set((s) => {
      const allSets = new Map(s.sets)
      const exerciseSets = [...(allSets.get(exerciseId) ?? [])]
      exerciseSets[setIndex] = { ...exerciseSets[setIndex], ...data }
      allSets.set(exerciseId, exerciseSets)
      return { sets: allSets }
    }),

  finishSession: () =>
    set({
      currentWorkout: null,
      exercises: [],
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      sets: new Map(),
      startedAt: null,
    }),
}))
