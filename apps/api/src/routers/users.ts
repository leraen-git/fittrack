import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { router, protectedProcedure, publicProcedure } from '../trpc.js'
import { users } from '../db/schema.js'

export const usersRouter = router({
  sync: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
        name: z.string(),
        email: z.string().email(),
        avatarUrl: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(users)
        .where(eq(users.clerkId, input.clerkId))
        .limit(1)

      if (existing[0]) {
        const [updated] = await ctx.db
          .update(users)
          .set({ name: input.name, email: input.email, avatarUrl: input.avatarUrl ?? null, updatedAt: new Date() })
          .where(eq(users.clerkId, input.clerkId))
          .returning()
        return updated
      }

      const [created] = await ctx.db.insert(users).values({
        clerkId: input.clerkId,
        name: input.name,
        email: input.email,
        avatarUrl: input.avatarUrl ?? null,
      }).returning()
      return created
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.userId))
      .limit(1)
    if (!user) throw new Error('User not found')
    return user
  }),

  updateMe: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
        goal: z.enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE']).optional(),
        weeklyTarget: z.number().int().min(1).max(7).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.clerkId, ctx.userId))
        .returning()
      return updated
    }),
})
