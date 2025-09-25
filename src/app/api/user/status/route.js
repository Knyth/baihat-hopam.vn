// src/app/api/user/status/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Sửa lại đường dẫn import
import prisma from "@/lib/prisma";

export async function GET(request) {
  // Lấy session một cách an toàn ở phía server với cú pháp mới
  const session = await auth();

  // Nếu không có session hoặc không có thông tin user, coi như chưa đăng nhập
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ isLoggedIn: false, isFavorited: false });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const songId = searchParams.get("songId");

  if (!songId) {
    return NextResponse.json({ isLoggedIn: true, isFavorited: false });
  }

  const songIdInt = parseInt(songId, 10);
  if (isNaN(songIdInt)) {
    return NextResponse.json({ error: "Invalid songId" }, { status: 400 });
  }

  try {
    const favorite = await prisma.userFavorite.findUnique({
      where: {
        userId_songId: {
          userId: userId,
          songId: songIdInt,
        },
      },
    });

    return NextResponse.json({ isLoggedIn: true, isFavorited: !!favorite });
  } catch (error) {
    console.error("API Status GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
