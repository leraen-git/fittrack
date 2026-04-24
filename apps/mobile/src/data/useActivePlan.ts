import { trpc } from '../lib/trpc'

export function useActivePlan() {
  return trpc.plans.active.useQuery()
}

export type ActivePlan = NonNullable<ReturnType<typeof useActivePlan>['data']>
