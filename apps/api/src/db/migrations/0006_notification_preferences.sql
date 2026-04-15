CREATE TABLE "notification_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"workout_enabled" boolean DEFAULT false NOT NULL,
	"workout_time" text DEFAULT '18:00' NOT NULL,
	"workout_offset" integer DEFAULT 30 NOT NULL,
	"workout_days" jsonb DEFAULT '[1,3,5]'::jsonb NOT NULL,
	"breakfast_enabled" boolean DEFAULT false NOT NULL,
	"breakfast_time" text DEFAULT '08:00' NOT NULL,
	"lunch_enabled" boolean DEFAULT false NOT NULL,
	"lunch_time" text DEFAULT '12:30' NOT NULL,
	"snack_enabled" boolean DEFAULT false NOT NULL,
	"snack_time" text DEFAULT '16:00' NOT NULL,
	"dinner_enabled" boolean DEFAULT false NOT NULL,
	"dinner_time" text DEFAULT '20:00' NOT NULL,
	"hydration_enabled" boolean DEFAULT false NOT NULL,
	"hydration_interval" integer DEFAULT 90 NOT NULL,
	"hydration_active_from" text DEFAULT '07:00' NOT NULL,
	"hydration_active_to" text DEFAULT '22:00' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
