import { useEffect, useCallback } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { syncQueue } from '@/lib/syncQueue'
import { trpc } from '@/lib/trpc'

export function useSyncWorker() {
  const utils = trpc.useUtils()

  const flush = useCallback(async () => {
    const queue = syncQueue.read()
    if (queue.length === 0) return

    for (const m of queue) {
      if (new Date(m.nextRetryAt) > new Date()) continue
      try {
        const parts = m.procedure.split('.')
        // Navigate the tRPC client: e.g. 'sessions.save' → client.sessions.save
        let target: any = utils.client
        for (const p of parts) target = target[p]
        await target.mutate(m.payload)
        syncQueue.remove(m.id)
      } catch (err: any) {
        if (err?.data?.code === 'BAD_REQUEST') {
          syncQueue.remove(m.id)
        } else {
          syncQueue.markFailed(m.id, err?.message ?? 'Unknown error')
        }
      }
    }
  }, [utils])

  useEffect(() => {
    flush()

    const appSub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') flush()
    })
    const netSub = NetInfo.addEventListener((state) => {
      if (state.isConnected) flush()
    })

    return () => {
      appSub.remove()
      netSub()
    }
  }, [flush])
}
