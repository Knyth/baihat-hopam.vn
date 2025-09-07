// src/app/api/user/favorites/[songId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// --- POST: THÊM MỘT BÀI HÁT VÀO YÊU THÍCH ---
export async function POST(request, { params }) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const songId = parseInt(params.songId, 10);
    if (isNaN(songId)) return NextResponse.json({ error: 'Invalid Song ID' }, { status: 400 });

    // Sử dụng upsert để tránh lỗi trùng lặp, nếu đã có thì không làm gì
    await prisma.userFavorite.upsert({
        where: {
            userId_songId: {
                userId: user.userId,
                songId: songId,
            }
        },
        update: {},
        create: {
            userId: user.userId,
            songId: songId,
        }
    });

    return NextResponse.json({ message: 'Favorite added successfully' }, { status: 200 });
  } catch (error) {
    console.error("API POST Favorite Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// --- DELETE: XÓA MỘT BÀI HÁT KHỎI YÊU THÍCH ---
export async function DELETE(request, { params }) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const songId = parseInt(params.songId, 10);
    if (isNaN(songId)) return NextResponse.json({ error: 'Invalid Song ID' }, { status: 400 });

    // Sử dụng delete thay vì deleteMany cho trường hợp này
    await prisma.userFavorite.delete({
      where: {
        userId_songId: {
            userId: user.userId,
            songId: songId,
        },
      },
    });

    return NextResponse.json({ message: 'Favorite removed successfully' }, { status: 200 });
  } catch (error) {
    // Nếu bản ghi không tồn tại, Prisma sẽ throw lỗi, chúng ta có thể bỏ qua
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Favorite not found, but operation is successful.' }, { status: 200 });
    }
    console.error("API DELETE Favorite Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}