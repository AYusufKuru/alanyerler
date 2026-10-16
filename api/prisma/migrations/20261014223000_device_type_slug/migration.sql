-- AlterTable
ALTER TABLE "device_types" ADD COLUMN "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "device_types_slug_key" ON "device_types"("slug");
