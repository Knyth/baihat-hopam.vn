// src/app/api/songs/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genreSlugs = searchParams.get('genre')?.split(',');
  // === TIẾP NHẬN YÊU CẦU MỚI: Lấy tham số 'composer' ===
  const composerQuery = searchParams.get('composer');

  const whereClause = {};

  if (genreSlugs && genreSlugs.length > 0 && genreSlugs[0] !== '') {
    whereClause.genres = {
      some: {
        genre: {
          slug: { in: genreSlugs },
        },
      },
    };
  }

  // === THÊM LOGIC LỌC MỚI: Nếu có 'composerQuery' ===
  if (composerQuery) {
    whereClause.composer = {
      // Dùng 'contains' để tìm kiếm không phân biệt chữ hoa/thường (cho PostgreSQL)
      // Nó sẽ tìm bất kỳ tác giả nào có tên CHỨA chuỗi người dùng gõ vào
      name: {
        contains: composerQuery,
        mode: 'insensitive', // Không phân biệt hoa/thường
      },
    };
  }

  try {
    const songs = await prisma.song.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        composer: {
          select: { name: true, slug: true }
        }
      }
    });

    return NextResponse.json({ data: songs });

  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}