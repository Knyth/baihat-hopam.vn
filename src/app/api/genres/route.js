// Import công cụ để tạo phản hồi API từ Next.js
import { NextResponse } from 'next/server';

// Import "bộ công cụ" Prisma Client của chúng ta
// Lưu ý đường dẫn ../../../ vì chúng ta đi ngược từ genres -> api -> app -> src
// import { PrismaClient } from '../../../src/generated/prisma';
import { PrismaClient } from '@/generated/prisma';

// Khởi tạo một đối tượng PrismaClient để có thể nói chuyện với database
const prisma = new PrismaClient();

// Đây là hàm đặc biệt sẽ xử lý các yêu cầu GET gửi đến /api/genres
export async function GET(request) {
  try {
    // Dùng Prisma để tìm tất cả các bản ghi trong bảng "genre"
    // Sắp xếp theo id tăng dần để kết quả luôn nhất quán
    const genres = await prisma.genre.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    // Nếu thành công, trả về dữ liệu genres dưới dạng JSON với mã trạng thái 200 (OK)
    return NextResponse.json(genres, { status: 200 });
  } catch (error) {
    // Nếu có lỗi xảy ra (ví dụ: mất kết nối database)
    // In lỗi ra console của server để chúng ta có thể gỡ lỗi
    console.error('Lỗi khi lấy danh sách thể loại:', error);

    // Trả về một thông báo lỗi chung chung cho người dùng với mã trạng thái 500
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi ở phía server.' },
      { status: 500 }
    );
  }
}