---
name: Key commits and what they contain
description: Notable commits with what was fixed or built, for quick orientation after context resets
type: project
originSessionId: 3edd2e77-56f9-4e78-9448-a973558947cc
---
## 87eb4e5 — 2026-04-14
Add music controls, wake lock, session heartbeat, and diet today tab
- MusicControlBar component (mini-player during active workouts)
- musicService.ts (bridges system media player, ambient audio session)
- useWorkletTimer hook (UI-thread timer, replaces setInterval)
- Wake lock via expo-keep-awake in active.tsx
- Session heartbeat to disk every 30s for crash recovery
- Home screen Today tab toggle (workout/diet) when both plans active
- Layout: cancel queries on app background

## 4a97dc2 — 2026-04-14
Permanent patch for react-native paths-with-spaces build failure
- patches/react-native+0.79.6.patch — fixes 3 unquoted shell variables in RN scripts
- package.json postinstall: patch-package — auto-applies on every npm install
