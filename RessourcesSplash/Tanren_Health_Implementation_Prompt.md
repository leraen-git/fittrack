# Implementation Prompt — Tanren Health Integration (HealthKit + Health Connect)

> **How to use this prompt:** paste the entire content below into Claude Code at the root of the Tanren monorepo. The prompt is self-contained and assumes the agent has access to the existing project structure (`CLAUDE.md`, package.json, brand assets). The agent should read `CLAUDE.md` first to load brand constraints (colors, typography, French copy, locale rules).

---

## Role & Goal

You are implementing the **Health Platform Integration** for the Tanren mobile app — a React Native + Expo strength training app for the French market.

Your goal: scaffold a **production-grade, platform-agnostic health data layer** that synchronizes selected data bidirectionally with Apple HealthKit (iOS) and Health Connect (Android). The integration must:

- **Read** bodyweight and resting heart rate from the platform.
- **Write** workout sessions (strength training type) and estimated active calories to the platform.
- Respect user privacy through contextual permission requests with Tanren-branded pre-prompts.
- Be idempotent (no duplicate workouts on retry/resync).
- Work offline (queue writes when network is unavailable, sync when back online).
- Comply with App Store, Play Store, and GDPR requirements.

---

## Project Context

**Stack (already set up):**
- React Native + Expo (SDK 51+) with Dev Client (NOT Expo Go — Health libs require native code)
- Expo Router for navigation
- TypeScript (strict mode)
- Zustand for state management
- WatermelonDB for offline-first local persistence
- Prisma + PostgreSQL on the backend (Fastify)
- React Native Reanimated 3 for animations
- `expo-localization` + `i18n-js` for translations

**Locale:** `fr-FR` only at launch. All user-facing copy in French. Tutoiement throughout.

**Brand identity:** see `CLAUDE.md` — strict three-color palette (black/white/red), Barlow Condensed typography, Noto Serif JP for kanji, no emojis, brutalist industrial aesthetic.

---

## Libraries to Install

```bash
npx expo install react-native-health
npx expo install react-native-health-connect
npx expo install expo-dev-client  # if not already installed
```

**Important:** after install, run `npx expo prebuild --clean` to regenerate native projects with the new modules. Do NOT attempt to build with Expo Go — it will fail.

---

## Architecture Overview

The integration follows a **facade pattern** with platform adapters:

```
useHealth() hook (Zustand-backed)
        ↓
HealthService (platform-agnostic facade)
        ↓
   ┌────┴────┐
   ↓         ↓
iOS adapter  Android adapter
(react-      (react-native-
 native-      health-connect)
 health)
   ↓         ↓
HealthKit   Health Connect
```

The rest of the app (screens, business logic) only talks to the `useHealth()` hook. It must NEVER reference iOS-specific or Android-specific APIs directly.

---

## File Structure to Create

```
src/
├── services/
│   └── health/
│       ├── HealthService.ts              # platform-agnostic facade
│       ├── types.ts                      # shared types & enums
│       ├── adapters/
│       │   ├── HealthKitAdapter.ios.ts   # iOS implementation
│       │   └── HealthConnectAdapter.android.ts  # Android implementation
│       ├── mappers/
│       │   ├── workoutMapper.ts          # TanrenSession → platform workout
│       │   └── bodyweightMapper.ts       # platform reading → TanrenBodyweight
│       ├── permissions.ts                # READ/WRITE permission constants
│       ├── calories.ts                   # MET-based calorie estimation
│       └── syncQueue.ts                  # offline write queue
├── hooks/
│   └── useHealth.ts                      # main consumer hook
├── stores/
│   └── healthStore.ts                    # Zustand store (permissions state, sync state)
└── components/
    └── health/
        ├── PrePermissionPrompt.tsx       # generic pre-prompt component
        ├── PublishSessionPrompt.tsx      # specific: workout sync
        └── ReadBodyweightPrompt.tsx      # specific: weight read
```

---

## Public API — `useHealth()` Hook

The hook must expose this exact interface (consumed by the rest of the app):

```typescript
interface UseHealthReturn {
  // ===== Permissions state =====
  permissions: {
    canWriteWorkout: boolean;
    canReadBodyweight: boolean;
    canReadRestingHR: boolean;
  };
  isAvailable: boolean;  // false if Health Connect not installed on Android < 14

  // ===== Permission requests (always preceded by pre-prompt UI) =====
  requestWorkoutWritePermission: () => Promise<boolean>;
  requestBodyweightReadPermission: () => Promise<boolean>;
  requestRestingHRReadPermission: () => Promise<boolean>;

  // ===== Read operations =====
  getLatestBodyweight: () => Promise<{ value: number; unit: 'kg'; recordedAt: Date } | null>;
  getRestingHR: (days: number) => Promise<{ bpm: number; recordedAt: Date }[]>;

  // ===== Write operations =====
  writeWorkout: (session: TanrenSession) => Promise<{ success: boolean; recordId?: string; error?: string }>;
  deleteWorkout: (recordId: string) => Promise<boolean>;

  // ===== Sync state =====
  pendingSyncCount: number;  // number of sessions in offline queue
  syncPending: () => Promise<void>;  // triggered manually or on app foreground
  lastSyncAt: Date | null;
}
```

The hook reads from `healthStore` for state and calls `HealthService` for actions. Permissions state must be **refreshed on every app foreground** — users can revoke permissions in iOS/Android settings without telling the app.

---

## TanrenSession Type (already exists, do not redefine)

The `writeWorkout` method receives a `TanrenSession` object with this shape (already in your domain model):

```typescript
interface TanrenSession {
  id: string;                  // UUID, used as healthRecordId for idempotence
  userId: string;
  startedAt: Date;
  endedAt: Date;
  totalVolumeKg: number;       // sum of (load × reps) across all sets
  exercises: ExerciseLog[];
  bodyweightKg?: number;       // user's bodyweight at session time, for calorie estimation
}
```

Do NOT pass set-level details to Health. Only the session-level summary. The brand book is explicit: "Health receives a session summary, not granular set data."

---

## Permission Requests Flow

### CRITICAL: Pre-prompt before system prompt

**Never call `requestAuthorization()` directly without showing a Tanren-branded pre-prompt first.**

The flow is:

1. User triggers an action (e.g., taps "Save session") that requires a permission.
2. Tanren displays a full-screen pre-prompt component (see Components section below).
3. If user taps "Activer" / "Autoriser":
   - Check current permission state.
   - If already granted → execute action immediately.
   - If not granted → call native `requestAuthorization()`.
   - If user grants in system prompt → execute action.
   - If user denies in system prompt → show a Toast: `"Tu pourras activer plus tard dans Réglages."` Do NOT re-prompt.
4. If user taps "Plus tard" in the pre-prompt → close, set a flag in `healthStore` (`bodyweightPromptDismissedAt`), do not re-prompt for 30 days.

### One-shot prompts (do NOT spam)

Each pre-prompt fires AT MOST ONCE per user lifetime if dismissed, and AT MOST ONCE PER 30 DAYS if temporarily declined. Track dismissal timestamps in the `healthStore`.

---

## Components: Pre-prompts

Three Tanren-branded full-screen modals. Each follows the visual reference at `/docs/design/Tanren_Health_Prompts.html` (open this file in a browser for the pixel-perfect spec).

### Shared structure (use a generic `PrePermissionPrompt` component):

- Black background (`#000000`)
- 24px grid overlay at `#141414`
- Massive kanji 鍛錬 watermark (Noto Serif JP Black, 280px, opacity 4%)
- Top-right "Plus tard" skip button (grey, no border, 14px Barlow Condensed Medium)
- Hero block:
  - 96×96 framed icon (2px white border, with 12×12 red corner accents at top-left and bottom-right)
  - Subtle red radial glow behind the icon
  - Kanji tag `鍛 錬` in red (Noto Serif JP Bold, 13px, letter-spacing 0.4em)
  - Title in Barlow Condensed Black 900, 30px, ALL CAPS
  - Description in Barlow Condensed Regular, 15px, color `#BBBBBB`
- Benefits list (3 numbered items, separated by 1px dark dividers `#1f1f1f`)
  - Number in red Barlow Condensed Black, 18px
  - Main text white 14px Medium 500
  - Sub-text grey 12px Regular 400
- Privacy note (dashed border `#2a2a2a`, shield/clock icon, small grey copy)
- Primary CTA at bottom: red button (`#FF2D3F`), white text, 52px height, 4px border-radius
  - Text varies per prompt (see below)

### The 3 prompts

**1. PublishSessionPrompt** (after 1st session save)
- Icon: Apple Health-inspired heart with mini ECG line (white outline + red ECG)
- Title: "Tes séances dans Apple Santé"  *(Android: replace "Apple Santé" with "Health Connect")*
- Description: "Chaque séance Tanren peut être publiée dans l'app Santé d'iPhone." *(Android: "...dans Health Connect.")*
- Benefits:
  1. **Compte dans tes anneaux d'activité** — sub: "Move, Exercise, Stand" *(Android: "Compte dans tes statistiques d'activité" — sub: "Visible dans toutes tes apps santé")*
  2. **Visible aux côtés de tes autres workouts** — sub: "Course, vélo, marche"
  3. **Estimation des calories brûlées** — sub: "Basée sur ton poids et la durée"
- Privacy: shield icon, "Tu peux désactiver à tout moment dans les Réglages."
- CTA: "Activer la synchronisation"

**2. ReadBodyweightPrompt** (during profile creation/edit)
- Icon: stylized scale with "82,4" digital readout in red and tiny "KG" label
- Title: "Synchronise ton poids"
- Description: "Tanren peut lire ton poids depuis Apple Santé pour éviter la double saisie." *(Android: "...depuis Health Connect...")*
- Benefits:
  1. **Profil pré-rempli en 1 seconde** — sub: "Plus besoin de saisir ton poids"
  2. **Évolution suivie automatiquement** — sub: "Si tu pèses régulièrement"
  3. **Calculs de volume relatif plus précis** — sub: "Volume / bodyweight ratio"
- Privacy: clock icon, "Lecture seule. Tanren n'écrit rien dans ton poids."
- CTA: "Autoriser la lecture"

**3. ReadRestingHRPrompt** (optional, post-MVP — included in scope only if user opts in via Settings)
- This prompt is NOT shown automatically. It is only triggered if the user manually enables "Lire ma fréquence cardiaque au repos" in Settings.
- Use the same generic `PrePermissionPrompt` component with appropriate icon (heart with pulse line) and copy.
- Title: "Suis ta récupération"
- Description: "Tanren peut lire ta fréquence cardiaque au repos pour estimer ta récupération entre les séances."
- CTA: "Autoriser la lecture"

### Localization

All copy must be defined in `i18n/locales/fr.json` under `health.prompts.*`. Provide a structure that allows easy translation later:

```json
{
  "health": {
    "prompts": {
      "publishSession": {
        "ios": { "title": "...", "description": "...", "platformName": "Apple Santé" },
        "android": { "title": "...", "description": "...", "platformName": "Health Connect" },
        "benefits": [
          { "title": "...", "subtitle": "..." },
          ...
        ],
        "privacy": "...",
        "cta": "Activer la synchronisation",
        "skip": "Plus tard"
      },
      "readBodyweight": { /* similar */ }
    },
    "errors": {
      "denied": "Tu pourras activer plus tard dans Réglages.",
      "notAvailable": "Health Connect n'est pas installé sur ton appareil.",
      "syncFailed": "Synchronisation impossible. Réessaie plus tard."
    }
  }
}
```

---

## Workout Mapping (writeWorkout)

### iOS implementation

```typescript
async function writeWorkoutIOS(session: TanrenSession) {
  const calories = estimateCalories(session);  // see calories.ts
  const result = await HealthKit.saveWorkout({
    type: HKWorkoutActivityType.TraditionalStrengthTraining,
    startDate: session.startedAt.toISOString(),
    endDate: session.endedAt.toISOString(),
    energyBurned: calories,
    energyBurnedUnit: 'kcal',
    metadata: {
      HKMetadataKeyExternalUUID: session.id,
      'app.tanren.totalVolumeKg': session.totalVolumeKg.toString(),
      'app.tanren.exerciseCount': session.exercises.length.toString(),
    },
  });
  return { success: true, recordId: result.uuid };
}
```

### Android implementation

```typescript
async function writeWorkoutAndroid(session: TanrenSession) {
  const calories = estimateCalories(session);
  const records = [
    {
      recordType: 'ExerciseSession',
      exerciseType: ExerciseType.STRENGTH_TRAINING,
      startTime: session.startedAt.toISOString(),
      endTime: session.endedAt.toISOString(),
      title: `Séance Tanren — ${session.exercises.length} exercices`,
      notes: `Volume total : ${session.totalVolumeKg.toLocaleString('fr-FR')} kg`,
      metadata: {
        clientRecordId: session.id,
        dataOrigin: 'app.tanren',
      },
    },
    {
      recordType: 'ActiveCaloriesBurned',
      energy: { value: calories, unit: 'kilocalories' },
      startTime: session.startedAt.toISOString(),
      endTime: session.endedAt.toISOString(),
      metadata: { clientRecordId: `${session.id}-cal`, dataOrigin: 'app.tanren' },
    },
  ];
  const result = await HealthConnect.insertRecords(records);
  return { success: true, recordId: result[0] };
}
```

---

## Calorie Estimation (`calories.ts`)

Use MET-based formula from the Compendium of Physical Activities (2024 update):

```typescript
const MET_STRENGTH_TRAINING = 5.0;

export function estimateCalories(session: TanrenSession): number {
  const bodyweightKg = session.bodyweightKg ?? 75; // fallback if unknown
  const durationHours = (session.endedAt.getTime() - session.startedAt.getTime()) / 3_600_000;
  const calories = MET_STRENGTH_TRAINING * bodyweightKg * durationHours;
  return Math.round(calories);
}
```

Document this formula in a code comment so future maintainers don't think it's arbitrary. Mark calories as **estimated** (not measured) when writing to the platform — both APIs accept this metadata.

---

## Idempotence & Sync Queue

### Database schema additions (Prisma)

```prisma
model Session {
  id              String    @id @default(cuid())
  // ... existing fields
  healthSyncedAt  DateTime?
  healthRecordId  String?
  healthSyncError String?
}

model HealthSyncQueue {
  id          String   @id @default(cuid())
  sessionId   String   @unique
  attempts    Int      @default(0)
  lastError   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### WatermelonDB schema additions

Mirror these fields locally for offline-first behavior. The local DB is the source of truth; backend syncs from local.

### Sync queue logic (`syncQueue.ts`)

- When `writeWorkout` is called and offline → enqueue, return `{ success: false, error: 'offline' }` (caller still gets a non-blocking experience).
- When app comes to foreground → call `syncPending()`, which iterates the queue and retries with exponential backoff (max 5 attempts: 1s, 2s, 4s, 8s, 16s).
- On `success` → set `Session.healthSyncedAt`, store `healthRecordId`, remove from queue.
- After 5 failed attempts → keep in queue, mark with error, surface in Settings under "Sync issues" with manual retry button.
- If user deletes a Tanren session that was synced → call `deleteWorkout(healthRecordId)` to maintain consistency. Log silently if delete fails (record may have been deleted manually by user).

---

## App Store / Play Store Configuration

### iOS — `Info.plist` additions

```xml
<key>NSHealthShareUsageDescription</key>
<string>Tanren utilise ton poids pour personnaliser ton suivi de progression et tes calculs de volume relatif.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Tanren publie tes séances de musculation dans Apple Santé pour qu'elles comptent dans tes anneaux d'activité.</string>
```

These strings are mandatory and must be in French for the FR App Store. Apple rejects apps with vague or generic descriptions.

### iOS — Capabilities

In Xcode (or via `app.json` Expo config plugin), enable the **HealthKit** capability for the app target. Add the entitlement file with `com.apple.developer.healthkit` set to true.

### Android — Manifest additions

```xml
<uses-permission android:name="android.permission.health.READ_WEIGHT"/>
<uses-permission android:name="android.permission.health.READ_HEART_RATE"/>
<uses-permission android:name="android.permission.health.WRITE_EXERCISE"/>
<uses-permission android:name="android.permission.health.WRITE_ACTIVE_CALORIES_BURNED"/>

<queries>
  <package android:name="com.google.android.apps.healthdata" />
</queries>
```

The `<queries>` block is required since Android 11 to detect if Health Connect is installed.

### Privacy policy

You MUST host a publicly accessible privacy policy URL with a **dedicated section** for HealthKit/Health Connect data. Apple/Google verify this during review. The section must list:
- What data is read and written
- Why each data point is needed
- That data is never shared with third parties
- That data is never used for advertising
- How users can revoke access (point to OS Settings)

---

## GDPR Compliance (France launch)

Health data is **sensitive personal data** under GDPR Article 9. Implementation requirements:

1. **Explicit Tanren-side consent log** — when user taps "Activer" on a pre-prompt, log the consent in your backend with timestamp, IP, and user agent. The OS-level permission is not enough.

2. **Right to erasure** — when a user deletes their Tanren account, your backend must trigger a cleanup job that calls `deleteWorkout()` for every `healthRecordId` previously written. Document this in your account deletion flow.

3. **EU hosting** — your backend must be hosted in the EU (Scaleway, OVH, AWS Frankfurt). No transfer of health data to US-based services without explicit Standard Contractual Clauses.

4. **Audit log** — keep a log of every read/write operation per user, retained for 1 year, accessible to users via a "Download my data" feature.

---

## Settings Screen (`/settings/health`)

Add a settings screen accessible from the main Settings, with these toggles:

```
┌──────────────────────────────────────────────┐
│  SANTÉ & SYNC                                │
├──────────────────────────────────────────────┤
│                                              │
│  ✓ Publier mes séances dans Apple Santé      │
│    Dernière sync : il y a 2 min              │
│                                              │
│  ✓ Lire mon poids depuis Apple Santé         │
│    82,4 kg · mis à jour ce matin             │
│                                              │
│  ○ Lire ma fréquence cardiaque au repos      │
│    Désactivé                                 │
│                                              │
│  ─────────────────────────────────────────   │
│                                              │
│  3 séances en attente de synchronisation     │
│  [ Synchroniser maintenant ]                 │
│                                              │
└──────────────────────────────────────────────┘
```

Each toggle, when activated, fires the corresponding pre-prompt → system prompt flow. When deactivated, calls `disableSync(type)` which marks the toggle off but does NOT delete previously synced data (user can do that manually in Apple Health / Health Connect).

---

## Validation Checklist

Before considering this complete, verify:

### Functional

- [ ] Pre-prompts render correctly in dark and light mode
- [ ] Pre-prompts respect the "max once if dismissed, max once per 30 days if declined" rule
- [ ] System permission prompts only fire AFTER user taps "Activer" on pre-prompt
- [ ] On iOS, `Info.plist` strings are in French and explicit
- [ ] On Android, manifest permissions are declared correctly
- [ ] Bodyweight read works on both platforms, returns latest value with timestamp
- [ ] Workout write works on both platforms, returns valid `recordId`
- [ ] Workout write is idempotent — calling twice with same session ID does NOT create duplicate
- [ ] Workout write writes the right activity type (`TraditionalStrengthTraining` / `STRENGTH_TRAINING`)
- [ ] Workout includes calorie estimation with proper "estimated" metadata
- [ ] All operations work offline: writes are queued, reads return cached values
- [ ] Sync queue retries with exponential backoff
- [ ] Manual "Synchroniser maintenant" button in Settings triggers `syncPending()`

### UX

- [ ] All copy is in French, tutoiement throughout
- [ ] All numbers use French formatting (comma decimal, space thousands)
- [ ] Pre-prompts use Barlow Condensed and Noto Serif JP correctly
- [ ] Pre-prompts use brand red (`#FF2D3F` dark / `#E8192C` light), no other colors
- [ ] Dark mode is default; light mode is supported
- [ ] On Android, when Health Connect is not installed, show a Toast with an actionable link to Play Store

### Privacy & Compliance

- [ ] Tanren-side consent is logged on every "Activer" tap
- [ ] Account deletion triggers cleanup of synced health records
- [ ] Privacy policy URL is updated with health data section
- [ ] Set-level data is NEVER written to Health (only session summary)
- [ ] No console.log of health data values in production builds

### Code Quality

- [ ] Platform-specific code is isolated in `.ios.ts` / `.android.ts` files
- [ ] No iOS-only or Android-only API leaks into the rest of the app
- [ ] All public API methods of `useHealth()` are typed strictly (no `any`)
- [ ] Error states are typed as discriminated unions, not strings
- [ ] Adapters are unit-testable (mock the native module, test mappers in isolation)
- [ ] Permissions state is refreshed on `AppState` change to `'active'`

---

## What NOT to Do (anti-patterns)

- Do NOT call `requestAuthorization()` on app launch or during onboarding. Always contextual.
- Do NOT write granular set-level data to HealthKit/Health Connect. Session-level only.
- Do NOT auto-import existing workouts from Health into Tanren. Tanren is the source of truth for its own sessions.
- Do NOT condition any Tanren feature on Health permission grant. App must be 100% functional without Health.
- Do NOT block UI on sync operations. All sync is background, with optimistic UI updates locally.
- Do NOT show emojis or motivational language ("Yes! 🎉 Synced!"). Use neutral confirmations: "Synchronisée."
- Do NOT log health data values in console (PII risk).
- Do NOT use `react-native-google-fit`. Health Connect is the modern replacement; Google Fit API is deprecating.

---

## Reference Mockup

The visual reference for the 3 pre-prompts exists at `/docs/design/Tanren_Health_Prompts.html` (open in browser). Match this rendering pixel-for-pixel within reasonable tolerance for cross-platform native rendering.

---

## Deliverables

When done, provide:

1. All files in `src/services/health/` and `src/components/health/`
2. The `useHealth()` hook in `src/hooks/useHealth.ts`
3. The Zustand store in `src/stores/healthStore.ts`
4. Updated `i18n/locales/fr.json` with `health.*` keys
5. Updated `app.json` (or `app.config.ts`) with HealthKit / Health Connect plugin configuration
6. Updated Prisma schema with `Session.healthSyncedAt`, `healthRecordId`, `HealthSyncQueue` model
7. Updated WatermelonDB schema mirroring the same fields locally
8. The Settings screen at `/settings/health`
9. A summary of architectural decisions and any deviations from this prompt
10. A list of what was NOT implemented and why (e.g., "Apple Watch companion app is V2 scope, not implemented here")

---

*Tanren · 鍛錬 · Une rep après l'autre.*
