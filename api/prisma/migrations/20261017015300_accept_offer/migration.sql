ALTER TYPE "ListingStatus" ADD VALUE 'kabul';

ALTER TABLE "listings" ADD COLUMN "accepted_offer_id" TEXT;

CREATE UNIQUE INDEX "listings_accepted_offer_id_key" ON "listings"("accepted_offer_id");

ALTER TABLE "listings" ADD CONSTRAINT "listings_accepted_offer_id_fkey" FOREIGN KEY ("accepted_offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
