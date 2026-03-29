import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userLevelEnum = pgEnum('user_level', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const userGoalEnum = pgEnum('user_goal', ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE'])
export const difficultyEnum = pgEnum('difficulty', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerk_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  avatarUrl: text('avatar_url'),
  level: userLevelEnum('level').notNull().default('BEGINNER'),
  goal: userGoalEnum('goal').notNull().default('MUSCLE_GAIN'),
  weeklyTarget: integer('weekly_target').notNull().default(3),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Exercises ────────────────────────────────────────────────────────────────

export const exercises = pgTable('exercises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  muscleGroups: text('muscle_groups').array().notNull().default([]),
  equipment: text('equipment').array().notNull().default([]),
  description: text('description').notNull().default(''),
  videoUrl: text('video_url'),
  imageUrl: text('image_url'),
  difficulty: difficultyEnum('difficulty').notNull().default('BEGINNER'),
  isCustom: boolean('is_custom').notNull().default(false),
  userId: text('user_id').references(() => users.id),
})

// ─── Workout Templates ────────────────────────────────────────────────────────

export const workoutTemplates = pgTable('workout_templates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  muscleGroups: text('muscle_groups').array().notNull().default([]),
  estimatedDuration: integer('estimated_duration').notNull().default(60),
  isTemplate: boolean('is_template').notNull().default(true),
  isProgramWorkout: boolean('is_program_workout').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Workout Exercises ────────────────────────────────────────────────────────

export const workoutExercises = pgTable('workout_exercises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workoutTemplateId: text('workout_template_id').notNull().references(() => workoutTemplates.id),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  order: integer('order').notNull().default(0),
  defaultSets: integer('default_sets').notNull().default(3),
  defaultReps: integer('default_reps').notNull().default(10),
  defaultWeight: real('default_weight').notNull().default(0),
  defaultRestSeconds: integer('default_rest_seconds').notNull().default(90),
  notes: text('notes'),
})

// ─── Workout Sessions ─────────────────────────────────────────────────────────

export const workoutSessions = pgTable('workout_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  workoutTemplateId: text('workout_template_id').notNull().references(() => workoutTemplates.id),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  totalVolume: real('total_volume').notNull().default(0),
  notes: text('notes'),
  perceivedExertion: integer('perceived_exertion'),
})

// ─── Session Exercises ────────────────────────────────────────────────────────

export const sessionExercises = pgTable('session_exercises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workoutSessionId: text('workout_session_id').notNull().references(() => workoutSessions.id),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  order: integer('order').notNull().default(0),
})

// ─── Exercise Sets ────────────────────────────────────────────────────────────

export const exerciseSets = pgTable('exercise_sets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionExerciseId: text('session_exercise_id').notNull().references(() => sessionExercises.id),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull().default(0),
  weight: real('weight').notNull().default(0),
  restSeconds: integer('rest_seconds').notNull().default(90),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
})

// ─── Programs ─────────────────────────────────────────────────────────────────

export const programs = pgTable('programs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  level: userLevelEnum('level').notNull(),
  goal: userGoalEnum('goal').notNull(),
  durationWeeks: integer('duration_weeks').notNull(),
  sessionsPerWeek: integer('sessions_per_week').notNull(),
  imageUrl: text('image_url'),
  isOfficial: boolean('is_official').notNull().default(false),
})

// ─── Program Enrollments ──────────────────────────────────────────────────────

export const programEnrollments = pgTable('program_enrollments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  programId: text('program_id').notNull().references(() => programs.id),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  currentWeek: integer('current_week').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
})

// ─── Personal Records ─────────────────────────────────────────────────────────

export const personalRecords = pgTable('personal_records', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  weight: real('weight').notNull(),
  reps: integer('reps').notNull(),
  volume: real('volume').notNull(),
  achievedAt: timestamp('achieved_at').notNull().defaultNow(),
  sessionId: text('session_id').notNull().references(() => workoutSessions.id),
})
