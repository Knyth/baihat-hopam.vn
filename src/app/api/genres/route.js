// src/app/api/genres/route.js

import { NextResponse } from 'next/server';
// === THAY ĐỔI 1: Import instance Prisma đã được quản lý tập trung ===
import prisma from '@/lib/prisma';

// Hàm xử lý yêu cầu GET
export async function GET(request) {
  try {
    // === THAY ĐỔI 2: Dùng instance 'prisma' đã import ===
    const genres = await prisma.genre.findMany({
      // Sắp xếp theo tên cho thân thiện với người dùng hơn
      orderBy: {
        name: 'asc',
      },
    });

    // Trả về dữ liệu thành công
    return NextResponse.json(genres);

  } catch (error) {
    // Nếu có lỗi
    console.error('Failed to fetch genres:', error);

    // Trả về thông báo lỗi nhất quán với các API khác
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}