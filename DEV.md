# Tanren — Dev Guide

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (`brew services start postgresql@17`)
- Xcode (for iOS Simulator) **or** Expo Go app on iPhone **or** Android Studio

---

## First-time setup (run once)

```bash
# 1. Install all dependencies
cd /Users/ramy/Documents/AppClaude/Tanren
npm install --legacy-peer-deps

# 2. Create the database
psql -d postgres -c "CREATE DATABASE tanren OWNER ramy;"

# 3. Generate & apply migrations
cd apps/api
DATABASE_URL=postgresql://ramy@localhost:5432/tanren npx drizzle-kit generate
DATABASE_URL=postgresql://ramy@localhost:5432/tanren npx drizzle-kit migrate

# 4. Seed exercises, programs, and dev user
npx tsx --env-file=.env src/db/seed.ts
```

---

## Start the API

```bash
cd /Users/ramy/Documents/AppClaude/Tanren/apps/api
npx tsx --env-file=.env src/index.ts
```

API runs on **http://localhost:3000**

Test it:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/trpc/programs.list
curl http://localhost:3000/trpc/users.me
```

---

## Start the mobile app

```bash
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile
npx expo start
```

Metro runs on **http://localhost:8081**

Then press:
- `i` — open iOS Simulator (requires full Xcode)
- `a` — open Android Emulator (requires Android Studio)
- Scan QR code — open in Expo Go on your iPhone (no Xcode needed)

---

## Open on iOS Simulator

Requires full Xcode installed from the Mac App Store.

```bash
# Check Xcode is installed
xcode-select -p
# Should return: /Applications/Xcode.app/Contents/Developer

# Accept license (first time only)
sudo xcodebuild -license accept

# Launch simulator directly
open -a Simulator

# Or start Expo and auto-open simulator
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile
npx expo start --ios
```

---

## Open on Android Emulator

Requires Android Studio installed with a Virtual Device configured.

```bash
# Set env vars (add to ~/.zshrc to make permanent)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Start the emulator (replace AVD_NAME with your device name)
emulator -avd Pixel_8_API_35 &

# Then start Expo and auto-open emulator
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile
npx expo start --android
```

---

## Open on iPhone with Expo Go (no Xcode needed)

1. Install **Expo Go** from the App Store on your iPhone
2. Ensure Mac and iPhone are on the same Wi-Fi network
3. Start Expo:
   ```bash
   cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile
   npx expo start
   ```
4. Scan the QR code displayed in the terminal with your iPhone camera

---

## Restart everything (clean)

```bash
# Kill anything on the API and Metro ports
kill $(lsof -ti:3000) 2>/dev/null
kill $(lsof -ti:8081) 2>/dev/null

# Restart API
cd /Users/ramy/Documents/AppClaude/Tanren/apps/api
npx tsx --env-file=.env src/index.ts &

# Restart Expo with cleared cache
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile
npx expo start --clear
```

---

## Run unit tests

```bash
cd /Users/ramy/Documents/AppClaude/Tanren/packages/shared
npx vitest run
```

---

## Re-seed the database (reset data)

```bash
cd /Users/ramy/Documents/AppClaude/Tanren/apps/api
npx tsx --env-file=.env src/db/seed.ts
```

---

## Environment files

| File | Purpose |
|---|---|
| `apps/api/.env` | API server config (DB, Redis, JWT, dev user) |
| `apps/mobile/.env` | Expo config (API URL, Google OAuth client IDs) |
| `.env.example` | Template — copy and fill in for production |

### `apps/api/.env`
```
DATABASE_URL=postgresql://ramy@localhost:5432/tanren
REDIS_URL=redis://localhost:6379
JWT_SECRET=<generated>
DEV_USER_ID=<uuid>
ENABLE_DEV_AUTH=true
NODE_ENV=development
PORT=3000
```

### `apps/mobile/.env`
```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_DEV_USER_ID=<uuid>
```

---

## Project structure

```
tanren/
├── apps/
│   ├── api/          → Fastify + tRPC + Drizzle (port 3000)
│   └── mobile/       → Expo React Native (port 8081)
└── packages/
    └── shared/       → Shared types, constants, utils
```

---

## Common issues

**`Cannot find module 'ajv/dist/compile/codegen'`**
```bash
npm install --legacy-peer-deps
```

**`Unable to resolve module expo-linking`**
```bash
npm install expo-linking expo-constants --legacy-peer-deps
```

**`Database connection error`**
```bash
brew services start postgresql@17
```

**`Port already in use`**
```bash
kill $(lsof -ti:3000) 2>/dev/null   # API
kill $(lsof -ti:8081) 2>/dev/null   # Metro
```

**Metro cache stale / strange JS errors**
```bash
cd apps/mobile && npx expo start --clear
```
