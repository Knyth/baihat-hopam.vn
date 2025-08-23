// src/app/api/songs/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request) {
  try {
    const songs = await prisma.song.findMany({
      orderBy: {
        created_at: 'desc',
      },
      // ================================================================
      // === NÂNG CẤP: Lấy thêm thông tin của tác giả (composer) ===
      // ================================================================
      select: {
        id: true,
        title: true,
        slug: true,
        composer: { // Dùng 'include' hoặc 'select' lồng nhau
          select: {
            name: true,
            slug: true,
          }
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