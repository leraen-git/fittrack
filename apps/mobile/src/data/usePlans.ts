import { trpc } from '../lib/trpc'

export function usePlansList() {
  return trpc.plans.list.useQuery()
}
