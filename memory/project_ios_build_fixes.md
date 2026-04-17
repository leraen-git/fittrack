---
name: iOS build fixes and known issues
description: All fixes applied to get npx expo run:ios working, with root causes and what survives reinstalls
type: project
---
All issues encountered and resolved to get the iOS simulator build working.

---

## 1. expo-router entry point not found
**Error:** `Unable to resolve "../../App" from "node_modules/expo/AppEntry.js"`
**Fix:** Added `"entryPoint": "../../node_modules/expo-router/entry"` to `apps/mobile/app.json`
**Survives:** Everything

---

## 2. react-native-music-control null crash (Expo Go)
**Error:** `TypeError: Cannot read property 'STATE_PLAYING' of null`
**Fix:** Changed `musicService.ts` to lazy `require()` inside try/catch
**Survives:** Everything. Music controls only work in dev build (`npx expo run:ios`), not Expo Go.

---

## 3. Corrupt PNG assets
**Fix:** Regenerated all assets as valid RGBA PNGs (icon, splash, adaptive-icon, notification-icon)

---

## 4. fmt pod C++20 consteval error (Xcode 26+)
**Error:** `call to consteval function ... is not a constant expression` in `fmt/format-inl.h`
**Cause:** fmt library uses FMT_COMPILE_STRING which is invalid under Xcode 26's Apple Clang
**Fix:** Podfile post_install hook patches `Pods/fmt/include/fmt/base.h` to add `__apple_build_version__ >= 17000000L` check that disables consteval. Also sets `File.chmod(0644)` to handle read-only permissions.
**IMPORTANT:** `npx expo prebuild --clean` wipes the Podfile. After any prebuild --clean, must re-add the fmt fix block and re-run `pod install`.

---

## 5. ReactCodegen script — paths with spaces (patch-package fix)
**Fix:** `patches/react-native+0.79.6.patch` committed to repo, auto-applies via `postinstall: patch-package`

---

## 6. EXConstants script — paths with spaces (patch-package fix)
**Fix:** `patches/expo-constants+17.1.8.patch` committed to repo, auto-applies via `postinstall: patch-package`

---

## 7. Bundle React Native script — paths with spaces (config plugin fix)
**Fix:** `apps/mobile/plugins/withFixSpacesInPath.js` — Expo config plugin registered in `app.json`

---

## Launch command
```bash
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile && npx expo run:ios
```

## If prebuild --clean is ever needed
```bash
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile && npx expo prebuild --clean
# Re-add fmt fix to ios/Podfile post_install (see fix #4 above)
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile/ios && pod install
cd /Users/ramy/Documents/AppClaude/Tanren/apps/mobile && npx expo run:ios
```
Note: fixes 5/6/7 re-apply automatically (patch-package postinstall + config plugin).
Only fix #4 (fmt Podfile) needs to be re-added manually after prebuild --clean.
