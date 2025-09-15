// src/app/songs/page.js
// ✅ Trang danh sách bài hát (Library / Trending)
// - Không đổi UI hiện tại: vẫn render <SongListContainer /> như trước.
// - Thêm generateMetadata để SEO tốt hơn khi sort=trending.
// - Giữ cấu hình động an toàn cho CSR/filters.

export const dynamic = "force-dynamic";  // luôn render động vì có filter/searchParams
export const revalidate = 0;             // không cache để list theo real-time

import { getAllGenres } from "@/lib/api";
import SongListContainer from "@/components/SongListContainer";

/**
 * 🧠 SEO: sinh metadata theo query
 * Next.js 15: params là Promise; searchParams có thể là object hoặc (tùy version) cũng là Promise.
 * Ta luôn "await" để an toàn.
 */
export async function generateMetadata({ searchParams }) {
  const sp = (await searchParams) || {};
  const sort = String(sp.sort || "newest");  // trending | newest | ...
  const daysParam = Number(sp.days);
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 30) : 7;

  // Base dữ liệu SEO
  const SITE_NAME = "baihat-hopam.vn";
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Mặc định cho thư viện
  let title = `Thư viện Hợp âm | ${SITE_NAME}`;
  let description =
    "Khám phá hợp âm và lời bài hát Việt, được cộng đồng cập nhật liên tục tại baihat-hopam.vn.";
  let canonicalPath = "/songs";

  // Khi là trang Thịnh hành
  if (sort === "trending") {
    title = `Thịnh hành – Top bài hát ${days} ngày | ${SITE_NAME}`;
    description = `Danh sách thịnh hành: các bài hát được xem nhiều nhất trong ${days} ngày gần đây trên ${SITE_NAME}.`;
    canonicalPath = "/songs?sort=trending";
    if (days !== 7) {
      // Nếu người dùng bật mốc khác (vd 30 ngày) thì canonical gồm cả days
      canonicalPath = `/songs?sort=trending&days=${days}`;
    }
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
 * 🖥️ Page (Server Component)
 * - Lấy list genres qua API helper sẵn có để cung cấp cho FilterSidebar.
 * - UI/logic phần list/paging nằm trong <SongListContainer/>.
 */
export default async function SongsPage({ searchParams }) {
  // (giữ lại await cho tương thích Next 15, dù không dùng trực tiếp)
  await searchParams;

  // Lấy genres (nếu API nội bộ chưa có dữ liệu thì component vẫn tự xử lý gracefully)
  const genres = await getAllGenres();

  return <SongListContainer genres={genres} />;
}
