// src/app/api/songs/trending/route.js

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const trendingSongs = await prisma.song.findMany({
      orderBy: {
        views: 'desc', // Sắp xếp theo lượt xem, cao nhất lên đầu
      },
      take: 5, // Lấy 5 bài hát thịnh hành nhất
      include: {
        composer: {
          select: { name: true },
        },
        artists: {
          select: {
            artist: {
              select: { name: true },
            },
          },
        },
      },
    });

    const formattedSongs = trendingSongs.map(song => ({
      ...song,
      artists: song.artists.map(sa => sa.artist)
    }));
    
    return NextResponse.json(formattedSongs);

  } catch (error) {
    console.error("Error fetching trending songs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}