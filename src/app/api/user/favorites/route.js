import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Hàm trợ giúp để lấy ID người dùng từ token
async function getUserIdFromToken() {
  // SỬA LỖI: Thêm 'await' trước khi gọi cookies()
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id;
  } catch (error) {
    // Lỗi này thường xảy ra khi token hết hạn hoặc không hợp lệ
    console.error("JWT Verification Error:", error.message);
    return null;
  }
}

// === XỬ LÝ YÊU CẦU GET ĐỂ LẤY DANH SÁCH YÊU THÍCH ===
export async function GET(request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Tìm tất cả các bài hát được yêu thích bởi người dùng này
    const favoriteSongs = await prisma.userFavorite.findMany({
      where: {
        user_id: userId,
      },
      // Sắp xếp theo ngày thêm mới nhất
      orderBy: {
        added_at: 'desc',
      },
      // Dùng 'include' để lấy cả thông tin chi tiết của bài hát liên quan
      select: { // Dùng 'select' để cấu trúc dữ liệu trả về gọn hơn
        added_at: true,
        song: {
          select: {
            id: true,
            title: true,
            slug: true,
            composer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Trích xuất và định dạng lại dữ liệu cho gọn gàng
    const songs = favoriteSongs.map(fav => ({
      ...fav.song,
      composerName: fav.song.composer?.name, // Làm phẳng tên tác giả
      added_at: fav.added_at,
    }));

    return NextResponse.json({ data: songs });

  } catch (error) {
    console.error("Failed to fetch favorite songs:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}