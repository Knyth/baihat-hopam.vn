// src/app/api/songs/trending/route.js
// Hỗ trợ 2 chế độ:
// - (default) Homepage: trả về mảng đơn giản [songs] theo cửa sổ X ngày + fallback all-time.
// - List mode (mode=list): phân trang { items, hasMore } với ?page=&limit=.
//   Quy tắc: ưu tiên các bài trong "days" ngày, sau đó đến all-time (views giảm dần).

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const limitParam = Number(searchParams.get("limit"));
    const daysParam = Number(searchParams.get("days"));
    const pageParam = Number(searchParams.get("page"));
    const mode = (searchParams.get("mode") || "").toLowerCase();

    const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 8;
    const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 30) : 7;
    const page = Number.isFinite(pageParam) ? Math.max(pageParam, 1) : 1;

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const baseSelect = {
      id: true,
      slug: true,
      title: true,
      views: true,
      composer: { select: { name: true } },
      artists: { select: { artist: { select: { name: true } } } },
    };

    // ---------- LIST MODE: phân trang ----------
    if (mode === "list") {
      const skip = (page - 1) * take;

      // Đếm toàn bộ + đếm trong cửa sổ
      const [totalAll, totalWindow] = await Promise.all([
        prisma.song.count(),
        prisma.song.count({ where: { createdAt: { gte: since } } }),
      ]);

      // Nếu cần fallback sang all-time, chuẩn bị id các bài trong cửa sổ
      let inWindowIds = [];
      if (totalWindow > 0) {
        const ids = await prisma.song.findMany({
          where: { createdAt: { gte: since } },
          select: { id: true },
        });
        inWindowIds = ids.map((x) => x.id);
      }

      const order = [{ views: "desc" }, { updatedAt: "desc" }];

      let items = [];

      if (skip < totalWindow) {
        // Lấy 1 phần từ "trong cửa sổ"
        const part1Take = Math.min(take, totalWindow - skip);
        const part1 = await prisma.song.findMany({
          where: { createdAt: { gte: since } },
          orderBy: order,
          skip,
          take: part1Take,
          select: baseSelect,
        });

        // Nếu thiếu, lấy tiếp từ "ngoài cửa sổ"
        const remain = take - part1Take;
        if (remain > 0) {
          const part2 = await prisma.song.findMany({
            where: inWindowIds.length ? { id: { notIn: inWindowIds } } : {},
            orderBy: order,
            skip: 0,
            take: remain,
            select: baseSelect,
          });
          items = [...part1, ...part2];
        } else {
          items = part1;
        }
      } else {
        // Toàn bộ trang này nằm ở "ngoài cửa sổ"
        const part2Skip = skip - totalWindow;
        const part2 = await prisma.song.findMany({
          where: inWindowIds.length ? { id: { notIn: inWindowIds } } : {},
          orderBy: order,
          skip: part2Skip,
          take,
          select: baseSelect,
        });
        items = part2;
      }

      const normalized = items.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        views: s.views,
        composer: s.composer || null,
        artists: (s.artists || []).map((a) => a.artist),
      }));

      const hasMore = skip + take < totalAll;
      return NextResponse.json({ items: normalized, hasMore });
    }

    // ---------- HOMEPAGE MODE: mảng đơn giản ----------
    // 1) Top trong cửa sổ 'days'
    const inWindow = await prisma.song.findMany({
      where: { createdAt: { gte: since } },
      orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
      take,
      select: baseSelect,
    });

    let songs = inWindow;

    // 2) Fallback nếu chưa đủ: top all-time (tránh trùng)
    if (songs.length < take) {
      const needed = take - songs.length;
      const excludeIds = songs.map((s) => s.id);
      const fillers = await prisma.song.findMany({
        where: excludeIds.length ? { id: { notIn: excludeIds } } : {},
        orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
        take: needed,
        select: baseSelect,
      });
      songs = [...songs, ...fillers];
    }

    const data = songs.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      views: s.views,
      composer: s.composer || null,
      artists: (s.artists || []).map((a) => a.artist),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trending songs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
