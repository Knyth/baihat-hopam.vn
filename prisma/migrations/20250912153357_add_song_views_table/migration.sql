-- CreateTable
CREATE TABLE "public"."song_views" (
    "id" SERIAL NOT NULL,
    "song_id" INTEGER NOT NULL,
    "fingerprint" VARCHAR(64) NOT NULL,
    "bucket_start" TIMESTAMP(3) NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "song_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "song_views_viewed_at_idx" ON "public"."song_views"("viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "song_views_song_id_fingerprint_bucket_start_key" ON "public"."song_views"("song_id", "fingerprint", "bucket_start");

-- AddForeignKey
ALTER TABLE "public"."song_views" ADD CONSTRAINT "song_views_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
