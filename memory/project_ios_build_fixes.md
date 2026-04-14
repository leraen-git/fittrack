---
name: iOS build fixes and known issues
description: All fixes applied to get npx expo run:ios working, with root causes and what survives reinstalls
type: project
originSessionId: 3edd2e77-56f9-4e78-9448-a973558947cc
---
All issues encountered and resolved to get the iOS simulator build working (as of 2026-04-14, commits 4a97dc2 / c9e24a1 / 43e912a).

---

## 1. expo-router entry point not found
**Error:** `Unable to resolve "../../App" from "node_modules/expo/AppEntry.js"`
**Cause:** npm workspaces hoisted `expo-router` to root `node_modules/`; Expo CLI couldn't resolve `"main": "expo-router/entry"` from `apps/mobile/`
**Fix:** Added `"entryPoint": "../../node_modules/expo-router/entry"` to `apps/mobile/app.json`
**Survives:** Everything

---

## 2. react-native-music-control null crash (Expo Go)
**Error:** `TypeError: Cannot read property 'STATE_PLAYING' of null`
**Cause:** Native module returns null in Expo Go; static import crashed the whole module, preventing _layout.tsx from loading and ThemeProvider from mounting
**Fix:** Changed `musicService.ts` to lazy `require()` inside try/catch; all functions no-op if native module absent
**File:** `apps/mobile/src/services/musicService.ts`
**Survives:** Everything. Music controls only work in a real dev build (`npx expo run:ios`), not Expo Go.

---

## 3. Missing scheme warning
**Error:** Linking warning about missing `scheme`
**Fix:** Added `"scheme": "fittrack"` to `apps/mobile/app.json`

---

## 4. Corrupt PNG assets
**Error:** `Crc error` during prebuild (jimp fails to parse 1×1 placeholder PNGs with hardcoded CRC 0x1)
**Fix:** Regenerated all assets as valid RGBA PNGs using Python:
- `assets/icon.png` — 1024×1024 dark `#0E0E0E`
- `assets/adaptive-icon.png` — 1024×1024 dark `#0E0E0E`
- `assets/splash.png` — 1284×2778 dark `#0E0E0E`
- `assets/notification-icon.png` — 96×96 white (Android requirement)

---

## 5. fmt pod C++20 consteval error
**Error:** `call to consteval function ... is not a constant expression` in `fmt/format-inl.h`
**Cause:** fmt library uses FMT_COMPILE_STRING which is invalid under C++20 with newer Clang/Xcode 26
**Fix:** Added post_install hook in `apps/mobile/ios/Podfile` — forces C++17 on the `fmt` target only (not all pods, which would break RN's use of C++20 `contains()`)
**IMPORTANT:** `npx expo prebuild --clean` wipes the Podfile and removes this fix. After any `prebuild --clean`, must re-add this block and re-run `pod install`:
```ruby
installer.pods_project.targets.each do |target|
  if target.name == 'fmt'
    target.build_configurations.each do |cfg|
      cfg.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
    end
  end
end
```

---

## 6. ReactCodegen script — paths with spaces (patch-package fix)
**Error:** `/bin/sh: /Users/ramy/Documents/App: No such file or directory` — `Command PhaseScriptExecution failed` on ReactCodegen target
**Cause:** Three files in react-native 0.79.6 pass script paths unquoted to the shell:
1. `script_phases.rb:47` — `/bin/sh -c "$WITH_ENVIRONMENT $SCRIPT_PHASES_SCRIPT"` (unquoted)
2. `generate-artifacts-executor.js:1034` — same pattern
3. `with-environment.sh:46` — executes `$1` unquoted ← **actual crash point**
**Fix:** All three patched via `patch-package`:
- `patches/react-native+0.79.6.patch` committed to repo
- `"postinstall": "patch-package"` in root `package.json` auto-applies on every `npm install`

---

## 7. EXConstants script — paths with spaces (patch-package fix)
**Error:** `PhaseScriptExecution [CP-User] Generate app.config for prebuilt Constants.manifest` failed
**Cause:** `expo-constants/ios/EXConstants.podspec:39` used `bash -l -c "$PODS_TARGET_SRCROOT/..."` — unquoted variable, word-split on spaces
**Fix:** Patched podspec to `bash -l "${PODS_TARGET_SRCROOT}/..."` (removes `-c`, quotes variable)
- `patches/expo-constants+17.1.8.patch` committed to repo
- Auto-applies via `postinstall: patch-package`

---

## 8. Bundle React Native script — paths with spaces (config plugin fix)
**Error:** `PhaseScriptExecution Bundle React Native code and images` failed
**Cause:** `FitTrack.xcodeproj/project.pbxproj` script phase used unquoted backtick execution:
`` `"$NODE_BINARY" --print "...react-native-xcode.sh"` `` — output path word-split on spaces
**Fix:**
- Direct fix in `apps/mobile/ios/FitTrack.xcodeproj/project.pbxproj` (immediate)
- `apps/mobile/plugins/withFixSpacesInPath.js` — Expo config plugin registered in `app.json` that re-applies the fix after every `expo prebuild --clean`
- Changes backtick to `"$(...)"` so the result is quoted

---

## Summary: all 3 space-in-path fixes
The root cause of fixes 6/7/8 is the same: the project path `/Users/ramy/Documents/App Claude/fittrack` contains a space ("App Claude") and react-native/expo scripts don't quote paths properly.

Three separate script phases each needed their own fix:
| Script phase | Fixed by |
|---|---|
| ReactCodegen | `patches/react-native+0.79.6.patch` |
| EXConstants Generate app.config | `patches/expo-constants+17.1.8.patch` |
| Bundle React Native code and images | `plugins/withFixSpacesInPath.js` + direct pbxproj edit |

---

## Launch command
```bash
cd "/Users/ramy/Documents/App Claude/fittrack/apps/mobile" && npx expo run:ios
```

## If prebuild --clean is ever needed
```bash
cd "/Users/ramy/Documents/App Claude/fittrack/apps/mobile" && npx expo prebuild --platform ios --clean
# Re-add fmt fix to ios/Podfile (see fix #5 above)
cd "/Users/ramy/Documents/App Claude/fittrack/apps/mobile/ios" && pod install
cd "/Users/ramy/Documents/App Claude/fittrack/apps/mobile" && npx expo run:ios
```
Note: fixes 6/7/8 re-apply automatically (patch-package postinstall + config plugin).
Only fix #5 (fmt Podfile) needs to be re-added manually after prebuild --clean.
