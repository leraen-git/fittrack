import { router } from './trpc.js'
import { usersRouter } from './routers/users.js'
import { workoutsRouter } from './routers/workouts.js'
import { sessionsRouter } from './routers/sessions.js'
import { exercisesRouter } from './routers/exercises.js'
import { progressRouter } from './routers/progress.js'
import { programsRouter } from './routers/programs.js'

export const appRouter = router({
  users: usersRouter,
  workouts: workoutsRouter,
  sessions: sessionsRouter,
  exercises: exercisesRouter,
  progress: progressRouter,
  programs: programsRouter,
})

export type AppRouter = typeof appRouter
