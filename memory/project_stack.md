---
name: Tanren project stack and structure
description: Core tech stack, monorepo layout, and key scripts for the Tanren app
type: project
---
Tanren is a React Native strength training app in a monorepo at `/Users/ramy/Documents/AppClaude/Tanren`.

**Stack:**
- Mobile: React Native + Expo SDK 53, Expo Router (file-based), New Architecture enabled
- State: Zustand + TanStack Query v5 via tRPC v11
- Backend: Node.js + Fastify + TypeScript (Drizzle ORM, PostgreSQL, Redis)
- Auth: Custom JWT — Email OTP (Resend) + Apple Sign-In + Google OAuth
- Offline sync: PowerSync

**Key paths:**
- Mobile app: `apps/mobile/`
- API: `apps/api/`
- Screens: `apps/mobile/app/`
- Components: `apps/mobile/src/components/`
- Stores: `apps/mobile/src/stores/`
- Services: `apps/mobile/src/services/`
- Hooks: `apps/mobile/src/hooks/`

**Scripts:**
- Root: `npm run dev` (turbo — starts all services)
- Mobile only: `cd apps/mobile && npx expo start`
- API only: `cd apps/api && npm run dev`
- DB seed: `npm run db:seed` (from root or `apps/api`)
- iOS simulator: `cd apps/mobile && npx expo run:ios`
- Android emulator: `cd apps/mobile && npx expo run:android`

**Bundle identifier:** `app.tanren`

**Why:** Reference for launching, navigating, and extending the project.
**How to apply:** Use these paths and commands whenever the user asks about running, building, or locating code.
