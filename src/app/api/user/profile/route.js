// src/app/api/user/profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Hàm trợ giúp để lấy ID người dùng từ token
async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id;
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return null;
  }
}

// === XỬ LÝ YÊU CẦU GET ĐỂ LẤY THÔNG TIN PROFILE ===
export async function GET(request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar_url: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// === (MỚI) XỬ LÝ YÊU CẦU PUT ĐỂ CẬP NHẬT PROFILE ===
export async function PUT(request) {
  // 1. Xác thực người dùng
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username } = body;

    // 2. Kiểm tra dữ liệu đầu vào
    if (!username || username.trim().length < 3) {
      return NextResponse.json({ error: "Tên hiển thị phải có ít nhất 3 ký tự." }, { status: 400 });
    }

    // 3. Kiểm tra xem username mới có bị trùng với người khác không
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    // Chỉ báo lỗi nếu username này tồn tại VÀ nó không phải là của chính người dùng hiện tại
    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: "Tên hiển thị này đã tồn tại." }, { status: 409 });
    }

    // 4. Cập nhật thông tin người dùng trong database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username.trim(),
        // (Trong tương lai có thể cập nhật cả avatar_url ở đây)
      },
      select: {
        // Chỉ trả về những thông tin an toàn
        id: true,
        username: true,
        email: true,
        avatar_url: true,
      },
    });

    // 5. Trả về thông tin đã được cập nhật
    return NextResponse.json({ message: "Cập nhật thông tin thành công!", user: updatedUser });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
