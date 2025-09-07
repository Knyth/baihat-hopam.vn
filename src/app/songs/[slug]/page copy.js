// src/app/songs/[slug]/page.js

// --- CẤU HÌNH MẠNH MẼ NHẤT CHO DYNAMIC ROUTE ---
// 'use server'; // Nếu cần
export const dynamicParams = true; // Cho phép các tham số động được tạo

import prisma from '@/lib/prisma';
import SongDisplay from '@/components/SongDisplay';
import { notFound } from 'next/navigation';
import Container from '@/components/layout/Container';
import { auth } from '@/lib/auth';

// --- KHÔNG CẦN 'await' CHO PARAMS ---
// Sử dụng destructuring trực tiếp trên props
export async function generateMetadata({ params: { slug } }) {
  const song = await prisma.song.findUnique({
    where: { slug },
    select: { title: true, composer: { select: { name: true } } },
  });

  if (!song) {
    return { title: 'Không tìm thấy bài hát' };
  }

  return {
    title: `${song.title} - ${song.composer?.name || ''} | baihat-hopam.vn`,
    description: `Hợp âm và lời bài hát ${song.title} của tác giả ${song.composer?.name}.`,
  };
}

async function getSongData(slug) {
  const song = await prisma.song.findUnique({
    where: { slug },
    include: {
      composer: { select: { name: true, slug: true } },
      artists: true, 
      genres: true,
    }
  });
  
  if (song && song.lyricsChords) {
    song.lyricsChords = song.lyricsChords.replace(/\\n/g, '\n');
  }
  
  return song;
}

// --- CŨNG KHÔNG CẦN 'await' CHO PARAMS ---
export default async function SongDetailPage({ params: { slug } }) {
  const songData = await getSongData(slug);

  if (!songData) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;
  const isLoggedIn = !!userId;
  
  let isFavorited = false;
  if (isLoggedIn && songData.id) {
    const favoriteRecord = await prisma.userFavorite.findUnique({
      where: { userId_songId: { userId: userId, songId: songData.id } },
    });
    isFavorited = !!favoriteRecord;
  }
  
  return (
    <Container>
      <SongDisplay 
        songData={songData} 
        initialIsFavorited={isFavorited} 
        isLoggedIn={isLoggedIn} 
      />
    </Container>
  );
}