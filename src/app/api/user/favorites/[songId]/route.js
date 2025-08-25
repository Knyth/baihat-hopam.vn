// src/app/api/user/favorites/[songId]/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Hàm trợ giúp để xác thực người dùng từ token
async function getUserIdFromToken() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id; // Trả về ID của người dùng
  } catch (error) {
    return null;
  }
}

// === XỬ LÝ HÀNH ĐỘNG "THÊM VÀO YÊU THÍCH" ===
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
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    // Xử lý trường hợp đã yêu thích rồi (lỗi unique constraint)
    if (error.code === 'P2002') {
      return NextResponse.json({ success: true, message: 'Already favorited' });
    }
    console.error("Failed to add favorite:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// === XỬ LÝ HÀNH ĐỘNG "XÓA KHỎI YÊU THÍCH" ===
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
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Xử lý trường hợp bản ghi không tồn tại để xóa
    if (error.code === 'P2025') {
       return NextResponse.json({ success: true, message: 'Record not found' });
    }
    console.error("Failed to delete favorite:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}