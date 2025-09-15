// src/app/page.js

import { Suspense } from "react";
import prisma from "@/lib/prisma";

// ✅ Giữ nguyên Hero (server component) ở đầu trang
import HeroSection from "@/components/HeroSection";

// ✅ Recently Added (nhận songs từ server)
import RecentlyAddedSection from "@/components/RecentlyAddedSection";

// ✅ Container (bao lề đồng bộ theo thiết kế hiện tại)
import Container from "@/components/layout/Container";

// ✅ NEW: Trending Section + Skeleton
import TrendingSection from "@/components/TrendingSection";
import TrendingSkeleton from "@/components/TrendingSkeleton";

// ✅ ISR cho trang chủ: tự làm mới mỗi 120s (có thể chỉnh 60/180 tuỳ nhu cầu)
export const revalidate = 120;

/**
 * Lấy 8 bài hát mới nhất cho Homepage.
 * - Chỉ select field cần dùng để tối ưu.
 * - Chuẩn hoá artists => [{ name }] khớp với SongCard/RecentlyAddedSection.
 */
async function getRecentSongs(limit = 8) {
  try {
    const songs = await prisma.song.findMany({
      take: limit,
      orderBy: { createdAt: "desc" }, // ⚠️ Nếu schema dùng created_at → đổi cho đúng
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        composer: { select: { name: true } },
        artists: {
          select: {
            artist: { select: { name: true } },
          },
        },
      },
    });

    // Map artists từ { artists: [{ artist: { name } }] } → { artists: [{ name }] }
    return songs.map((song) => ({
      id: song.id,
      slug: song.slug,
      title: song.title,
      createdAt: song.createdAt,
      composer: song.composer || null,
      artists: (song.artists || []).map((sa) => sa.artist), // [{ name }]
    }));
  } catch (error) {
    console.error("Failed to fetch recent songs:", error);
    return [];
  }
}

export default async function HomePage() {
  const recentSongs = await getRecentSongs(8);

  return (
    <main>
      {/* ✅ Hero Section — giữ nguyên */}
      <HeroSection />

      {/* ✅ Recently Added — theo blueprint, ngay sau Hero */}
      <Container>
        <RecentlyAddedSection songs={recentSongs} />
      </Container>

      {/* ✅ NEW: Trending This Week — chèn ngay sau Recently Added, bọc Suspense */}
      <Container>
        <Suspense fallback={<TrendingSkeleton rows={6} variant="list" />}>
          <TrendingSection
            layout="list"
            limit={8}
            showMetric="views"
            title="Thịnh hành trong Tuần"
            viewAllHref="/songs?sort=trending"
          />
        </Suspense>
      </Container>
    </main>
  );
}
