ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "phone_verified_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "notify_offers" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "notify_messages" BOOLEAN NOT NULL DEFAULT true;
