/**
 * useWorkletTimer — drives the rest timer tick from Reanimated's UI-thread
 * frame callback instead of a JS-thread setInterval.
 *
 * Why: the JS thread can be busy with React renders, TanStack Query callbacks,
 * or Zustand updates during a heavy set-logging moment. A setInterval on the
 * JS thread drifts under load. Reanimated's useFrameCallback runs on the UI
 * thread at frame rate (~60fps) and is immune to JS thread jank.
 *
 * The hook reads isRunning from timerStore and syncs it to a Reanimated
 * shared value (JS → UI thread). On each frame, it checks if 1000ms has
 * elapsed since the last tick, then calls tick() back on the JS thread via
 * runOnJS — keeping Zustand as the single source of truth.
 *
 * Result: accurate countdown with zero JS-thread dependency for timing.
 */

import { useEffect } from 'react'
import { useSharedValue, useFrameCallback, runOnJS } from 'react-native-reanimated'
import { useTimerStore } from '@/stores/timerStore'

export function useWorkletTimer(): void {
  const isRunning = useTimerStore((s) => s.isRunning)

  // Shared values live on the UI thread — no JS bridge crossing on every frame
  const running = useSharedValue(false)
  const lastTickMs = useSharedValue(0)

  // Sync isRunning from JS store → UI thread shared value
  useEffect(() => {
    running.value = isRunning
    if (isRunning) {
      // Reset last tick time when timer starts so first tick fires ~1s later
      lastTickMs.value = performance.now()
    }
  }, [isRunning, running, lastTickMs])

  useFrameCallback(() => {
    'worklet'
    if (!running.value) return

    const now = performance.now()
    if (now - lastTickMs.value >= 1000) {
      lastTickMs.value = now
      // Bridge back to JS thread only for the store update — one call/second
      runOnJS(useTimerStore.getState().tick)()
    }
  })
}
