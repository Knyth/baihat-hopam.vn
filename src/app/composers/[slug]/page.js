/**
 * src/app/composers/[slug]/page.js
 * Composer detail page: fix 404 + SEO metadata + JSON-LD
 * KHÔNG đụng Header/Hero/Recently/Footer/globals.css
 */

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SongList from "@/components/SongList";
import ComposerJsonLd from "@/components/seo/ComposerJsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

// ------ SEO ------
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ Next 15: phải await params

  const composer = await prisma.composer.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!composer) {
    return {
      title: "Nhạc sĩ không tồn tại",
      description: "Trang bạn yêu cầu không tồn tại.",
      robots: { index: false, follow: false },
    };
  }

  const title = `Nhạc sĩ ${composer.name} – Hợp âm & bài hát`;
  const description = `Các bài hát/hợp âm của nhạc sĩ ${composer.name} – được cập nhật thường xuyên.`;
  const url = `${SITE_URL}/composers/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      siteName: "baihat-hopam.vn",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ------ Page ------
export default async function ComposerPage({ params }) {
  const { slug } = await params; // ✅ Next 15: phải await params

  const composer = await prisma.composer.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!composer) {
    notFound();
  }

  const songs = await prisma.song.findMany({
    where: { composerId: composer.id },
    orderBy: [{ updatedAt: "desc" }, { views: "desc" }],
    take: 30,
    select: {
      id: true,
      slug: true,
      title: true,
      views: true,
      composer: { select: { name: true } },
      artists: { select: { artist: { select: { name: true } } } },
    },
  });

  const songItems = songs.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    views: s.views,
    composer: s.composer || null,
    artists: (s.artists || []).map((a) => a.artist),
  }));

  return (
    <div className="container" style={{ paddingTop: "1.25rem", paddingBottom: "3rem" }}>
      <ComposerJsonLd composer={composer} songs={songItems} baseUrl={SITE_URL} />

      <header style={{ marginBottom: "1rem" }}>
        <h1 className="text-4xl font-bold">Nhạc sĩ {composer.name}</h1>
      </header>

      {songItems.length > 0 ? (
        <SongList songs={songItems} />
      ) : (
        <p>Chưa có bài hát nào của nhạc sĩ này.</p>
      )}
    </div>
  );
}
