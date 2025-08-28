// src/app/songs/page.js
import prisma from '@/lib/prisma';
import SongListContainer from '@/components/SongListContainer';
import { Suspense } from 'react';
async function getFilterData() {
  const genres = await prisma.genre.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });
  return { genres };
}
export default async function SongsPage() {
  const { genres } = await getFilterData();
  return (
    // Suspense là cần thiết vì SongListContainer sử dụng useSearchParams
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <SongListContainer genres={genres} />
    </Suspense>
  );
}
