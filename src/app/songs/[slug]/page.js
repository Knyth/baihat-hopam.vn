// src/app/songs/[slug]/page.js

// --- CẤU HÌNH MẠNH MẼ CHO DYNAMIC ROUTE ---
export const dynamicParams = true;          // cho phép tham số động
export const dynamic = "force-dynamic";     // luôn render động
export const revalidate = 0;                // không cache

import prisma from "@/lib/prisma";
import SongDisplay from "@/components/SongDisplay";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { auth } from "@/lib/auth";

// === NEW: import ViewTracker (client component) để tăng views an toàn ===
import ViewTracker from "@/components/ViewTracker";

// -------------------- HELPERS --------------------
async function getSongData(slug) {
  const song = await prisma.song.findUnique({
    where: { slug },
    include: {
      composer: { select: { name: true, slug: true } },
      artists: true,
      genres: true,
    },
  });

  if (song?.lyricsChords && typeof song.lyricsChords === "string") {
    // Chuẩn hoá mọi kiểu xuống dòng: \r\n, \r, và cả chuỗi "\\n"
    song.lyricsChords = song.lyricsChords
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\\n/g, "\n");
  }

  return song;
}

// -------------------- METADATA --------------------
/**
 * Next.js 15: params là Promise → PHẢI await trước khi dùng thuộc tính
 * Tuyệt đối KHÔNG viết: export async function generateMetadata({ params: { slug } })
 */
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ BẮT BUỘC với Next 15+

  const song = await prisma.song.findUnique({
    where: { slug },
    select: { title: true, composer: { select: { name: true } } },
  });

  if (!song) {
    return { title: "Không tìm thấy bài hát" };
  }

  const composerName = song.composer?.name || "";
  return {
    title: `${song.title}${composerName ? ` - ${composerName}` : ""} | baihat-hopam.vn`,
    description: `Hợp âm và lời bài hát ${song.title}${
      composerName ? ` của tác giả ${composerName}` : ""
    }.`,
  };
}

// -------------------- PAGE --------------------
/**
 * Next.js 15: params là Promise → PHẢI await trước khi dùng thuộc tính
 * Tuyệt đối KHÔNG viết: export default async function Page({ params: { slug } })
 */
export default async function SongDetailPage({ params }) {
  const { slug } = await params; // ✅ BẮT BUỘC với Next 15+

  // Chạy song song để giảm thời gian chờ
  const [songData, session] = await Promise.all([
    getSongData(slug),
    auth(),
  ]);

  if (!songData) {
    notFound(); // ném 404
  }

  const userId = session?.user?.id;
  const isLoggedIn = !!userId;

  // Kiểm tra đã yêu thích hay chưa (nếu đăng nhập)
  let isFavorited = false;
  if (isLoggedIn && songData.id) {
    const fav = await prisma.userFavorite.findUnique({
      where: { userId_songId: { userId, songId: songData.id } },
    });
    isFavorited = !!fav;
  }

  return (
    <Container>
      {/* === NEW: Tăng views an toàn — chỉ chạy ở client sau khi trang render === */}
      <ViewTracker slug={slug} />

      <SongDisplay
        songData={songData}
        initialIsFavorited={isFavorited}
        isLoggedIn={isLoggedIn}
      />
    </Container>
  );
}
