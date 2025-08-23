// src/lib/prisma.js

import { PrismaClient } from '@prisma/client';

// Khai báo một biến global để lưu trữ instance của Prisma Client
let prisma;

if (process.env.NODE_ENV === 'production') {
  // Trong môi trường production, tạo một instance mới
  prisma = new PrismaClient();
} else {
  // Trong môi trường development, chúng ta cần tránh việc tạo ra
  // quá nhiều instance của Prisma Client do hot-reloading của Next.js
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Xuất khẩu instance duy nhất này để sử dụng trong toàn bộ ứng dụng
export default prisma;