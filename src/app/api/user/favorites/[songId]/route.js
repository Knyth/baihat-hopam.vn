// src/app/api/user/favorites/[songId]/route.js
// POST   → thêm bài vào "yêu thích" của user hiện tại
// DELETE → bỏ yêu thích
// Ràng buộc: yêu cầu đăng nhập; songId là số

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // dùng NextAuth helpers của dự án

function parseSongId(raw) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
}

// ====== POST /api/user/favorites/[songId] ======
export async function POST(request, { params }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Next 15: await params
  const { songId: raw } = await params;
  const songId = parseSongId(raw);
  if (!songId) {
    return NextResponse.json({ error: "Invalid songId" }, { status: 400 });
  }

  try {
    // Kiểm tra bài có tồn tại không (tránh rác)
    const exists = await prisma.song.findUnique({
      where: { id: songId },
      select: { id: true },
    });
    if (!exists) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Tạo bản ghi yêu thích (idempotent)
    await prisma.userFavorite.upsert({
      where: { userId_songId: { userId, songId } },
      update: {}, // đã có thì thôi
      create: {
        user: { connect: { id: userId } },
        song: { connect: { id: songId } },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ====== DELETE /api/user/favorites/[songId] ======
export async function DELETE(request, { params }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { songId: raw } = await params; // ✅ await
  const songId = parseSongId(raw);
  if (!songId) {
    return NextResponse.json({ error: "Invalid songId" }, { status: 400 });
  }

  try {
    await prisma.userFavorite.delete({
      where: { userId_songId: { userId, songId } },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Nếu xoá mục không tồn tại → coi như ok (idempotent xoá)
    if (err?.code === "P2025") {
      return NextResponse.json({ ok: true });
    }
    console.error("Error removing favorite:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
