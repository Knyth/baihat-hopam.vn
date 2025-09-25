// /src/app/api/composers/featured/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// đảm bảo luôn hit DB (không cache) khi dev
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Tùy dự án của mình, có thể đổi sang cờ featured trong DB nếu có
    const featuredComposerNames = [
      "Trịnh Công Sơn",
      "Phạm Duy",
      "Lam Phương",
      "Vũ Thành An",
      "Ngô Thụy Miên",
    ];

    const composers = await prisma.composer.findMany({
      where: {
        name: { in: featuredComposerNames },
      },
      select: {
        name: true,
        slug: true,
        // ⚠️ Prisma schema dùng camelCase
        // Nếu schema của bạn đang là field khác (vd: avatarUrl), đổi tên tại đây.
        imageUrl: true,
      },
      orderBy: { name: "asc" },
    });

    // Chuẩn hóa response: giữ nguyên imageUrl, đồng thời thêm image_url cho FE cũ (nếu có)
    const data = composers.map((c) => ({
      name: c.name,
      slug: c.slug,
      imageUrl: c.imageUrl || null,
      image_url: c.imageUrl || null, // backward-compatible
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /api/composers/featured failed:", err);
    return NextResponse.json({ error: "Failed to load featured composers" }, { status: 500 });
  }
}
