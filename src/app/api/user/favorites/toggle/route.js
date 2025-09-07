// src/app/api/user/favorites/toggle/route.js

import { NextResponse } from "next/server";
import { toggleFavorite } from "@/actions/favoriteActions";

export async function POST(request) {
  try {
    // Lấy songId từ body của request
    const { songId } = await request.json();

    if (!songId) {
      return NextResponse.json({ success: false, message: "Thiếu songId." }, { status: 400 });
    }

    // Gọi Server Action để xử lý logic
    const result = await toggleFavorite({ songId });

    // Trả kết quả về cho client
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // Xử lý các lỗi có thể xảy ra (ví dụ: người dùng chưa đăng nhập)
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }
    // Lỗi server chung
    return NextResponse.json({ success: false, message: "Lỗi Server" }, { status: 500 });
  }
}