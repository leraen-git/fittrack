# ═══════════════════════════════════════════════════════════
# TANREN (鍛錬) — AI Workout Builder App
# Full-stack prompt for Claude Code
# ═══════════════════════════════════════════════════════════

## Project

**Tanren** (鍛錬) — a mobile strength training app.

- **Name:** Tanren (pronounced *tan-ren*, /ˈtan.ɾen/)
- **Etymology:** Japanese — *forging through intense, repeated training*. Composed of 鍛 (tan, "to forge / hammer metal") and 錬 (ren, "to refine / temper through repetition").
- **Tagline / Moto:** *Built rep by rep.*
- **Descriptive baseline:** Eat. Train. Rest.
- **Positioning:** Strength training app for committed practitioners. Gym/muscu classique ADN.
- **Bundle ID:** `app.tanren` · **Deep link scheme:** `tanren://` · **Package:** `@tanren/*`

Replace any legacy references (`FitTrack`) with `Tanren` everywhere.

---

## Brand identity (non-negotiable design constraints)

### Color palette

Strict three-color system. Do not introduce additional brand colors.

| Token | Hex (light) | Hex (dark) | Usage |
|---|---|---|---|
| `color.bg.primary` | `#FFFFFF` | `#000000` | Main background |
| `color.text.primary` | `#000000` | `#FFFFFF` | Main text |
| `color.accent` | `#E8192C` | `#FF2D3F` | PRs, CTAs, active states, logo |
| `color.text.secondary` | `#888888` | `#888888` | Timestamps, captions |
| `color.border` | `#CCCCCC` | `#222222` | Dividers, card outlines |
| `color.surface.raised` | `#F7F7F7` | `#111111` | Cards, modals |

Semantic colors (volume comparison only):

| Token | Hex | Usage |
|---|---|---|
| `color.semantic.up` | `#1A7F2C` | Volume increased vs last session |
| `color.semantic.flat` | `#D98E00` | Volume matched vs last session |
| `color.semantic.down` | `#E8192C` / `#FF2D3F` | Volume decreased vs last session |

Use `useColorScheme()` + React context for dark/light switching.
Every screen must support both modes without exception.

### Typography

- **Single typeface:** Barlow Condensed (via `@expo-google-fonts/barlow-condensed`)
- **Weights in use:** Bold (700) · Medium (500) · Regular (400) · Light (300)
- **ALL CAPS** for headers, CTAs, labels — never for body text
- **Numbers always bold** — weights, reps, sets, PRs
- **Italic** reserved exclusively for the moto (*Built rep by rep.*)
- Scale: 10 / 11 / 12 / 13 / 14 / 17 / 20 / 24 / 32px

### Spacing & radius

Spacing scale: 4 / 8 / 12 / 16 / 20 / 24px
Border radius: 4 / 6 / 8 / 12px (tight — no pill shapes in core UI)

### Units & locale (France launch)

Tanren launches in France first. All weights use the **metric system**, no exceptions.

| Measurement | Unit | Display format |
|---|---|---|
| Weight (load) | kg | `100 kg`, `82,5 kg` |
| Volume / tonnage | kg | `12 450 kg` (space thousands separator) |
| Date format | French | `DD/MM/YYYY` or `DD MMM YYYY` |
| First day of week | Monday | Heatmap and calendar |
| Decimal separator | comma (UI copy) | `82,5 kg` in prose; `82.5` in inputs/code |

**No `lbs` anywhere in the UI.** Database stores all weights as `Float` in kilograms.

### Voice & copy rules

- Direct, informed, never condescending. Never performative, never cute.
- No emojis anywhere in the app UI.
- No wellness/journey/gamification language.
- Forge-themed copy ≤ 1 instance per screen (use sparingly for flavor).

**Never use:** Wellness · Journey · Transformation · Crushing it · Leveling up · Beast mode · Badges · Points · Score

### Logo & splash

The logo: forge-spark mark (ring + bars + red sparks) + TANREN wordmark + optional 鍛錬 kanji stamp.
SVG assets in `/assets/brand/logo/`: `mark-dark.svg`, `mark-light.svg`.
Splash: dark bg `#000000`, 24px grid overlay, centered mark with red glow pulse, TANREN wordmark, 鍛錬 kanji, italic moto, baseline `EAT. TRAIN. REST.`

---

## TECH STACK

Frontend:   React Native + Expo (SDK 53+)
Navigation: Expo Router (file-based, tab layout)
State:      Zustand v5 (global) + TanStack Query v5 (server state)
API layer:  tRPC v11 (end-to-end type safety, no code generation)
Backend:    Node.js + Fastify + TypeScript
Database:   PostgreSQL (via Drizzle ORM)
Cache:      Redis (ioredis)
Auth:       Custom JWT — Email OTP (Resend) + Apple Sign-In + Google OAuth
            No Clerk. Token stored in expo-secure-store (key: tanren_auth_token).
Offline:    PowerSync (Postgres-native offline sync, conflict resolution)
Charts:     Victory Native XL (React Native Skia, GPU-rendered)
Notifs:     expo-notifications (local, timer alerts) — permission requested once on first launch
Testing:    Vitest (unit) + Maestro (E2E)
Linting:    ESLint + Prettier + TypeScript strict mode

---

## PROJECT STRUCTURE

tanren/
├── apps/
│   ├── mobile/              # Expo app
│   │   ├── app/             # Expo Router screens
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx          # Home
│   │   │   │   ├── workouts.tsx       # My sessions
│   │   │   │   ├── history.tsx        # Progress & history
│   │   │   │   └── profile.tsx        # User profile
│   │   │   ├── workout/
│   │   │   │   ├── [id].tsx           # Session detail
│   │   │   │   ├── active.tsx         # Active session screen
│   │   │   │   ├── recap.tsx          # Post-session recap
│   │   │   │   └── preview.tsx        # Pre-session setup
│   │   │   ├── exercise/
│   │   │   │   ├── [id].tsx           # Exercise long-term chart
│   │   │   │   └── library.tsx        # Exercise browser
│   │   │   ├── plans/                 # AI workout plan generation
│   │   │   ├── onboarding/            # 4-step onboarding flow
│   │   │   └── (auth)/                # Sign-in / OTP screens
│   │   ├── src/
│   │   │   ├── components/            # Reusable UI
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   ├── stores/                # Zustand stores
│   │   │   ├── services/              # Auth, notifications, music
│   │   │   ├── theme/                 # Design tokens (tokens.ts + ThemeContext.tsx)
│   │   │   └── utils/                 # format.ts (fr-FR formatters), progression.ts
│   │   └── assets/brand/logo/         # SVG mark assets
│   └── api/                 # Fastify backend
│       ├── src/
│       │   ├── routers/               # tRPC routers
│       │   ├── db/                    # Drizzle schema + seed
│       │   ├── services/              # AI, email (Resend)
│       │   └── trpc.ts                # Router + middleware
│       └── drizzle/
│           └── schema.ts
└── packages/
    └── shared/              # Shared types & utils (TS)

---

## DATABASE SCHEMA (Drizzle ORM)

### User
id, authId (unique), authProvider (email | apple | google | guest),
name, email, avatarUrl, gender,
level (BEGINNER | INTERMEDIATE | ADVANCED),
goal (WEIGHT_LOSS | MUSCLE_GAIN | MAINTENANCE),
weeklyTarget (Int), heightCm (Float?), weightKg (Float?),
onboardingDone (Bool), createdAt, updatedAt

### WorkoutTemplate
id, userId, name, description, muscleGroups (String[]),
estimatedDuration (Int, minutes), isTemplate (Bool),
isProgramWorkout (Bool), order (Int), createdAt

### Exercise
id, name, muscleGroups (String[]), equipment (String[]),
description, videoUrl, imageUrl, difficulty,
isCustom (Bool), userId (optional)

### WorkoutExercise
id, workoutTemplateId, exerciseId, order,
defaultSets (Int), defaultReps (Int),
defaultWeight (Float), defaultRestSeconds (Int), notes (optional)

### WorkoutSession
id, userId, workoutTemplateId, startedAt, completedAt,
durationSeconds (Int), totalVolume (Float),
notes (optional), perceivedExertion (1-10, optional)

### SessionExercise
id, workoutSessionId, exerciseId, order

### ExerciseSet
id, sessionExerciseId, setNumber,
reps (Int), weight (Float), restSeconds (Int),
isCompleted (Bool), completedAt, notes (optional)

### Program
id, name, description, level, goal, durationWeeks (Int),
sessionsPerWeek (Int), imageUrl, isOfficial (Bool)

### PersonalRecord
id, userId, exerciseId, weight (Float), reps (Int),
volume (Float), achievedAt, sessionId

---

## CORE FEATURES — IMPLEMENTATION GUIDE

### 1. Home screen (app/(tabs)/index.tsx)
- Greeting with user first name + time of day
- Compact stat strip: sessions this week, streak, last session PRs
- Workout/diet tab toggle (when both plans are active)
- Today's workout card with inline Start button
- Auto-switches to diet tab when today's workout is done
- "Workout complete" card shown when today's session is logged
- Pull-to-refresh, skeleton loaders on initial load

### 2. Active workout screen (app/workout/active.tsx)
- One exercise at a time with nav arrows
- Set rows: reps + weight inputs pre-filled from last session (per exercise, across all sessions)
- Rest timer overlay on set completion
- Session heartbeat written to disk every 30s for crash recovery
- Screen kept awake via expo-keep-awake

### 3. Rest timer
- Circular Skia progress ring (red stroke)
- Countdown in MM:SS, large Barlow Condensed Bold
- ±15s quick-adjust buttons
- Skip button
- Local notification when rest ends (backgrounded)
- Driven by Reanimated frame callback (UI thread) via useWorkletTimer hook

### 4. Post-session recap (app/workout/recap.tsx)
- Volume: current vs previous + % delta
- Per-exercise comparison bars: green / amber / red
- New PRs highlighted
- Save & finish writes session to DB

### 5. Progress & history (app/(tabs)/history.tsx)
- Time filter: 4w / 3m / 6m / All
- Activity heatmap (GitHub-style, Monday-first)
  Color ramp: #141414 → #4A0A10 → #8A1520 → #C01E2E → #FF2D3F
- Weekly volume bar chart (Victory Native XL)
- PRs per compound lift

### 6. Exercise drill-down (app/exercise/[id].tsx)
- Toggle: Max weight / Volume / Reps
- Line chart with fill area (Victory Native XL, Skia)
- Coaching tip rule engine:
    3+ sessions improved → suggest +2.5 kg
    3+ sessions flat → suggest deload
    2+ sessions declined → flag recovery warning

### 7. Guided programs
- 6 official programs seeded (Beginner → Advanced)
- Program detail: week overview, session list
- Enroll → locks template

### 8. Exercise library (app/exercise/library.tsx)
- Search + muscle group filter chips
- 200+ seeded exercises
- User can create custom exercises

### 9. AI workout plan generation (app/plans/)
- Generate plan via Anthropic API (gated for guests)
- Preview + customize before activating
- Active plan drives home screen workout card

### 10. Diet plan (app/diet/)
- AI-generated daily meal plan (gated for guests)
- Meal detail modal with ingredients/recipe
- Today's meals shown on home diet tab
- Diet screen unchanged from original design

---

## API ROUTES (tRPC + Fastify)

All routers require JWT verification (custom middleware, no Clerk).
Token: Bearer JWT in Authorization header, verified with jose.

health.query                     — server health check

auth.emailOtp.mutate             — send OTP code via Resend
auth.verifyOtp.mutate            — verify OTP, return JWT
auth.apple.mutate                — verify Apple identity token, return JWT
auth.google.mutate               — verify Google ID token, return JWT
auth.guest.mutate                — create guest session, return JWT

users.me.query                   — get current user
users.updateMe.mutate            — update profile

workouts.list.query              — user's templates
workouts.create.mutate
workouts.detail.query            — includes previousSets per exercise (cross-session)
workouts.update.mutate
workouts.delete.mutate

sessions.start.mutate            — start session
sessions.complete.mutate         — complete + write to DB
sessions.byId.query
sessions.history.query           — paginated history

exercises.list.query             — library (cached Redis 24h)
exercises.create.mutate
exercises.byId.query

progress.exercise.query          — long-term chart data
progress.sessionRecap.query      — vs previous session
progress.records.query           — personal records
progress.heatmap.query           — activity heatmap data
progress.lastSessionPRCount.query

plans.active.query               — active workout plan
plans.generate.mutate            — AI plan generation
plans.create.mutate
plans.delete.mutate

diet.todayMeals.query            — today's meals (lightweight, no full rawPlan)
diet.generate.mutate             — AI diet plan generation

---

## STATE MANAGEMENT

Zustand stores in src/stores/:

activeSessionStore.ts
  currentWorkout, exercises (SessionExercise[]), currentExerciseIndex,
  currentSetIndex, startedAt, isQuickSession
  SessionExercise includes: lastWeight?, lastReps? (ghost placeholder values)
  actions: startSession, nextExercise, prevExercise, completeSet,
           updateSet, addExercise, finishSession

timerStore.ts (vanilla store via createStore + useStore)
  isRunning, secondsRemaining, totalSeconds, exerciseName
  actions: start, pause, skip, addSeconds, reset, tick
  Export both timerStore (vanilla, for .getState()) and useTimerStore (hook)

userStore.ts
  profile, preferences (theme only — metric kg is fixed)
  actions: updateProfile, toggleTheme

notificationSettingsStore.ts
  workout reminders, meal reminders, hydration reminders

---

## NOTIFICATIONS

- Permission requested **once** on first app launch (AsyncStorage key: notif_permission_asked)
- Never requested again from active session screen
- Rest timer: scheduleRestEndNotification / cancelRestNotification
- Workout reminders: scheduled via notificationScheduler.ts
- Android channels: workout-reminders / meal-reminders / hydration-reminders

---

## VOLUME CALCULATION LOGIC

Implement in src/utils/progression.ts:

setVolume = reps × weight
exerciseVolume = sum(setVolume for all completed sets)
sessionVolume = sum(exerciseVolume for all exercises)
delta = (currentVolume - previousVolume) / previousVolume

improved  → delta > 0.01
stable    → delta between -0.01 and +0.01
declined  → delta < -0.01

---

## ENVIRONMENT VARIABLES

apps/api/.env:
DATABASE_URL=postgresql://localhost/tanren
REDIS_URL=redis://localhost:6379
PORT=3000
JWT_SECRET=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
FROM_EMAIL=Tanren <noreply@tanren.app>
ENABLE_DEV_AUTH=true

apps/mobile/.env:
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=

---

## CODE QUALITY RULES

- TypeScript strict mode, no `any`
- All tRPC procedures typed with Zod input schemas
- No business logic in components — use custom hooks
- All colors via theme tokens — zero hardcoded hex values
- All text via i18n keys (react-i18next), FR + EN locales
- Weights displayed in kg only — no lbs anywhere
- Numbers use fr-FR formatting: comma decimal, space thousands
- Accessibility: all interactive elements have accessibilityLabel and accessibilityRole
- No emojis in UI
- No console.log in production — use logger service
- Notification permission: requested once on first launch only

---

## UI/UX PRINCIPLES

- **Numbers carry meaning** — weights, reps, volume are always the most prominent element
- **Red is signal, not decoration** — reserved for PRs, active states, destructive actions, logo
- **Black/white contrast is absolute** — no gradients on primary backgrounds
- **Industrial, not friendly** — Barlow Condensed caps, sharp dividers
- **Respect user competence** — do not explain basic gym concepts unprompted
- **The forge metaphor lives in micro-interactions** — subtle red flash on PR, not spelled out

---

## CHECKLIST FOR ANY NEW SCREEN

- [ ] Uses only colors from the palette
- [ ] Uses only Barlow Condensed (Noto Serif JP for kanji only)
- [ ] All numbers are bold
- [ ] All weights in kg, no lbs
- [ ] Numbers use fr-FR format (comma decimal, space thousands)
- [ ] No emojis in UI strings
- [ ] Copy passes the "no performative motivation" test
- [ ] Red used only for signal, not decoration
- [ ] No badges, points, or gamification hooks
- [ ] Dark mode parity

---

*Tanren · 鍛錬 · Built rep by rep.*

# ═══════════════════════════════════════════════════════════
# END OF PROMPT
# ═══════════════════════════════════════════════════════════
