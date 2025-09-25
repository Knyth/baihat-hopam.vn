// src/app/api/auth/me/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Thêm 'request' làm tham số, mặc dù chúng ta không dùng trực tiếp
// nhưng nó cần thiết cho các phiên bản Next.js mới
export async function GET(request) {
  try {
    // === THAY ĐỔI DUY NHẤT VÀ QUAN TRỌNG NHẤT LÀ Ở ĐÂY ===
    const cookieStore = await cookies(); // <--- Thêm từ khóa 'await'
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = { id: payload.id, username: payload.username };

    return NextResponse.json({ user });
  } catch (error) {
    // Nếu có bất kỳ lỗi nào (token không hợp lệ, hết hạn,...)
    // chúng ta sẽ trả về user là null.
    // Xóa cookie không hợp lệ để dọn dẹp
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({ user: null });
  }
}
