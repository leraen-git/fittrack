# Implementation Prompt — Tanren Login Screen

> **How to use this prompt:** paste the entire content below into Claude Code (or your AI coding assistant of choice) at the root of the Tanren monorepo. The agent has access to the existing project structure (`CLAUDE.md`, brand assets, dependencies). This prompt is self-contained and assumes no prior conversation context.

---

## Role & Goal

You are implementing the **Login Screen** of the Tanren mobile app — a React Native + Expo strength training app for the French market.

Your goal: produce a production-grade login screen component that exactly matches the visual mockup specifications below, integrates cleanly with the existing project architecture (Zustand, Expo Router, the project's auth hooks), and follows the Tanren brand guidelines defined in `CLAUDE.md`.

You must read `CLAUDE.md` first to load the brand constraints (colors, typography, voice, French locale rules) before writing any code.

---

## Project Context

**Stack (already set up):**
- React Native + Expo (SDK 51+)
- Expo Router for navigation
- TypeScript (strict mode)
- Zustand for state management
- React Native Reanimated 3 for animations
- `expo-font` for custom fonts
- `expo-localization` + `i18n-js` for translations
- `expo-apple-authentication` for Sign in with Apple
- `@react-native-google-signin/google-signin` for Google Sign-In
- NativeWind (or StyleSheet API — match existing project convention)

**Locale:** `fr-FR` only at launch. All copy is in French. Tutoiement (informal "tu") throughout.

**Target file location:** `app/(auth)/login.tsx` (assuming Expo Router file-based structure with an `(auth)` route group). Adapt to actual project structure if different.

---

## Visual Specifications

### Layout (top to bottom)

1. **Status bar area** — system bar, transparent background, content adapts to mode
2. **Logo block** (centered, top third)
   - Forge-spark mark, 64×64 px, with subtle radial red glow
   - Wordmark `TANREN`, Barlow Condensed Black 900, 44px, letter-spacing 0.16em
   - Kanji `鍛 錬` (with thin space between characters), Noto Serif JP Bold 700, 13px, letter-spacing 0.4em, color = brand red
   - Baseline `Une rep après l'autre.`, Barlow Condensed Regular Italic, 15px, color = brand red
3. **Flexible spacer** (pushes CTAs to bottom)
4. **Background watermark** — Kanji `鍛錬` rendered MASSIVELY behind everything (320px font-size, Noto Serif JP Black 900, opacity 4–5%), centered absolutely. Must NOT block touch events.
5. **Background grid** — 24×24 px CSS grid pattern, color `#141414` (dark) / `#F0F0F0` (light), opacity 100%. Renders BEHIND the watermark.
6. **CTA block** (bottom third, 12px gap between buttons)
   - Primary CTA — `Continuer avec Apple` (red background, white text, Apple logo icon)
   - Secondary CTA — `Se connecter avec Google` (white bg / black text in dark mode; black bg / white text in light mode, Google "G" icon)
   - Tertiary CTA — `Continuer avec un e-mail` (transparent bg, 1px border, mail icon)
   - Guest link — `Continuer en tant qu'invité` (text link, underlined, no button)
   - DEV-only button — `DEV — Skip sign-in` (dashed border, very small, only renders when `__DEV__ === true`)
7. **Legal text** at bottom — `En continuant, tu acceptes nos CGU et notre politique de confidentialité.` (11px, grey, with two underlined inline links)

### Stacking order (z-index, back to front)

1. Background grid pattern (z = 0)
2. Kanji watermark `鍛錬` (z = 1)
3. Logo block + CTA block (z = 10)

### Z-index notes
- Background grid and kanji watermark are decorative only — `pointerEvents: 'none'`
- Status bar must remain visible (z = 50)

---

## Color Tokens (must come from theme, not hardcoded)

```typescript
// Should already exist in theme/colors.ts — if not, create it
export const colors = {
  black: '#000000',           // "iron"
  white: '#FFFFFF',           // "anvil"
  red: {
    light: '#E8192C',         // "forge" — light mode accent
    dark: '#FF2D3F',          // "forge" — dark mode accent (brighter)
  },
  grey: {
    border: '#CCCCCC',        // light mode borders
    mid: '#888888',           // secondary text both modes
    surfaceDark: '#111111',   // dark mode raised surfaces
    gridDark: '#141414',      // dark mode background grid lines
    gridLight: '#F0F0F0',     // light mode background grid lines
  },
} as const;
```

---

## Typography Tokens

```typescript
// Should already exist in theme/typography.ts
export const typography = {
  fonts: {
    barlow: {
      regular: 'BarlowCondensed-Regular',
      medium: 'BarlowCondensed-Medium',
      bold: 'BarlowCondensed-Bold',
      black: 'BarlowCondensed-Black',
      italic: 'BarlowCondensed-Italic',
    },
    notoJp: {
      regular: 'NotoSerifJP-Regular',
      bold: 'NotoSerifJP-Bold',
      black: 'NotoSerifJP-Black',
    },
  },
  // letter-spacing values (multiply by fontSize for React Native)
  tracking: {
    tight: -0.02,
    normal: 0,
    wide: 0.04,      // labels
    wider: 0.16,     // wordmark
    widest: 0.4,     // kanji + baseline caps
  },
} as const;
```

**Required font files** (download from Google Fonts and place in `/assets/fonts/`):
- `BarlowCondensed-Regular.ttf`
- `BarlowCondensed-Medium.ttf`
- `BarlowCondensed-Bold.ttf`
- `BarlowCondensed-Black.ttf`
- `BarlowCondensed-Italic.ttf`
- `NotoSerifJP-Regular.ttf`
- `NotoSerifJP-Bold.ttf`
- `NotoSerifJP-Black.ttf`

Load all fonts via `expo-font` in the root layout (`app/_layout.tsx`) before rendering any screen.

---

## Asset Requirements

### Required brand assets (place in `/assets/brand/logo/`)

**1. Forge-spark mark — dark mode** (`mark-dark.svg`):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="72" fill="none" stroke="#FFFFFF" stroke-width="6"/>
  <circle cx="100" cy="100" r="14" fill="#FF2D3F"/>
  <rect x="92" y="20" width="16" height="50" fill="#FFFFFF"/>
  <rect x="20" y="92" width="50" height="16" fill="#FFFFFF"/>
  <rect x="130" y="92" width="50" height="16" fill="#FFFFFF"/>
  <rect x="92" y="130" width="16" height="50" fill="#FFFFFF"/>
  <line x1="148" y1="52" x2="135" y2="65" stroke="#FF2D3F" stroke-width="4" stroke-linecap="square"/>
  <line x1="52" y1="148" x2="65" y2="135" stroke="#FF2D3F" stroke-width="4" stroke-linecap="square"/>
</svg>
```

**2. Forge-spark mark — light mode** (`mark-light.svg`):
Same as above but replace `#FFFFFF` strokes/fills with `#000000`, and `#FF2D3F` with `#E8192C`.

Render SVGs using `react-native-svg` (already in the dependency tree). Create a `<ForgeMark mode="dark" | "light" size={64} />` component for reuse.

### Required icon SVGs (inline in component or in `/assets/icons/`)

- **Apple logo** — official Apple logo (white fill on red button)
- **Google G** — official Google "G" multicolor logo
- **Mail icon** — outline style, 24×24, stroke-width 2, matches brand neutral (`currentColor`)

Use `react-native-svg` for all icons. Do NOT use icon font libraries.

---

## i18n Strings (FR — primary)

Create `/i18n/locales/fr.json`:

```json
{
  "auth": {
    "login": {
      "wordmark": "TANREN",
      "kanji": "鍛 錬",
      "baseline": "Une rep après l'autre.",
      "cta": {
        "apple": "Continuer avec Apple",
        "google": "Se connecter avec Google",
        "email": "Continuer avec un e-mail",
        "guest": "Continuer en tant qu'invité",
        "dev": "DEV — Skip sign-in"
      },
      "legal": {
        "prefix": "En continuant, tu acceptes nos ",
        "terms": "CGU",
        "and": " et notre ",
        "privacy": "politique de confidentialité",
        "suffix": "."
      }
    }
  }
}
```

Wrap all user-facing strings in `t('auth.login.*')` calls. Never hardcode French strings in components.

---

## Animations

### Forge-spark glow pulse

The radial red glow behind the forge-spark mark must pulse subtly:

- Base scale: 1.0
- Peak scale: 1.10
- Base opacity: 0.6
- Peak opacity: 1.0
- Duration: 3000ms
- Easing: `Easing.inOut(Easing.ease)`
- Loop: infinite, mirrored (yoyo)

Implement with React Native Reanimated 3 (`useSharedValue`, `withRepeat`, `withTiming`, `withSequence`). Performance must be 60fps on iPhone 12 and above. Run on the UI thread (`worklet`).

### Mount transition

On screen mount, the entire logo block fades in from opacity 0 to 1 over 400ms with a slight Y-offset (`translateY: 8 → 0`). The CTA block follows with a 200ms delay, same animation. Use `Animated.View` from Reanimated.

No other animations on this screen.

---

## Authentication Flow

The authentication layer is the project's responsibility — this screen only triggers it via well-defined hooks. Use the following abstraction:

- `useAppleSignIn()` — returns `{ signIn, isLoading, error }`. Wraps `expo-apple-authentication` and posts the credential to your backend's `/auth/apple` endpoint.
- `useGoogleSignIn()` — returns `{ signIn, isLoading, error }`. Wraps `@react-native-google-signin/google-signin` and posts the ID token to `/auth/google`.
- For the **email** flow: navigate to `/auth/email-signin` (a separate screen, not implemented in this scope) where the user enters credentials and your backend issues a JWT/session.

These hooks should already exist in `hooks/auth/`. If they don't, scaffold them as thin wrappers — do NOT implement the OAuth provider integration in this screen. Keep the login screen purely presentational + glue.

For the **guest** path: set a Zustand flag `useAuthStore.setState({ isGuest: true })` and navigate to the home screen. Guest users have read-only access to programs but cannot save sessions.

For the **DEV button**: bypass auth completely, set a fake user in Zustand (`useAuthStore.setState({ user: MOCK_DEV_USER })`), navigate to home. Wrap the entire button in `if (__DEV__)` so it never ships to production.

After successful auth, navigate to `/onboarding` if it's a first-time user (check `user.hasCompletedOnboarding` flag), or `/(tabs)/home` if returning. Use Expo Router's `router.replace()` (not `push`) so the user can't go back to login.

Handle errors with a `Toast` (use the project's existing toast system if any, otherwise React Native's `Alert` as a fallback). Never expose raw OAuth error messages to the user — map them to friendly French messages:

- `ERR_REQUEST_CANCELED` (user cancelled) → no toast, silent
- Network error → `"Connexion impossible. Vérifie ta connexion internet."`
- Server error → `"Une erreur est survenue. Réessaie dans un instant."`
- Anything else → `"Connexion impossible. Réessaie."`

---

## Component Structure (suggested)

```
app/
└── (auth)/
    └── login.tsx              # main screen component

components/
├── brand/
│   ├── ForgeMark.tsx          # SVG forge-spark mark
│   ├── KanjiWatermark.tsx     # large 鍛錬 watermark
│   └── BackgroundGrid.tsx     # 24px grid pattern
├── auth/
│   ├── AppleButton.tsx
│   ├── GoogleButton.tsx
│   ├── EmailButton.tsx
│   ├── GuestLink.tsx
│   └── DevSkipButton.tsx      # only renders if __DEV__
└── ui/
    └── LegalText.tsx          # CGU + Privacy with inline links
```

Each component must be:
- Strongly typed (no `any`)
- Theme-aware (reads from a `useTheme()` hook returning `'dark' | 'light'`)
- Accessible (use `accessibilityLabel`, `accessibilityRole="button"` on all CTAs)
- Testable (export named, no default exports for components that have logic)

---

## Theme Detection

Use `useColorScheme()` from `react-native` to detect the system theme. Tanren's default is dark mode, so if the system theme is `null` or `undefined`, fall back to `'dark'`.

```typescript
const systemTheme = useColorScheme();
const theme = systemTheme ?? 'dark';
```

Do NOT add a manual theme switcher on this screen. Theme respects system preference only.

---

## Accessibility Requirements

- All buttons must have `accessibilityLabel` (in French) and `accessibilityRole="button"`
- The kanji watermark and background grid must have `accessibilityElementsHidden={true}` and `importantForAccessibility="no-hide-descendants"` (decorative only)
- Color contrast: text on red button must pass WCAG AA (4.5:1 minimum) — verify with a contrast checker
- Touch targets: minimum 44×44 pt (Apple HIG) — buttons are 52pt, comfortable
- Test with VoiceOver (iOS) and TalkBack (Android) before considering complete

---

## Performance Constraints

- The screen must mount in under 200ms on iPhone 12
- The pulse animation must NOT cause re-renders of other components — use Reanimated worklets exclusively
- The kanji watermark, despite being 320px font-size, must not cause layout shift — render it absolutely positioned with fixed dimensions
- Lazy-load the email signin screen (it's behind a route, not part of this bundle)

---

## What NOT to do

- Do NOT use emojis anywhere in the UI (brand rule)
- Do NOT add a "Sign up" link separate from "Sign in" — OAuth providers handle both flows automatically; the email flow handles signup on its own dedicated screen
- Do NOT add social proof, testimonials, or marketing copy on this screen — it's a login screen, not a landing page
- Do NOT use rounded corners > 4px on buttons (brand rule: brutalist)
- Do NOT add gradients on the primary background (brand rule: pure black or pure white)
- Do NOT use any color outside the palette defined above
- Do NOT use any font other than Barlow Condensed and Noto Serif JP
- Do NOT add a "Forgot password" link on this screen — that's part of the email signin flow on a separate screen

---

## Validation Checklist

Before considering this complete, verify:

- [ ] All copy comes from i18n, no hardcoded strings
- [ ] Both dark and light modes render correctly (test with system theme switch)
- [ ] Forge-spark mark renders sharp at all densities (1x, 2x, 3x)
- [ ] Kanji watermark is visible but unobtrusive (4–5% opacity, never blocks taps)
- [ ] Background grid is visible but secondary
- [ ] All 5 CTAs are tappable with no overlap
- [ ] DEV button is invisible in production builds (`__DEV__` check)
- [ ] Apple OAuth flow completes successfully (test on real iOS device — simulator may have issues with Apple Sign-In)
- [ ] Google OAuth flow completes successfully
- [ ] Pulse animation runs at 60fps (verify with React DevTools Profiler or Flipper)
- [ ] Mount fade-in is smooth, no flicker
- [ ] VoiceOver reads the screen correctly: wordmark → baseline → CTAs in order
- [ ] French apostrophes use the curly form `'` (U+2019), not straight `'` — especially in `"l'autre"` and `"l'invité"`
- [ ] Tutoiement is consistent — no `vous` anywhere
- [ ] Status bar style adapts to mode (`light-content` on dark mode, `dark-content` on light mode)
- [ ] On Android, the system back button on the login screen does nothing (or exits the app) — never goes to a "previous" screen
- [ ] Component file is under 300 lines (split into sub-components if needed)
- [ ] No console warnings, no console errors
- [ ] TypeScript strict mode passes with zero errors

---

## Reference Mockup

A visual reference mockup exists at `/docs/design/Tanren_Login.html` (open in browser). It shows the exact final rendering in both dark and light modes side by side. Match this rendering pixel-for-pixel within reasonable tolerance for cross-platform native rendering.

---

## Deliverables

When done, provide:

1. The complete `app/(auth)/login.tsx` file
2. All sub-components in `components/brand/` and `components/auth/`
3. Updated `i18n/locales/fr.json` with the new keys
4. Updated `theme/colors.ts` and `theme/typography.ts` if tokens were missing
5. Updated `app/_layout.tsx` if font loading was missing
6. A summary of any architectural decisions you made (e.g., "I chose StyleSheet over NativeWind because the existing project uses StyleSheet")
7. A list of what was NOT implemented and why (e.g., "Apple OAuth requires native config in `ios/Tanren/Info.plist` and a Service ID in the Apple Developer portal — I scaffolded the hook but you must complete the native setup yourself")

---

*Tanren · 鍛錬 · Une rep après l'autre.*
