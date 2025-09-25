// src/app/songs/page.js
// ✅ Trang danh sách bài hát (Library / Trending)
// - Giữ nguyên UI: render <SongListContainer />.
// - ĐÃ có generateMetadata (title/description/canonical/OG/Twitter).
// - NEW: Nhúng Structured Data (JSON-LD) dạng ItemList khi sort=trending.
// - Không đụng Header/Hero/Recently Added/Footer/globals.css.

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAllGenres } from "@/lib/api";
import SongListContainer from "@/components/SongListContainer";

// === NEW: dùng Prisma để lấy danh sách trending cho JSON-LD (server-side)
import prisma from "@/lib/prisma";
import TrendingJsonLd from "@/components/seo/TrendingJsonLd";

/**
 * 🧠 SEO: sinh metadata theo query
 */
export async function generateMetadata({ searchParams }) {
  const sp = (await searchParams) || {};
  const sort = String(sp.sort || "newest");
  const daysParam = Number(sp.days);
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 30) : 7;

  const SITE_NAME = "baihat-hopam.vn";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let title = `Thư viện Hợp âm | ${SITE_NAME}`;
  let description =
    "Khám phá hợp âm và lời bài hát Việt, được cộng đồng cập nhật liên tục tại baihat-hopam.vn.";
  let canonicalPath = "/songs";

  if (sort === "trending") {
    title = `Thịnh hành – Top bài hát ${days} ngày | ${SITE_NAME}`;
    description = `Danh sách thịnh hành: các bài hát được xem nhiều nhất trong ${days} ngày gần đây trên ${SITE_NAME}.`;
    canonicalPath = days === 7 ? "/songs?sort=trending" : `/songs?sort=trending&days=${days}`;
  }

  const canonical = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Helper: Lấy 10 bài "thịnh hành" cho JSON-LD (7 ngày + fallback all-time)
 * - Chỉ select slug/title để nhẹ.
 */
async function getTrendingForJsonLd(days = 7, take = 10) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const select = { id: true, slug: true, title: true };

  // 1) Trong cửa sổ X ngày
  const inWindow = await prisma.song.findMany({
    where: { createdAt: { gte: since } },
    orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
    take,
    select,
  });

  let songs = inWindow;

  // 2) Fallback all-time nếu chưa đủ (tránh trùng)
  if (songs.length < take) {
    const needed = take - songs.length;
    const excludeIds = songs.map((s) => s.id);
    const fillers = await prisma.song.findMany({
      where: excludeIds.length ? { id: { notIn: excludeIds } } : {},
      orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
      take: needed,
      select,
    });
    songs = [...songs, ...fillers];
  }

  return songs.map((s) => ({ slug: s.slug, title: s.title }));
}

/**
 * 🖥️ Page (Server Component)
 */
export default async function SongsPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const sort = String(sp.sort || "newest");
  const daysParam = Number(sp.days);
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 30) : 7;

  // Lấy genres cho sidebar (trang trending sẽ tự ẩn sidebar trong SongListContainer)
  const genres = await getAllGenres();

  // === NEW: JSON-LD cho sort=trending
  let jsonLdItems = [];
  if (sort === "trending") {
    jsonLdItems = await getTrendingForJsonLd(days, 10);
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      {/* JSON-LD chỉ render khi trending (không chạm tới layout/UI) */}
      {sort === "trending" && <TrendingJsonLd items={jsonLdItems} baseUrl={SITE_URL} days={days} />}

      {/* UI danh sách giữ nguyên */}
      <SongListContainer genres={genres} />
    </>
  );
}
