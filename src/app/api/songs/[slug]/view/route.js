// src/app/api/songs/[slug]/view/route.js
// POST: tăng view cho bài hát theo slug (gọi từ ViewTracker ở trang chi tiết)

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(_request, { params }) {
  // ✅ Next 15: params là Promise → phải await
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    // Tăng view + trả lại views hiện tại
    const updated = await prisma.song.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });

    return NextResponse.json({ ok: true, views: updated.views });
  } catch (err) {
    console.error("Error incrementing views:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
