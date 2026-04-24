import { trpc } from '../lib/trpc'

export function useSessions(params?: { limit?: number }) {
  return trpc.sessions.history.useQuery(params ?? {})
}
