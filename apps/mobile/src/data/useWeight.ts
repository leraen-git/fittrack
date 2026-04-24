import { trpc } from '../lib/trpc'
import type { WeightPeriod } from '@tanren/shared'

export function useWeight(period: WeightPeriod) {
  return trpc.weight.list.useQuery({ period })
}
