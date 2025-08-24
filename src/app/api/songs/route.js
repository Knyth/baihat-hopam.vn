// src/app/api/songs/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Hàm trợ giúp: Chuẩn hóa text để tìm kiếm
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genreSlugs = searchParams.get('genre')?.split(',');
    const composerQuery = searchParams.get('composer');
    const sort = searchParams.get('sort');

    // === Xây dựng điều kiện LỌC (whereClause) ===
    const whereClause = {};

    // 1. Lọc theo Thể loại
    if (genreSlugs && genreSlugs.length > 0 && genreSlugs[0] !== '') {
      whereClause.genres = { some: { genre: { slug: { in: genreSlugs } } } };
    }
    
    // 2. Lọc theo Tác giả (ĐÃ NÂNG CẤP)
    if (composerQuery) {
      const normalizedQuery = normalizeText(composerQuery);
      whereClause.composer = {
        search_name: {
          contains: normalizedQuery,
        },
      };
    }

    // === Sắp xếp bằng Database (cho các trường hợp đơn giản) ===
    let orderByClause = {}; 
    switch (sort) {
      case 'views':
        orderByClause = { views: 'desc' };
        break;
      // 'name_asc' sẽ được xử lý sau bằng JavaScript
      case 'newest':
      default:
        orderByClause = { created_at: 'desc' };
        break;
    }

    // === Truy vấn Database ===
    const songs = await prisma.song.findMany({
      where: whereClause,
      // Chỉ áp dụng orderBy nếu không phải sắp xếp theo tên
      orderBy: sort !== 'name_asc' ? orderByClause : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        composer: {
          select: { name: true, slug: true }
        }
      }
    });

    // === Sắp xếp chuẩn Tiếng Việt (Áp dụng giải pháp tối ưu) ===
    if (sort === 'name_asc') {
      songs.sort((a, b) => {
        // 'vi' để sắp xếp theo quy tắc tiếng Việt, 'base' để bỏ qua sự khác biệt nhỏ (như hoa/thường)
        return a.title.localeCompare(b.title, 'vi', { sensitivity: 'base' });
      });
    }
    
    return NextResponse.json({ data: songs });

  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}