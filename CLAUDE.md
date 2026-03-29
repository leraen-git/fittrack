# ═══════════════════════════════════════════════════════════
# FITTRACK — AI Workout Builder App
# Full-stack prompt for Claude Code
# ═══════════════════════════════════════════════════════════

## PROJECT OVERVIEW

You are building FitTrack, a mobile-first strength training app.
The app allows users to create custom workout sessions, track
sets/reps/weight, rest with a configurable timer, follow guided
programs, and visualize their long-term progression.

## TECH STACK

Frontend:   React Native + Expo (SDK 53+)
Navigation: Expo Router (file-based, tab layout)
State:      Zustand (global) + TanStack Query v5 (server state)
API layer:  tRPC v11 (end-to-end type safety, no code generation)
Backend:    Node.js + Fastify + TypeScript
Database:   PostgreSQL (via Drizzle ORM)
Cache:      Redis (ioredis)
Auth:       Clerk (JWT, Apple Sign-In, Google OAuth)
Offline:    PowerSync (Postgres-native offline sync, conflict resolution)
Charts:     Victory Native XL (React Native Skia, GPU-rendered)
Notifs:     expo-notifications (local, timer alerts)
Testing:    Vitest (unit) + Maestro (E2E)
Linting:    ESLint + Prettier + TypeScript strict mode

## DESIGN SYSTEM

Implement a strict design token system. All values below must
be defined in src/theme/tokens.ts and never hardcoded.

### Color palette
Primary red:  #E8192C (light)  #FF2D3F (dark)
Background:   #FFFFFF (light)  #0E0E0E (dark)
Surface:      #F5F5F5 (light)  #1A1A1A (dark)
Surface 2:    #EBEBEB (light)  #252525 (dark)
Text primary: #0E0E0E (light)  #F0F0F0 (dark)
Text muted:   #888888 (light)  #555555 (dark)
Success:      #22C55E
Warning:      #F59E0B
Danger:       #E8192C

Use useColorScheme() + React context for dark/light switching.
Every screen must support both modes without exception.

### Typography
Font family: Inter (via expo-font)
Weights:     400 Regular, 600 SemiBold, 700 Bold, 800 ExtraBold
Scale:       10 / 11 / 12 / 13 / 14 / 17 / 20 / 24 / 32px

### Spacing & radius
Spacing scale: 4 / 8 / 12 / 16 / 20 / 24px
Border radius: 8 / 12 / 16 / 24 / 9999px (pill)

## PROJECT STRUCTURE

fittrack/
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
│   │   │   │   └── create.tsx         # Create/edit session
│   │   │   ├── exercise/
│   │   │   │   ├── [id].tsx           # Exercise long-term chart
│   │   │   │   └── library.tsx        # Exercise browser
│   │   │   └── programs/
│   │   │       └── [id].tsx           # Guided program detail
│   │   ├── src/
│   │   │   ├── components/            # Reusable UI
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   ├── stores/                # Zustand stores
│   │   │   ├── services/              # API calls
│   │   │   ├── theme/                 # Design tokens
│   │   │   └── utils/                 # Helpers
│   │   └── db/                        # WatermelonDB schema
│   └── api/                 # Fastify backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── plugins/
│       │   └── prisma/
│       └── prisma/
│           └── schema.prisma
└── packages/
    └── shared/              # Shared types & utils (TS)

## DATABASE SCHEMA (Drizzle ORM)

Create the following models in src/db/schema.ts (Drizzle):

### User
id, clerkId (unique), name, email, avatarUrl,
level (BEGINNER | INTERMEDIATE | ADVANCED),
goal (WEIGHT_LOSS | MUSCLE_GAIN | MAINTENANCE),
weeklyTarget (Int), createdAt, updatedAt

### WorkoutTemplate
id, userId, name, description, muscleGroups (String[]),
estimatedDuration (Int, minutes), isTemplate (Bool),
isProgramWorkout (Bool), order (Int), createdAt
Relations: User, WorkoutExercise[], WorkoutSession[]

### Exercise
id, name, muscleGroups (String[]), equipment (String[]),
description, videoUrl, imageUrl, difficulty,
isCustom (Bool), userId (optional, for custom exercises)

### WorkoutExercise
id, workoutTemplateId, exerciseId, order,
defaultSets (Int), defaultReps (Int),
defaultWeight (Float), defaultRestSeconds (Int),
notes (optional)

### WorkoutSession
id, userId, workoutTemplateId, startedAt, completedAt,
durationSeconds (Int), totalVolume (Float),
notes (optional), perceivedExertion (1-10, optional)
Relations: User, WorkoutTemplate, SessionExercise[]

### SessionExercise
id, workoutSessionId, exerciseId, order
Relations: WorkoutSession, Exercise, ExerciseSet[]

### ExerciseSet
id, sessionExerciseId, setNumber,
reps (Int), weight (Float), restSeconds (Int),
isCompleted (Bool), completedAt, notes (optional)

### Program
id, name, description, level, goal, durationWeeks (Int),
sessionsPerWeek (Int), imageUrl, isOfficial (Bool)
Relations: ProgramWeek[]

### PersonalRecord
id, userId, exerciseId, weight (Float), reps (Int),
volume (Float), achievedAt, sessionId

## CORE FEATURES — IMPLEMENTATION GUIDE

### 1. Home screen (app/(tabs)/index.tsx)
- Greeting with user first name + time of day
- 3 stat cards: current streak (days), total sessions, total
  volume gain (%)
- "New session" CTA button (primary red, full width)
- Recent workouts list (last 5), tap to repeat or view
- Guided programs shelf (horizontal scroll)
- Pull-to-refresh, skeleton loaders on initial load

### 2. Active workout screen (app/workout/active.tsx)
- One exercise visible at a time, swipe to navigate
- Current set highlighted, tap to mark complete
- Input fields: reps, weight (numeric keyboard)
- Persistent previous session data shown as ghost values
- "Validate set" button triggers rest timer automatically

### 3. Rest timer
- Circular SVG progress ring (red stroke on dark fill)
- Countdown in MM:SS format, large typography
- ±15s quick-adjust buttons
- "Skip" button to proceed immediately
- Local notification triggered when rest ends (works
  when app is backgrounded)
- Default rest time comes from ExerciseSet.restSeconds,
  editable per-exercise in session

### 4. Post-session recap (app/workout/recap.tsx)
Global comparison vs previous session of same template:
- Total volume: current vs previous + % delta
- Badge summary: X improved / Y stable / Z declined
- Per-exercise breakdown with colored comparison bars:
    green  = current volume > previous  (+X%)
    amber  = equal  (=)
    red    = current volume < previous  (-X%)
- Each exercise card shows:
    previous: Nsets × Mreps @ Wkg
    current:  Nsets × Mreps @ Wkg
    volume delta per set
- New personal records highlighted with star badge
- "Save & finish" button writes session to DB

### 5. Progress & history (app/(tabs)/history.tsx)
Global view:
- Time filter pills: 4w / 3m / 6m / All
- Stats: volume trend %, sessions count, sessions/week
- Activity heatmap (GitHub-style, 7 cols × 4 rows)
  5 intensity levels: none / low / medium / high / max
  Color ramp: #141414 → #4A0A10 → #8A1520 → #C01E2E → #FF2D3F
- Weekly volume bar chart (12 bars, current week = red)
- Personal records list per compound lift

Drill-down (tap exercise → app/exercise/[id].tsx):
- Toggle: Charge max / Volume / Reps
- Line chart with fill area (Victory Native XL, Skia-rendered)
  X axis: session dates, Y axis: value
  Red line + red fill with opacity
  Dotted line for target/goal
- Session-by-session table: date | max weight | volume | Δ%
- Milestone card when PR is beaten
- Goal progress bar: start → current → target
- Contextual coaching tip (rule-based):
    If 3+ consecutive sessions improved → suggest +2.5kg
    If 3+ sessions flat → suggest deload or variation
    If 2+ sessions declined → flag recovery warning

### 6. Guided programs
- Seed database with 6 official programs:
    Beginner Muscle Gain 8wk (3d/wk)
    Beginner Fat Loss 8wk (3d/wk)
    Beginner Maintenance 6wk (2d/wk)
    Intermediate Push/Pull/Legs 12wk (6d/wk)
    Intermediate Upper/Lower 10wk (4d/wk)
    Advanced Powerlifting 16wk (5d/wk)
- Program detail: week overview, session list
- "Start program" enrolls user, locks template
- Progress indicator per week
- Sessions can be duplicated and customized

### 7. Exercise library (app/exercise/library.tsx)
- Search bar + muscle group filter chips
- 200+ seeded exercises with: name, primaryMuscle[],
  secondaryMuscle[], equipment[], difficulty
- User can create custom exercises
- Exercise detail: description, animated GIF placeholder,
  muscles targeted diagram (SVG body map)

## API ROUTES (tRPC + Fastify)

All routers require Clerk JWT verification via
@clerk/fastify plugin. tRPC replaces REST — types flow
automatically from server to client with no code generation.

Define routers in apps/api/src/routers/:

health.query          — server health check

users.sync            — upsert from Clerk webhook
users.me.query        — get current user
users.me.mutate       — update current user

workouts.list.query          — user's templates
workouts.create.mutate
workouts.byId.query
workouts.update.mutate
workouts.delete.mutate

sessions.start.mutate        — start session
sessions.complete.mutate     — complete + write to DB
sessions.byId.query
sessions.history.query       — paginated history

exercises.list.query         — library (cached Redis 24h)
exercises.create.mutate      — create custom
exercises.byId.query

progress.exercise.query      — long-term chart data
progress.sessionRecap.query  — vs previous session
progress.records.query       — personal records
progress.heatmap.query       — activity heatmap data

programs.list.query
programs.byId.query
programs.enroll.mutate

## OFFLINE-FIRST STRATEGY

Use PowerSync for local persistence with automatic Postgres sync.
PowerSync eliminates the need for a custom /sync endpoint —
it connects directly to Postgres and handles conflict resolution.

Setup:
- apps/mobile/src/db/powersync.ts — PowerSync client config
- apps/mobile/src/db/schema.ts    — local SQLite table definitions
  (mirrors server: workouts, exercises, sessions, sets)
- apps/api/src/plugins/powersync.ts — PowerSync backend connector

Sync flow:
1. PowerSync streams Postgres changes to device automatically
2. Active session writes locally first via SQLite (immediate)
3. On session complete: local write syncs to Postgres via PowerSync
4. Conflict resolution handled by PowerSync (last-write-wins + hooks)
5. Optimistic UI everywhere — never block on network
6. Offline banner when no connection (non-blocking, PowerSync status API)

## NOTIFICATIONS

Implement in src/services/timerService.ts:
- Schedule local notification when rest timer starts
- Cancel notification if user skips manually
- Notification payload: exercise name + next set info
- Use expo-notifications scheduleNotificationAsync
- Request permissions on first active session only

## STATE MANAGEMENT

Define these Zustand stores in src/stores/:

activeSessionStore.ts
  currentWorkout, currentExerciseIndex, currentSetIndex,
  sets (Map<exerciseId, ExerciseSet[]>), startedAt,
  actions: nextExercise, prevExercise, completeSet,
  updateSet, finishSession

timerStore.ts
  isRunning, secondsRemaining, totalSeconds, exerciseName,
  actions: start, pause, skip, addSeconds, reset

userStore.ts
  profile, preferences (units kg/lbs, theme),
  actions: updateProfile, toggleTheme

## VOLUME CALCULATION LOGIC

Implement in src/utils/progression.ts:

// Volume per set
setVolume = reps × weight

// Volume per exercise (session)
exerciseVolume = sum(setVolume for all completed sets)

// Session total volume
sessionVolume = sum(exerciseVolume for all exercises)

// Progression delta (exercise level)
delta = (currentVolume - previousVolume) / previousVolume

// Status thresholds
improved  → delta > 0.01  (+1% or more)
stable    → delta between -0.01 and +0.01
declined  → delta < -0.01

// Coaching rule engine
type Trend = 'improving' | 'plateauing' | 'declining'
function getTrend(last5sessions: number[]): Trend
function getCoachingTip(exercise, trend, currentMax): string

## COMPONENT LIBRARY

Build these base components in src/components/:

Button       — primary (red), secondary, ghost, icon variants
Card         — surface card with optional press handler
SetRow       — set number + reps/weight inputs + status
ExerciseCard — name, muscle tags, comparison bars, delta badge
TimerRing    — Skia circular countdown (react-native-skia)
ProgressBar  — labeled start/current/target bar
HeatmapGrid  — 7×N grid of colored cells (activity map)
BarChart     — weekly volume bars (Victory Native XL)
LineChart    — progression curve with fill area (Victory Native XL)
StatCard     — metric label + large value + trend indicator
PillFilter   — horizontal scrollable filter chips
SkeletonCard — shimmer placeholder (react-native-reanimated)

## ENVIRONMENT VARIABLES

Create .env.example with:
DATABASE_URL=
REDIS_URL=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_URL=
JWT_SECRET=

## CODE QUALITY RULES

- TypeScript strict mode, no any
- All tRPC procedures typed with Zod input schemas (output types inferred)
- No business logic in components — use custom hooks
- Every hook must have a corresponding unit test
- All colors via theme tokens — zero hardcoded hex values
- All text via i18n keys (react-i18next), EN locale only
- Accessibility: all interactive elements have
  accessibilityLabel and accessibilityRole
- No console.log in production — use logger service

## SEED DATA

Create apps/api/src/db/seed.ts with:
- 200+ exercises across all muscle groups
- 6 official programs (see Guided programs section)
- 1 demo user with 12 weeks of realistic session history
  (for local dev/testing of history & progress screens)

## START SEQUENCE

When starting from scratch, proceed in this exact order:

1.  Scaffold monorepo with Turborepo
2.  Initialize Expo app (SDK 53, TypeScript template, New Architecture enabled)
3.  Initialize Fastify API (TypeScript, ESM)
4.  Set up Drizzle ORM + run initial migration
5.  Configure Clerk (backend plugin + Expo SDK)
6.  Set up tRPC router (Fastify adapter + Expo client)
7.  Implement design tokens + theme provider
8.  Create base component library (Skia for timer/charts)
9.  Configure PowerSync (backend connector + mobile client + schema)
10. Build all tRPC procedures with Zod input validation
11. Build screens in order: Home → Workouts → Active
    → Timer → Recap → History → Exercise detail → Programs
12. Wire up Zustand stores + TanStack Query (via tRPC)
13. Add notifications service
14. Implement progression calculation utils
15. Seed database
16. Write unit tests for hooks + utils
17. Write Maestro E2E flows for critical paths
18. Final pass: dark mode audit, accessibility audit

# ═══════════════════════════════════════════════════════════
# END OF PROMPT
# ═══════════════════════════════════════════════════════════
