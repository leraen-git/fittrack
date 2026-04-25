import { trpc } from '../lib/trpc'

export function useDietPlan() {
  return trpc.diet.getMyPlanV2.useQuery()
}

export function useDietPlanCount() {
  return trpc.diet.planCount.useQuery()
}

export function useRestorePlan(options?: { onSuccess?: () => void }) {
  return trpc.diet.restoreLastPlan.useMutation(options)
}

export type DietPlan = NonNullable<ReturnType<typeof useDietPlan>['data']>
