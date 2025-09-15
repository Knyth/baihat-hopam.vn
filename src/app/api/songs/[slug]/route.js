// src/app/api/songs/[slug]/route.js
// GET chi tiết 1 bài hát theo slug (Next 15: PHẢI await params)

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  // ✅ Next 15: params là Promise → phải await trước khi dùng
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const song = await prisma.song.findUnique({
      where: { slug },
      // ⚠️ Dùng field camelCase theo Prisma model (DB cột snake_case đã map qua @map)
      select: {
        id: true,
        title: true,
        slug: true,
        lyricsChords: true,
        originalKey: true,
        rhythm: true,
        tempo: true,
        views: true,
        createdAt: true,
        composer: {
          select: { name: true, slug: true },
        },
        artists: {
          select: {
            artist: { select: { name: true, slug: true } },
          },
        },
        genres: {
          select: {
            genre: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    // Chuẩn hoá mảng artists / genres để FE dùng dễ hơn
    const formatted = {
      ...song,
      artists: song.artists.map((a) => a.artist),
      genres: song.genres.map((g) => g.genre),
    };

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(`Failed to fetch song with slug: ${slug}`, err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
