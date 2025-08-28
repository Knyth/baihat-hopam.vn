// src/app/api/user/favorites/[songId]/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Hàm trợ giúp để xác thực người dùng từ token
async function getUserIdFromToken() {
  // SỬA LỖI QUAN TRỌNG: Thêm 'await' trước khi gọi cookies()
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id; // Trả về ID của người dùng
  } catch (error) {
    console.error("JWT Verification error:", error.message);
    return null;
  }
}

// === XỬ LÝ HÀNH ĐỘNG "THÊM VÀO YÊU THÍCH" (Giữ nguyên logic của bạn) ===
export async function POST(request, { params }) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const songId = parseInt(params.songId, 10);
  if (isNaN(songId)) {
    return NextResponse.json({ error: 'Invalid song ID' }, { status: 400 });
  }

  try {
    await prisma.userFavorite.create({
      data: {
        user_id: userId,
        song_id: songId,
      },
    });
    return NextResponse.json({ success: true, message: 'Added to favorites' }, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') { // Đã yêu thích rồi
      return NextResponse.json({ success: true, message: 'Already favorited' }, { status: 200 });
    }
    console.error("Failed to add favorite:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// === XỬ LÝ HÀNH ĐỘNG "XÓA KHỎI YÊU THÍCH" (Giữ nguyên logic của bạn + tối ưu hóa) ===
export async function DELETE(request, { params }) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const songId = parseInt(params.songId, 10);
  if (isNaN(songId)) {
    return NextResponse.json({ error: 'Invalid song ID' }, { status: 400 });
  }

  try {
    await prisma.userFavorite.delete({
      where: {
        user_id_song_id: {
          user_id: userId,
          song_id: songId,
        },
      },
    });
    return NextResponse.json({ success: true, message: 'Removed from favorites' }, { status: 200 });
  } catch (error) {
    if (error.code === 'P2025') { // Bản ghi không tồn tại để xóa
       // TỐI ƯU HÓA NHỎ: Trả về lỗi 404 để client biết rõ hơn
       return NextResponse.json({ error: 'Favorite entry not found' }, { status: 404 });
    }
    console.error("Failed to delete favorite:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}