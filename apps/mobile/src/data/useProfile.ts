import { trpc } from '../lib/trpc'

export function useProfile() {
  return trpc.auth.me.useQuery()
}

export type Profile = NonNullable<ReturnType<typeof useProfile>['data']>
