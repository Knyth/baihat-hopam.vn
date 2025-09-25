// src/app/api/user/favorites/route.js

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // ✅ dùng auth()

// GET: trả danh sách bài hát user đã yêu thích
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      select: {
        song: {
          select: {
            id: true,
            title: true,
            slug: true,
            originalKey: true,
            composer: { select: { name: true, slug: true } },
            artists: { select: { name: true, slug: true } },
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const data = favorites.map((f) => f.song).filter(Boolean);

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/user/favorites error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
