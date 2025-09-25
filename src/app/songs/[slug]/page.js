// src/app/songs/[slug]/page.js

// --- CẤU HÌNH MẠNH MẼ CHO DYNAMIC ROUTE ---
export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prisma";
import SongDisplay from "@/components/SongDisplay";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { auth } from "@/lib/auth";
import ViewTracker from "@/components/ViewTracker";

// -------------------- HELPERS --------------------
async function getSongData(slug) {
  try {
    const song = await prisma.song.findUnique({
      where: { slug },
      include: {
        composer: { select: { name: true, slug: true } },
        artists: true,
        genres: true,
      },
    });

    if (!song) return null;

    if (song.lyricsChords && typeof song.lyricsChords === "string") {
      // Chuẩn hoá mọi kiểu xuống dòng: \r\n, \r, và cả chuỗi "\\n"
      song.lyricsChords = song.lyricsChords
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\\n/g, "\n");
    }

    return song;
  } catch (e) {
    // Giữ console sạch trên client, cho 404 an toàn
    return null;
  }
}

// -------------------- METADATA --------------------
export async function generateMetadata({ params }) {
  const { slug } = await params; // Next 15: phải await
  const safeSlug = typeof slug === "string" ? slug : String(slug ?? "");

  try {
    const song = await prisma.song.findUnique({
      where: { slug: safeSlug },
      select: { title: true, composer: { select: { name: true } } },
    });

    if (!song) return { title: "Không tìm thấy bài hát" };

    const composerName = song.composer?.name || "";
    return {
      title: `${song.title}${composerName ? ` - ${composerName}` : ""} | baihat-hopam.vn`,
      description: `Hợp âm và lời bài hát ${song.title}${
        composerName ? ` của tác giả ${composerName}` : ""
      }.`,
    };
  } catch {
    return { title: "Bài hát | baihat-hopam.vn" };
  }
}

// -------------------- PAGE --------------------
export default async function SongDetailPage({ params }) {
  const { slug } = await params; // Next 15
  const safeSlug = typeof slug === "string" ? slug : String(slug ?? "");

  // Chạy song song để giảm thời gian chờ
  const [songData, session] = await Promise.all([getSongData(safeSlug), auth()]);

  if (!songData) {
    notFound();
  }

  const userId = session?.user?.id;
  const isLoggedIn = !!userId;

  // Kiểm tra đã yêu thích hay chưa (nếu đăng nhập)
  let isFavorited = false;
  if (isLoggedIn && songData.id) {
    try {
      const fav = await prisma.userFavorite.findUnique({
        where: { userId_songId: { userId, songId: songData.id } },
      });
      isFavorited = !!fav;
    } catch {
      // im lặng để console sạch
    }
  }

  return (
    <Container>
      {/* Chỉ chạy ở client sau khi render */}
      <ViewTracker slug={safeSlug} />

      <SongDisplay songData={songData} initialIsFavorited={isFavorited} isLoggedIn={isLoggedIn} />
    </Container>
  );
}
