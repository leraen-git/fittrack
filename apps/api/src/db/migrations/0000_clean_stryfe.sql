CREATE TYPE "public"."difficulty" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');--> statement-breakpoint
CREATE TYPE "public"."user_goal" AS ENUM('WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE');--> statement-breakpoint
CREATE TYPE "public"."user_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');--> statement-breakpoint
CREATE TABLE "exercise_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"session_exercise_id" text NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"weight" real DEFAULT 0 NOT NULL,
	"rest_seconds" integer DEFAULT 90 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"muscle_groups" text[] DEFAULT '{}' NOT NULL,
	"equipment" text[] DEFAULT '{}' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"video_url" text,
	"image_url" text,
	"difficulty" "difficulty" DEFAULT 'BEGINNER' NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "personal_records" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"weight" real NOT NULL,
	"reps" integer NOT NULL,
	"volume" real NOT NULL,
	"achieved_at" timestamp DEFAULT now() NOT NULL,
	"session_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"program_id" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"current_week" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"level" "user_level" NOT NULL,
	"goal" "user_goal" NOT NULL,
	"duration_weeks" integer NOT NULL,
	"sessions_per_week" integer NOT NULL,
	"image_url" text,
	"is_official" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_session_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"level" "user_level" DEFAULT 'BEGINNER' NOT NULL,
	"goal" "user_goal" DEFAULT 'MUSCLE_GAIN' NOT NULL,
	"weekly_target" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_template_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"default_sets" integer DEFAULT 3 NOT NULL,
	"default_reps" integer DEFAULT 10 NOT NULL,
	"default_weight" real DEFAULT 0 NOT NULL,
	"default_rest_seconds" integer DEFAULT 90 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"workout_template_id" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"total_volume" real DEFAULT 0 NOT NULL,
	"notes" text,
	"perceived_exertion" integer
);
--> statement-breakpoint
CREATE TABLE "workout_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"muscle_groups" text[] DEFAULT '{}' NOT NULL,
	"estimated_duration" integer DEFAULT 60 NOT NULL,
	"is_template" boolean DEFAULT true NOT NULL,
	"is_program_workout" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_sets" ADD CONSTRAINT "exercise_sets_session_exercise_id_session_exercises_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_session_id_workout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_workout_session_id_workout_sessions_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_template_id_workout_templates_id_fk" FOREIGN KEY ("workout_template_id") REFERENCES "public"."workout_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_workout_template_id_workout_templates_id_fk" FOREIGN KEY ("workout_template_id") REFERENCES "public"."workout_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_templates" ADD CONSTRAINT "workout_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;