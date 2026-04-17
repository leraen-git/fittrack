---
name: App distribution options for iOS
description: How to share Tanren with friends via TestFlight or EAS ad-hoc builds
type: project
---
Two options to share Tanren with friends on iPhone:

**Option 1 — TestFlight** (up to 10,000 testers)
- Requires Apple Developer account ($99/yr)
- Bundle ID: app.tanren
- Archive via Xcode → upload to App Store Connect → invite testers by email
- Best for more than 3–4 friends

**Option 2 — EAS Ad-hoc** (up to 100 devices, free)
- Requires free Expo account + eas-cli
- Requires registering each friend's UDID in Apple account
- EAS builds IPA and provides install link / QR code
- Best for quick sharing with 2–3 people

**Why:** User wants to share the app with friends before any App Store release.
**How to apply:** Recommend TestFlight for scale, EAS ad-hoc for quick/free sharing.
