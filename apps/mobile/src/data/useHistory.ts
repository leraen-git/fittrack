import { trpc } from '../lib/trpc'

type Period = '1w' | '1m' | '3m' | '1y'

export function useHistoryList(params: { period: Period; muscleGroup?: string; limit?: number }, opts?: { enabled?: boolean }) {
  return trpc.history.list.useQuery(params, opts)
}

export function useHistoryStats(params: { period: Period }, opts?: { enabled?: boolean }) {
  return trpc.history.stats.useQuery(params, opts)
}
