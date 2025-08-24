-- DropForeignKey
ALTER TABLE "public"."SongArtist" DROP CONSTRAINT "SongArtist_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SongArtist" DROP CONSTRAINT "SongArtist_song_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SongGenre" DROP CONSTRAINT "SongGenre_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SongGenre" DROP CONSTRAINT "SongGenre_song_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserFavorite" DROP CONSTRAINT "UserFavorite_song_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserFavorite" DROP CONSTRAINT "UserFavorite_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Artist" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Composer" ADD COLUMN     "search_name" TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Song" ALTER COLUMN "title" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."SongGenre" ADD CONSTRAINT "SongGenre_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongGenre" ADD CONSTRAINT "SongGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongArtist" ADD CONSTRAINT "SongArtist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongArtist" ADD CONSTRAINT "SongArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavorite" ADD CONSTRAINT "UserFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavorite" ADD CONSTRAINT "UserFavorite_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
