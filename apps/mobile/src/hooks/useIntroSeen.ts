import { useCallback, useState } from 'react'
import { storage, STORAGE_KEYS } from '../lib/storage'

export function useIntroSeen() {
  const [seen, setSeen] = useState(() => storage.getBoolean(STORAGE_KEYS.INTRO_SEEN) ?? false)

  const markSeen = useCallback(() => {
    storage.set(STORAGE_KEYS.INTRO_SEEN, true)
    setSeen(true)
  }, [])

  const reset = useCallback(() => {
    storage.remove(STORAGE_KEYS.INTRO_SEEN)
    setSeen(false)
  }, [])

  return { seen, markSeen, reset }
}
