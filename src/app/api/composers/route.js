// src/app/api/composers/route.js

import { NextResponse } from "next/server";
// === THAY ĐỔI 1: Import instance Prisma đã được quản lý tập trung ===
import prisma from "@/lib/prisma";

// Hàm xử lý yêu cầu GET
export async function GET(request) {
  try {
    // === THAY ĐỔI 2: Dùng instance 'prisma' đã import ===
    const composers = await prisma.composer.findMany({
      // Sắp xếp theo tên (A-Z) là lựa chọn hợp lý
      orderBy: {
        name: "asc",
      },
    });

    // Trả về dữ liệu thành công
    return NextResponse.json(composers);
  } catch (error) {
    // Nếu có lỗi
    console.error("Failed to fetch composers:", error);

    // Trả về thông báo lỗi nhất quán
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
