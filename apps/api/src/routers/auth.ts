import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { SignJWT, jwtVerify, createRemoteJWKSet } from 'jose'
import { router, publicProcedure } from '../trpc.js'
import { users } from '../db/schema.js'

const isDev = process.env['NODE_ENV'] === 'development'
const JWT_SECRET_RAW = process.env['JWT_SECRET']
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW ?? 'dev-secret-change-in-production')

// Apple's public key set — fetched once and cached automatically by jose
const APPLE_JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'))
const APPLE_BUNDLE_ID = 'com.fittrack.app'

/** Sign a 30-day JWT containing the internal user UUID as `sub`. */
async function signToken(internalUserId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(internalUserId)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)
}

export const authRouter = router({
  /**
   * Sign in / sign up with an Apple Identity Token.
   * The mobile app calls expo-apple-authentication, gets identityToken,
   * and sends it here for server-side verification.
   * Returns a signed JWT and the user record.
   */
  signInWithApple: publicProcedure
    .input(z.object({
      identityToken: z.string(),
      fullName: z.string().nullable().optional(),
      email: z.string().email().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let appleUserId: string
      let appleEmail: string | null = null

      try {
        const { payload } = await jwtVerify(input.identityToken, APPLE_JWKS, {
          issuer: 'https://appleid.apple.com',
          audience: APPLE_BUNDLE_ID,
        })
        appleUserId = payload.sub as string
        appleEmail = (payload.email as string | undefined) ?? null
      } catch (err) {
        ctx.req.log.warn({ event: 'auth_failure', provider: 'apple', err }, 'Apple token invalid')
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid Apple identity token' })
      }

      // Apple only sends email on first sign-in — use the one from the JWT payload
      // or fall back to the input if provided by the client
      const email = appleEmail ?? input.email ?? null

      // Find or create the user
      let [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.authId, appleUserId))
        .limit(1)

      if (!user) {
        const name =
          input.fullName?.trim() ||
          email?.split('@')[0] ||
          'Athlete'

        const [created] = await ctx.db.insert(users).values({
          authId: appleUserId,
          name,
          email: email ?? `${appleUserId}@apple.id`,
        }).returning()
        user = created!
        ctx.req.log.info({ event: 'user_created', userId: user.id, provider: 'apple' }, 'New user signed up')
      }

      const token = await signToken(user.id)
      ctx.req.log.info({ event: 'auth_success', userId: user.id, provider: 'apple' }, 'User signed in')
      return { token, user }
    }),

  /**
   * Dev-only: sign in as any existing user by internal UUID.
   * Only works when NODE_ENV=development. Never callable in production.
   */
  devSignIn: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!isDev) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Dev sign-in is not available in production' })
      }
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1)
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      const token = await signToken(user.id)
      return { token, user }
    }),

  /**
   * Verify the current token is still valid and return the user.
   * Used on app launch to restore session without re-authenticating.
   */
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .limit(1)
    return user ?? null
  }),
})
