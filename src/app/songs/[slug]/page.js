// src/app/songs/[slug]/page.js

import prisma from '@/lib/prisma';
import SongDisplay from '@/components/SongDisplay';
import { notFound } from 'next/navigation';

async function getSongData(slug) {
  const song = await prisma.song.findUnique({
    where: { slug },
    // === KHỐC INCLUDE ĐÃ ĐƯỢC SỬA LẠI HOÀN TOÀN ===
    include: {
      composer: {
        select: { name: true, slug: true }
      },
      // Đây là cách truy vấn đúng qua bảng trung gian
      artists: {
        select: {
          artist: { // Đi vào "artist" bên trong "SongArtist"
            select: { // Và lấy những trường cần thiết
              name: true,
              slug: true,
            }
          }
        }
      }
    }
  });

  // Chúng ta cần xử lý lại cấu trúc dữ liệu artists một chút
  // để component SongDisplay có thể sử dụng dễ dàng
  if (song) {
    song.artists = song.artists.map(songArtist => songArtist.artist);
  }

  return song;
}

export default async function SongDetailPage({ params }) {
  const { slug } = params;
  const songData = await getSongData(slug);

  if (!songData) {
    notFound();
  }

  return (
    <SongDisplay songData={songData} />
  );
}