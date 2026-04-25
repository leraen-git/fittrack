import { trpc } from '../lib/trpc'

export function useWorkouts() {
  return trpc.workouts.list.useQuery()
}

export function useWorkoutDetail(id: string, opts?: { enabled?: boolean }) {
  return trpc.workouts.detail.useQuery({ id }, opts)
}
