// src/app/api/songs/[slug]/route.js
// GET chi tiết 1 bài hát theo slug (Next 15: PHẢI await params)

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toSlug } from "@/utils/text"; // dùng để slugify newSlug

// Helper: chuẩn hoá format trả về cho FE (artists/genres thành mảng phẳng)
function formatSong(song) {
  if (!song) return null;
  return {
    ...song,
    artists: song.artists?.map((a) => a.artist) ?? [],
    genres: song.genres?.map((g) => g.genre) ?? [],
  };
}

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const song = await prisma.song.findUnique({
      where: { slug },
      // ⚠️ Dùng field camelCase theo Prisma model (DB cột snake_case đã map qua @map)
      select: {
        id: true,
        title: true,
        slug: true,
        lyricsChords: true,
        originalKey: true,
        rhythm: true,
        tempo: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        composer: { select: { name: true, slug: true } },
        artists: { select: { artist: { select: { name: true, slug: true } } } },
        genres: { select: { genre: { select: { name: true, slug: true } } } },
      },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json(formatSong(song));
  } catch (err) {
    console.error(`Failed to fetch song with slug: ${slug}`, err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// === UPDATE: cập nhật lyrics/originalKey và (tuỳ chọn) đổi slug ===
export async function PUT(request, { params }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { lyricsChords, originalKey, newSlug } = body || {};

  // Gom dữ liệu được phép update
  const data = {};
  if (typeof lyricsChords === "string") data.lyricsChords = lyricsChords;
  if (typeof originalKey === "string") data.originalKey = originalKey;

  // Đổi slug (nếu truyền vào)
  if (typeof newSlug === "string" && newSlug.trim()) {
    const s = toSlug(newSlug.trim());
    if (!s) {
      return NextResponse.json({ error: "newSlug is invalid after slugify()" }, { status: 400 });
    }
    data.slug = s; // Prisma enforce unique
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nothing to update. Provide lyricsChords/originalKey or newSlug." },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.song.update({
      where: { slug },
      data: { ...data, updatedAt: new Date() },
      select: {
        id: true,
        title: true,
        slug: true,
        lyricsChords: true,
        originalKey: true,
        rhythm: true,
        tempo: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        composer: { select: { name: true, slug: true } },
        artists: { select: { artist: { select: { name: true, slug: true } } } },
        genres: { select: { genre: { select: { name: true, slug: true } } } },
      },
    });

    return NextResponse.json(formatSong(updated));
  } catch (e) {
    // Prisma error mapping: not found (P2025) vs unique conflict (P2002)
    console.error("PUT /api/songs/[slug] failed:", e);

    if (e?.code === "P2025") {
      // record not found (slug nguồn không tồn tại)
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    if (e?.code === "P2002") {
      // unique constraint (slug đích đã tồn tại)
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// === XOÁ: theo slug ===
export async function DELETE(request, { params }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const deleted = await prisma.song.delete({
      where: { slug },
      select: { id: true, title: true, slug: true },
    });
    return NextResponse.json({ ok: true, deleted });
  } catch (e) {
    console.error("DELETE /api/songs/[slug] failed:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
