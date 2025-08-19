import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Hàm GET này nhận vào 2 tham số: request và một đối tượng chứa params
// Next.js sẽ tự động bỏ slug từ URL vào trong params
export async function GET(request, { params }) {
  // Lấy slug từ params
  const { slug } = params;

  // Kiểm tra xem có slug không
  if (!slug) {
    return NextResponse.json(
      { message: 'Thiếu slug của bài hát.' },
      { status: 400 } // 400 Bad Request
    );
  }

  try {
    // Dùng Prisma để tìm một bài hát duy nhất (findUnique) có slug tương ứng
    const song = await prisma.song.findUnique({
      where: {
        slug: slug,
      },
      // Thêm "include" để lấy kèm cả thông tin của tác giả liên quan
      include: {
        composer: {
          select: { // Chỉ lấy những trường cần thiết của composer
            name: true,
            slug: true,
          },
        },
        // (Trong tương lai có thể include thêm artists, genres ở đây)
      },
    });

    // Nếu không tìm thấy bài hát
    if (!song) {
      return NextResponse.json(
        { message: 'Không tìm thấy bài hát.' },
        { status: 404 } // 404 Not Found
      );
    }

    // Nếu tìm thấy, trả về dữ liệu bài hát
    return NextResponse.json(song, { status: 200 });
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu bài hát [${slug}]:`, error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi ở phía server.' },
      { status: 500 }
    );
  }
}