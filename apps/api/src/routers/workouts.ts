import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { router, protectedProcedure } from '../trpc.js'
import { workoutTemplates, workoutExercises, users } from '../db/schema.js'

export const workoutsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId)).limit(1)
    if (!user) throw new Error('User not found')
    return ctx.db.select().from(workoutTemplates).where(eq(workoutTemplates.userId, user.id))
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        muscleGroups: z.array(z.string()).default([]),
        estimatedDuration: z.number().int().default(60),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId)).limit(1)
      if (!user) throw new Error('User not found')
      const [created] = await ctx.db
        .insert(workoutTemplates)
        .values({ ...input, userId: user.id })
        .returning()
      return created
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId)).limit(1)
      if (!user) throw new Error('User not found')
      const [workout] = await ctx.db
        .select()
        .from(workoutTemplates)
        .where(and(eq(workoutTemplates.id, input.id), eq(workoutTemplates.userId, user.id)))
        .limit(1)
      if (!workout) throw new Error('Workout not found')
      const exercises = await ctx.db
        .select()
        .from(workoutExercises)
        .where(eq(workoutExercises.workoutTemplateId, input.id))
      return { ...workout, exercises }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        muscleGroups: z.array(z.string()).optional(),
        estimatedDuration: z.number().int().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId)).limit(1)
      if (!user) throw new Error('User not found')
      const { id, ...data } = input
      const [updated] = await ctx.db
        .update(workoutTemplates)
        .set(data)
        .where(and(eq(workoutTemplates.id, id), eq(workoutTemplates.userId, user.id)))
        .returning()
      return updated
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(users).where(eq(users.clerkId, ctx.userId)).limit(1)
      if (!user) throw new Error('User not found')
      await ctx.db
        .delete(workoutTemplates)
        .where(and(eq(workoutTemplates.id, input.id), eq(workoutTemplates.userId, user.id)))
      return { success: true }
    }),
})
