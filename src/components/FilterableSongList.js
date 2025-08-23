// src/components/FilterableSongList.js

import SongList from '@/components/SongList';

async function getFilteredSongs(searchParams) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const genre = searchParams.genre || '';
  // === LẤY THAM SỐ MỚI ===
  const composer = searchParams.composer || '';

  // Dùng mảng để xây dựng query string một cách linh hoạt
  const queryParts = [];
  if (genre) {
    queryParts.push(`genre=${encodeURIComponent(genre)}`);
  }
  if (composer) {
    queryParts.push(`composer=${encodeURIComponent(composer)}`);
  }

  const queryString = queryParts.join('&');
  
  const songsUrl = `${API_BASE_URL}/api/songs?${queryString}`;
  const res = await fetch(songsUrl, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error("Failed to fetch filtered songs:", res.statusText);
    return [];
  }

  const songsData = await res.json();
  return songsData.data;
}

export default async function FilterableSongList({ searchParams }) {
  const songs = await getFilteredSongs(searchParams);

  return (
    <>
      {songs && songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p>Không tìm thấy bài hát nào khớp với bộ lọc của bạn.</p>
      )}
    </>
  );
}