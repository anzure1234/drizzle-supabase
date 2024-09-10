DO $$ BEGIN
 CREATE TYPE "public"."role_enum" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_table" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "hashed_password" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "role" "role_enum" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_username_unique" UNIQUE("username");