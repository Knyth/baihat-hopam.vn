// src/app/api/songs/newest/route.js

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/songs/newest?limit=10
 * Trả về các bài hát mới nhất với payload tối giản cho UI.
 * - Chỉ lấy field cần thiết để nhẹ payload.
 * - Chuẩn hóa artists thành mảng { name }.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit"));
    const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 10;

    const newest = await prisma.song.findMany({
      orderBy: { created_at: "desc" }, // nếu schema dùng createdAt thì đổi lại
      take,
      select: {
        id: true,
        slug: true,
        title: true,
        created_at: true,
        composer: { select: { name: true } },
        artists: {
          select: {
            artist: { select: { name: true } },
          },
        },
      },
    });

    const data = newest.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      composer: s.composer || null,
      artists: (s.artists || []).map((a) => a.artist),
    }));

    return NextResponse.json(data, {
      // (tuỳ) có thể thêm headers cache nếu cần
      // headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("Error fetching newest songs:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
