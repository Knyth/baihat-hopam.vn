-- AlterTable
ALTER TABLE "public"."composers" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."genres" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "composers_featured_name_idx" ON "public"."composers"("featured", "name");

-- CreateIndex
CREATE INDEX "genres_featured_name_idx" ON "public"."genres"("featured", "name");
