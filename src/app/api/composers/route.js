// Import công cụ để tạo phản hồi API từ Next.js
import { NextResponse } from 'next/server';

// Import "bộ công cụ" Prisma Client của chúng ta
import { PrismaClient } from '@/generated/prisma';

// Khởi tạo một đối tượng PrismaClient
const prisma = new PrismaClient();

// Đây là hàm đặc biệt sẽ xử lý các yêu cầu GET gửi đến /api/composers
export async function GET(request) {
  try {
    // Dùng Prisma để tìm tất cả các bản ghi trong bảng "composer"
    // Sắp xếp theo tên (name) tăng dần (A-Z)
    const composers = await prisma.composer.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Nếu thành công, trả về dữ liệu composers dưới dạng JSON với mã trạng thái 200 (OK)
    return NextResponse.json(composers, { status: 200 });
  } catch (error) {
    // In lỗi ra console của server
    console.error('Lỗi khi lấy danh sách tác giả:', error); // <-- Sửa lỗi chính tả ở đây

    // Trả về một thông báo lỗi chung chung
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi ở phía server.' },
      { status: 500 }
    );
  }
}