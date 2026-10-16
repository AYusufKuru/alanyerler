-- CreateEnum
CREATE TYPE "OfferKind" AS ENUM ('on', 'kesin');

-- AlterTable
ALTER TABLE "stores" ADD COLUMN "arbitrary_drop_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "offers" ADD COLUMN "opened_price" DECIMAL(12,2);
UPDATE "offers" SET "opened_price" = "price";
ALTER TABLE "offers" ALTER COLUMN "opened_price" SET NOT NULL;
ALTER TABLE "offers" ADD COLUMN "kind" "OfferKind" NOT NULL DEFAULT 'on';
ALTER TABLE "offers" ADD COLUMN "drop_reason" TEXT;
