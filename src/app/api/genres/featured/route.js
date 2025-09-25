// src/app/api/genres/featured/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Luôn trả dữ liệu tươi trong dev / không dính cache ISR
export const dynamic = "force-dynamic";

/**
 * GET /api/genres/featured?limit=12
 * Chuẩn trả về:
 * [
 *   { name: "Nhạc Trịnh", slug: "nhac-trinh" },
 *   { name: "Ballad", slug: "ballad" },
 *   ...
 * ]
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12;

    // ⚙️ Chiến lược chọn "featured":
    // 1) Nếu DB của bạn có cờ `featured` trong bảng Genre ⇒ ưu tiên dùng.
    // 2) Nếu không có cờ, fallback: lấy các thể loại có ít nhất 1 bài, ưu tiên nhiều bài trước.
    //
    // Để không phụ thuộc schema, mình viết fallback an toàn bằng relation count.
    // Nếu bạn có cờ `featured: true`, chỉ cần bỏ "orderBy" & "where" ở dưới và thay như comment.
    const genres = await prisma.genre.findMany({
      // 👉 Nếu có cờ:
      // where: { featured: true },
      take: limit,
      orderBy: [
        // Ưu tiên số bài hát nhiều hơn (nếu có relation songs)
        { songs: { _count: "desc" } },
        // Sau đó sắp xếp tên cho ổn định
        { name: "asc" },
      ],
      select: {
        name: true,
        slug: true,
        // Tránh select field không tồn tại để không dính lỗi Unknown field
        // Nếu bạn có iconUrl, có thể bật:
        // iconUrl: true,
        // _count: { select: { songs: true } }, // bật khi muốn xem số bài
      },
      // where: { songs: { some: {} } }, // Nếu muốn lọc chỉ genre có ít nhất 1 bài
    });

    // Chuẩn hoá dữ liệu: chỉ name/slug (đủ cho FE hiện tại)
    const data = (genres || []).map((g) => ({
      name: g.name,
      slug: g.slug,
      // Giữ chỗ nếu sau này cần icon:
      // iconUrl: g.iconUrl ?? null,
      // icon_url: g.iconUrl ?? null, // backward-compatible nếu FE cũ
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /api/genres/featured failed:", err);
    return NextResponse.json({ error: "Failed to load featured genres" }, { status: 500 });
  }
}
