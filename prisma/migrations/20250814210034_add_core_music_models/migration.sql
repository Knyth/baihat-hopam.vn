-- CreateTable
CREATE TABLE "public"."Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lyrics_chords" TEXT NOT NULL,
    "original_key" TEXT,
    "rhythm" TEXT,
    "tempo" INTEGER,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "composer_id" INTEGER,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Composer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Composer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SongArtist" (
    "song_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "SongArtist_pkey" PRIMARY KEY ("song_id","artist_id")
);

-- CreateTable
CREATE TABLE "public"."SongGenre" (
    "song_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "SongGenre_pkey" PRIMARY KEY ("song_id","genre_id")
);

-- CreateTable
CREATE TABLE "public"."UserFavorite" (
    "user_id" TEXT NOT NULL,
    "song_id" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("user_id","song_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "public"."Song"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "public"."Artist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "public"."Artist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Composer_name_key" ON "public"."Composer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Composer_slug_key" ON "public"."Composer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "public"."Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "public"."Genre"("slug");

-- AddForeignKey
ALTER TABLE "public"."Song" ADD CONSTRAINT "Song_composer_id_fkey" FOREIGN KEY ("composer_id") REFERENCES "public"."Composer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Song" ADD CONSTRAINT "Song_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongArtist" ADD CONSTRAINT "SongArtist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongArtist" ADD CONSTRAINT "SongArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongGenre" ADD CONSTRAINT "SongGenre_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongGenre" ADD CONSTRAINT "SongGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavorite" ADD CONSTRAINT "UserFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavorite" ADD CONSTRAINT "UserFavorite_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
