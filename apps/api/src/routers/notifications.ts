import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '../trpc.js'
import { users, notificationPreferences } from '../db/schema.js'

async function resolveUser(db: any, clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
  return user
}

const preferencesSchema = z.object({
  workoutEnabled: z.boolean().optional(),
  workoutTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  workoutOffset: z.union([z.literal(0), z.literal(15), z.literal(30)]).optional(),
  workoutDays: z.array(z.number().int().min(0).max(6)).optional(),

  breakfastEnabled: z.boolean().optional(),
  breakfastTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  lunchEnabled: z.boolean().optional(),
  lunchTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  snackEnabled: z.boolean().optional(),
  snackTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  dinnerEnabled: z.boolean().optional(),
  dinnerTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),

  hydrationEnabled: z.boolean().optional(),
  hydrationInterval: z.union([z.literal(60), z.literal(90), z.literal(120)]).optional(),
  hydrationActiveFrom: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  hydrationActiveTo: z.string().regex(/^\d{2}:\d{2}$/).optional(),
})

export const notificationsRouter = router({
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const user = await resolveUser(ctx.db, ctx.userId!)
    const [prefs] = await ctx.db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, user.id))
      .limit(1)
    return prefs ?? null
  }),

  upsertPreferences: protectedProcedure
    .input(preferencesSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await resolveUser(ctx.db, ctx.userId!)
      const [existing] = await ctx.db
        .select({ id: notificationPreferences.id })
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, user.id))
        .limit(1)

      const data = { ...input, userId: user.id, updatedAt: new Date() }

      if (existing) {
        const [updated] = await ctx.db
          .update(notificationPreferences)
          .set(data)
          .where(eq(notificationPreferences.userId, user.id))
          .returning()
        return updated
      } else {
        const [created] = await ctx.db
          .insert(notificationPreferences)
          .values(data)
          .returning()
        return created
      }
    }),
})
