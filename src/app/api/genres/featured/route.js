// src/app/api/genres/featured/route.js

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Trong tương lai, ta có thể thêm một trường 'featured' vào model Genre
    // Tạm thời, ta sẽ lấy một danh sách các thể loại phổ biến theo cách thủ công
    const popularGenres = [
      'V-Pop', 'Ballad', 'Rock Việt', 'Nhạc Trịnh', 'Acoustic', 'Nhạc Vàng'
    ];

    const genres = await prisma.genre.findMany({
      where: {
        name: {
          in: popularGenres,
        },
      },
      select: {
        name: true,
        slug: true,
      }
    });
    
    return NextResponse.json(genres);

  } catch (error) {
    console.error("Error fetching featured genres:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}