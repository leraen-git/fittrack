---
name: Last features developed (commit 87eb4e5)
description: Features built in the session committed on 2026-04-14 — music controls, wake lock, heartbeat, diet today tab
type: project
originSessionId: 3edd2e77-56f9-4e78-9448-a973558947cc
---
Committed 2026-04-14 (87eb4e5): Add music controls, wake lock, session heartbeat, and diet today tab

**Features:**
- `MusicControlBar` component — mini-player docked above tab bar, only visible during active workouts when music is playing. Fade-in animation.
- `musicService.ts` — bridges system media player (Spotify, Apple Music) via `react-native-music-control`. Ambient audio session so notification sounds mix with music (not pause it). Initialized once in `_layout.tsx`.
- `useWorkletTimer` hook — replaces JS-thread `setInterval` with UI-thread worklet for accurate rest countdown under heavy JS load.
- Wake lock (`expo-keep-awake`) in `active.tsx` — screen stays on during session, releases on AppState background.
- Session heartbeat — writes session state to `session-heartbeat.json` every 30s via `expo-file-system` for crash recovery. Cleared on clean finish or abandon.
- Home screen Today tab toggle — appears when both a workout plan AND a diet plan are active. Auto-switches to "Diet today" tab when today's workout is done (respects manual overrides, resets on new day).
- Layout battery optimization — cancels all TanStack Query in-flight requests when app backgrounds.

**Why:** User-facing workout session quality — keep screen on, accurate timer, music awareness, and diet visibility from home.
**How to apply:** These are all in `apps/mobile`. The music service depends on `react-native-music-control` (native module — requires a dev build, not Expo Go).
