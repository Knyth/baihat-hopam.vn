// src/app/api/songs/related/[slug]/route.js
// NEW: Trả về danh sách bài "liên quan" cho 1 bài hát.
// Ưu tiên cùng composer → nếu thiếu thì bổ sung theo genre → nếu vẫn thiếu thì thêm top views (loại trừ chính nó).

// === CẤU HÌNH RENDER ĐỘNG (nhất quán với các route khác của dự án) ===
export const dynamicParams = true;       // cho phép tham số động
export const dynamic = "force-dynamic";  // luôn render động
export const revalidate = 0;             // không cache

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    // ✅ Next 15: params là Promise → PHẢI await trước khi dùng thuộc tính
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit"));
    const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 8;

    // 1) Lấy thông tin tối thiểu của bài gốc
    const current = await prisma.song.findUnique({
      where: { slug },
      select: {
        id: true,
        composerId: true,
        genres: { select: { genreId: true } },
      },
    });

    if (!current) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const excludeIds = new Set([current.id]);
    const baseSelect = {
      id: true,
      slug: true,
      title: true,
      composer: { select: { name: true } },
      artists: { select: { artist: { select: { name: true } } } },
      views: true,
      updatedAt: true,
    };

    let results = [];

    // 2) Ưu tiên: cùng composer
    if (current.composerId) {
      const sameComposer = await prisma.song.findMany({
        where: { composerId: current.composerId, id: { notIn: Array.from(excludeIds) } },
        orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
        take,
        select: baseSelect,
      });
      results = sameComposer;
      sameComposer.forEach((s) => excludeIds.add(s.id));
    }

    // 3) Bổ sung: trùng ít nhất 1 genre
    if (results.length < take && current.genres?.length) {
      const needed = take - results.length;
      const genreIds = current.genres.map((g) => g.genreId);
      const sameGenres = await prisma.song.findMany({
        where: {
          id: { notIn: Array.from(excludeIds) },
          genres: { some: { genreId: { in: genreIds } } },
        },
        orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
        take: needed,
        select: baseSelect,
      });
      results = results.concat(sameGenres);
      sameGenres.forEach((s) => excludeIds.add(s.id));
    }

    // 4) Fallback: top views toàn thời gian (loại trừ đã có)
    if (results.length < take) {
      const needed = take - results.length;
      const fillers = await prisma.song.findMany({
        where: { id: { notIn: Array.from(excludeIds) } },
        orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
        take: needed,
        select: baseSelect,
      });
      results = results.concat(fillers);
    }

    // Chuẩn hoá artists -> [{ name }]
    const data = results.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      composer: s.composer || null,
      artists: (s.artists || []).map((a) => a.artist),
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching related songs:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
