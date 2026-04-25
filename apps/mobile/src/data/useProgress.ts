import { trpc } from '../lib/trpc'

export function useLastSessionPRCount() {
  return trpc.progress.lastSessionPRCount.useQuery()
}

export function usePersonalRecords() {
  return trpc.progress.records.useQuery()
}
