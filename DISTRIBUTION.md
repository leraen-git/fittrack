# FitTrack — Distribution Guide (Share with Friends on iPhone)

Two paths depending on how many people and how much setup you want.

---

## Option A — TestFlight
**Best for:** more than 3–4 friends, polished experience  
**Cost:** $99/year Apple Developer account  
**Limit:** up to 10,000 testers

### Prerequisites
- Apple Developer account → [developer.apple.com](https://developer.apple.com)
- Xcode (already installed)
- App Store Connect access → [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

---

### Step 1 — Register the bundle identifier

1. Go to [developer.apple.com](https://developer.apple.com) → **Account** → **Certificates, Identifiers & Profiles**
2. Click **Identifiers** → **+**
3. Select **App IDs** → **App** → Continue
4. Description: `FitTrack`
5. Bundle ID (Explicit): `com.fittrack.app`
6. Click **Register**

---

### Step 2 — Create a Release build archive

```bash
cd /Users/ramy/fittrack/apps/mobile && npx expo run:ios --configuration Release
```

Once the app builds and launches in the simulator, switch to Xcode:

1. Open `/Users/ramy/fittrack/apps/mobile/ios/FitTrack.xcworkspace` in Xcode
2. In the top toolbar, set the target device to **Any iOS Device (arm64)** (not a simulator)
3. Menu → **Product → Archive**
4. Wait for the archive to complete — the **Organizer** window opens automatically

---

### Step 3 — Upload to App Store Connect

In the Organizer:

1. Select your archive → click **Distribute App**
2. Choose **TestFlight & App Store** → Next
3. Leave all defaults → Next
4. Click **Upload**
5. Wait ~5–10 minutes for Apple to process it (you'll get an email)

---

### Step 4 — Invite your friends

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Select **FitTrack** → **TestFlight** tab
3. Under **Internal Testing** → click **+** next to Testers
4. Enter your friends' Apple ID email addresses
5. They receive an email with a link → they install the **TestFlight** app from the App Store → tap the invite link → install FitTrack

---

## Option B — EAS Ad-hoc (Free)
**Best for:** 2–3 friends quickly, no $99 fee  
**Cost:** Free (requires free Expo account)  
**Limit:** 100 registered devices

---

### Step 1 — Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2 — Log in to Expo

```bash
eas login
```

### Step 3 — Configure EAS in the project

```bash
cd /Users/ramy/fittrack/apps/mobile && eas build:configure
```

This creates `eas.json`. Add a `preview` profile to it:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    }
  }
}
```

### Step 4 — Get your friends' UDIDs

Each friend needs to:
1. Connect their iPhone to a Mac with a USB cable
2. Open **Finder** → click their device in the sidebar
3. Click the device model name (under the device name) once — it cycles through Serial Number → UDID
4. Right-click the UDID → **Copy**
5. Send you that string (looks like: `00008110-000A1234B5678901`)

### Step 5 — Register their devices

```bash
eas device:create
```

Follow the prompts and enter each UDID. Or register via browser:
1. [developer.apple.com](https://developer.apple.com) → **Devices** → **+**
2. Platform: **iOS** → enter name + UDID → Register

### Step 6 — Build the ad-hoc IPA

```bash
cd /Users/ramy/fittrack/apps/mobile && eas build --platform ios --profile preview
```

EAS builds in the cloud (~10–15 min). When done it gives you:
- A **download URL** for the `.ipa`
- A **QR code** your friends scan on their iPhone in Safari to install directly

---

## Quick Comparison

| | TestFlight | EAS Ad-hoc |
|---|---|---|
| Cost | $99/yr | Free |
| Max testers | 10,000 | 100 devices |
| Setup time | ~30 min | ~15 min |
| Friend setup | Install TestFlight app | Open link in Safari |
| Requires UDID | No | Yes |
| Expiry | 90 days per build | 1 year |

---

## Troubleshooting

**"No provisioning profile" error during archive**
- Make sure `com.fittrack.app` is registered in your Apple Developer account (Step 1)
- In Xcode: **FitTrack target → Signing & Capabilities → Automatically manage signing** ✓
- Select your Apple Developer team from the dropdown

**Friend says "Unable to install" (ad-hoc)**
- Their UDID wasn't registered before the build — register it and rebuild

**TestFlight invite email not received**
- Check spam folder
- They must have an Apple ID matching the email address you invited

**Build expires (TestFlight)**
- TestFlight builds expire after 90 days — upload a new archive
