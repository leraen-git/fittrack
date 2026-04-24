import { trpc } from '../lib/trpc'
import { useAuth } from '../contexts/AuthContext'
import type { WeightPeriod } from '@tanren/shared'

export function useWeight(period: WeightPeriod) {
  const { status } = useAuth()
  return trpc.weight.list.useQuery({ period }, {
    enabled: status === 'authenticated',
  })
}
