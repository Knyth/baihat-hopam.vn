// src/app/api/songs/newest/route.js

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const newestSongs = await prisma.song.findMany({
      orderBy: {
        created_at: 'desc', // Sắp xếp theo ngày tạo, mới nhất lên đầu
      },
      take: 10, // Lấy 10 bài hát mới nhất
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

    // Xử lý lại dữ liệu artists cho gọn
    const formattedSongs = newestSongs.map(song => ({
      ...song,
      artists: song.artists.map(sa => sa.artist)
    }));
    
    return NextResponse.json(formattedSongs);

  } catch (error) {
    console.error("Error fetching newest songs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}