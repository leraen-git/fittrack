# Tanren Deployment & Troubleshooting Runbook

## Branches

- `main` — single source of truth. All development, all deploys.
- No feature branches for now (solo dev). Create one only for risky migrations.

## Standard dev flow

1. All work on `main`
2. `git push origin main` — Railway auto-deploys in ~2 minutes
3. `railway logs --tail` to watch deployment and runtime logs for 60 seconds
4. Test the affected flow end-to-end

## When Railway doesn't auto-deploy

1. Dashboard: Settings > Deployments > Branch = `main`, Auto Deploy = ON
2. Dashboard: Deployments tab > latest attempt and its error
3. If no attempt at all: re-link GitHub app (Service > Source)
4. Manual force deploy: `railway up`

## When iOS build fails (xcodebuild exit 65)

1. Read the EXACT error from Xcode logs
2. After SDK/Xcode upgrades, usually `pod install` is needed:
   ```
   cd apps/mobile/ios && pod install
   ```
3. Still fails: `pod repo update && pod install`
4. Nuclear option (regenerates ios/ scaffold):
   ```
   cd apps/mobile && rm -rf ios/Pods ios/Podfile.lock && npx expo prebuild --clean
   ```

## When a tRPC call fails

All tRPC errors log with `[TRPC_ERROR]` prefix server-side.

1. `railway logs --tail` while triggering the call
2. Look for `[TRPC_ERROR]` lines — contains code, message, stack
3. AI calls: `[ANTHROPIC_ERROR]` or `ai_generation_error` in logs
4. AI response parsing: raw AI text logged for debugging

## Critical environment variables (Railway)

```
ANTHROPIC_API_KEY=sk-ant-...       # required for AI (diet + plans)
DATABASE_URL=postgresql://...       # PostgreSQL
REDIS_URL=redis://...               # sessions, rate limits
NODE_ENV=production
```

Verify with `railway variables`.

## Database access

```
railway connect postgres
railway run psql
```

## Rollback to previous deploy

Railway Dashboard > Deployments tab > find the known-good deploy > ... menu > Redeploy

## Mobile app version bump (cache buster)

When breaking cache shape (tRPC output change, schema migration):

1. Bump `apps/mobile/app.json` version
2. On next install, React Query cache is discarded (stale maxAge)
