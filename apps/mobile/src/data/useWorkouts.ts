import { trpc } from '../lib/trpc'

export function useWorkouts() {
  return trpc.workouts.list.useQuery()
}
