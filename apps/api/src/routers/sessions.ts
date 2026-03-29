import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '../trpc.js'
import { workoutSessions, sessionExercises, exerciseSets, users } from '../db/schema.js'

async function resolveUser(db: any, clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
  return user
}

export const sessionsRouter = router({
  start: protectedProcedure
    .input(z.object({ workoutTemplateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await resolveUser(ctx.db, ctx.userId)
      const [session] = await ctx.db
        .insert(workoutSessions)
        .values({ userId: user.id, workoutTemplateId: input.workoutTemplateId })
        .returning()
      return session
    }),

  complete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        durationSeconds: z.number().int().min(0),
        totalVolume: z.number().min(0),
        notes: z.string().max(1000).optional(),
        perceivedExertion: z.number().int().min(1).max(10).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await resolveUser(ctx.db, ctx.userId)
      const { id, ...data } = input

      // Verify the session belongs to the authenticated user
      const [existing] = await ctx.db
        .select({ id: workoutSessions.id })
        .from(workoutSessions)
        .where(and(eq(workoutSessions.id, id), eq(workoutSessions.userId, user.id)))
        .limit(1)

      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' })

      const [updated] = await ctx.db
        .update(workoutSessions)
        .set({ ...data, completedAt: new Date() })
        .where(and(eq(workoutSessions.id, id), eq(workoutSessions.userId, user.id)))
        .returning()
      return updated
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await resolveUser(ctx.db, ctx.userId)

      // Ownership check: session must belong to the requesting user
      const [session] = await ctx.db
        .select()
        .from(workoutSessions)
        .where(and(eq(workoutSessions.id, input.id), eq(workoutSessions.userId, user.id)))
        .limit(1)

      if (!session) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' })

      const exercises = await ctx.db
        .select()
        .from(sessionExercises)
        .where(eq(sessionExercises.workoutSessionId, input.id))

      const sets =
        exercises.length > 0
          ? await ctx.db
              .select()
              .from(exerciseSets)
              .where(eq(exerciseSets.sessionExerciseId, exercises[0]!.id))
          : []

      return { ...session, exercises, sets }
    }),

  history: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20), offset: z.number().int().min(0).default(0) }))
    .query(async ({ ctx, input }) => {
      const user = await resolveUser(ctx.db, ctx.userId)
      return ctx.db
        .select()
        .from(workoutSessions)
        .where(eq(workoutSessions.userId, user.id))
        .orderBy(desc(workoutSessions.startedAt))
        .limit(input.limit)
        .offset(input.offset)
    }),
})
