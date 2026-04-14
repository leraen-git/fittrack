# FitTrack — Launch Guide (iOS Simulator)

Complete step-by-step instructions to run the app locally on the iOS Simulator.

---

## Prerequisites

Ensure you have the following installed before proceeding:

| Tool | Required version | Check |
|------|-----------------|-------|
| Node.js | ≥ 18.0.0 | `node --version` |
| npm | ≥ 10 | `npm --version` |
| Xcode | ≥ 15 (with Command Line Tools) | `xcode-select -p` |
| Expo CLI | bundled via npx | `npx expo --version` |

> **Xcode Command Line Tools** — if not installed: `xcode-select --install`

---

## Step 1 — Install dependencies

From the **root** of the monorepo:

```bash
cd "/Users/ramy/Documents/App Claude/fittrack"
npm install
```

This installs dependencies for all workspaces (mobile + api + shared) via Turborepo.

---

## Step 2 — Set up environment variables

The API needs its `.env` file. One already exists at `apps/api/.env`.  
If it is ever missing, create it with these keys:

```bash
# apps/api/.env
DATABASE_URL=
REDIS_URL=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=
```

The mobile app reads `EXPO_PUBLIC_*` variables automatically via Expo's config system.

---

## Step 3 — Start the backend API

Open a **dedicated terminal** and run:

```bash
cd "/Users/ramy/Documents/App Claude/fittrack/apps/api"
npm run dev
```

You should see:
```
Server listening at http://0.0.0.0:3000
```

Leave this terminal running for the entire session.

---

## Step 4 — Choose your launch method

### Option A — Expo Go (fast, no native modules)

> Use this for UI work. Does **not** support `react-native-music-control` (native module).

```bash
cd "/Users/ramy/Documents/App Claude/fittrack/apps/mobile"
npx expo start
```

Then press **`i`** in the terminal to open the iOS Simulator.

---

### Option B — Dev build on Simulator (full native support) ✅ Recommended

> Required for music controls, wake lock, and any native module.

```bash
cd "/Users/ramy/Documents/App Claude/fittrack/apps/mobile"
npx expo run:ios
```

This compiles the native iOS project and launches it on the **booted simulator** (currently `iPhone 17`).  
First run takes 3–5 minutes to compile. Subsequent runs use the incremental build cache.

To target a specific device:

```bash
npx expo run:ios --device "iPhone 17 Pro"
```

---

## Step 5 — Pick a simulator (optional)

Your available simulators:

| Device | Status |
|--------|--------|
| **iPhone 17** | Booted ← default |
| iPhone 17 Pro | Shutdown |
| iPhone 17 Pro Max | Shutdown |
| iPhone 17e | Shutdown |
| iPhone Air | Shutdown |

To boot a different simulator before running:

```bash
# List all available simulators with their UDIDs
xcrun simctl list devices available

# Boot by name
xcrun simctl boot "iPhone 17 Pro"

# Or open Simulator.app and pick a device from File > Open Simulator
open -a Simulator
```

---

## Step 6 — Verify the app is running

Once the build completes, the Simulator will launch and show the FitTrack splash screen, then the Home tab.

You should see:
- Greeting with time of day
- Streak / sessions / volume stat cards
- "New session" red CTA button
- Bottom tab bar: Home · Workouts · History · Profile

---

## Common commands (quick reference)

```bash
# Start Expo dev server only (no native build)
cd apps/mobile && npx expo start

# Build + run on iOS Simulator
cd apps/mobile && npx expo run:ios

# Build + run on Android Emulator
cd apps/mobile && npx expo run:android

# Start all services at once (Turborepo)
npm run dev                     # from repo root

# Start API only
cd apps/api && npm run dev

# Run unit tests
npm run test                    # from root (all workspaces)
cd apps/mobile && npm test      # mobile only

# Lint
npm run lint                    # from root

# DB operations (from repo root or apps/api)
npm run db:generate             # generate Drizzle migration
npm run db:migrate              # apply migration
npm run db:seed                 # seed exercises + programs + demo user
```

---

## Troubleshooting

### "Metro bundler port already in use"
```bash
npx kill-port 8081
```

### "No simulator booted"
```bash
xcrun simctl boot "iPhone 17"
open -a Simulator
```

### Native build fails after adding a new package
```bash
cd apps/mobile
npx expo prebuild --clean
npx expo run:ios
```

### API not reachable from Simulator
The Simulator shares your Mac's `localhost`. Ensure the API is running on port 3000 and `EXPO_PUBLIC_API_URL=http://localhost:3000` is set.

### Clerk authentication errors
Make sure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `apps/api/.env` matches your Clerk dashboard publishable key (starts with `pk_test_` or `pk_live_`).

---

## File locations (reference)

| What | Path |
|------|------|
| Mobile app entry | [apps/mobile/app/_layout.tsx](apps/mobile/app/_layout.tsx) |
| Home screen | [apps/mobile/app/(tabs)/index.tsx](apps/mobile/app/(tabs)/index.tsx) |
| Active workout | [apps/mobile/app/workout/active.tsx](apps/mobile/app/workout/active.tsx) |
| Theme tokens | [apps/mobile/src/theme/tokens.ts](apps/mobile/src/theme/tokens.ts) |
| Zustand stores | [apps/mobile/src/stores/](apps/mobile/src/stores/) |
| API routes | [apps/api/src/](apps/api/src/) |
| DB schema | [apps/api/src/db/schema.ts](apps/api/src/db/schema.ts) |







- go fetch on workout.cool all the exercice possible, and the muscular group to add it to the app.
- lets translate the app in french too. if the phone is french, the app should follow, if no french, the app stays in english
- in workout, i should be able to change the order of the exercices
- if the workout of the day is not finished,  the active plan card should be less big, also the cards under should be smaller, giving the space to the workout of the day,
