CREATE TYPE "SaleStep" AS ENUM ('teslimat', 'inceleme', 'odeme', 'tamam');

ALTER TABLE "listings" ADD COLUMN "sale_step" "SaleStep";

UPDATE "listings" SET "sale_step" = 'teslimat' WHERE "status" = 'kabul';
