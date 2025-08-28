// src/components/FilterableSongList.js

import SongList from '@/components/SongList';

// Hàm này sẽ chạy ở phía server để lấy dữ liệu
async function getFilteredSongs(searchParams) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  // === GIẢI PHÁP: CHUYỂN ĐỔI THỦ CÔNG AN TOÀN ===
  // 1. Tạo một đối tượng URLSearchParams trống.
  const params = new URLSearchParams();

  // 2. Lặp qua từng cặp key-value trong searchParams object đặc biệt của Next.js
  //    và thêm chúng vào đối tượng params của chúng ta một cách an toàn.
  //    Object.entries(searchParams) sẽ trích xuất chỉ các cặp [key, value] hữu hình.
  Object.entries(searchParams).forEach(([key, value]) => {
    // Nếu value là một mảng (ví dụ: ?genre=pop&genre=rock), chúng ta thêm từng cái một
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else {
      // Nếu không, chúng ta chỉ cần đặt giá trị đó
      params.set(key, value);
    }
  });

  // 3. Giờ đây, queryString được tạo ra từ một đối tượng an toàn và sạch sẽ.
  const queryString = params.toString();
  
  const songsUrl = `${API_BASE_URL}/api/songs?${queryString}`;
  
  const res = await fetch(songsUrl, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error("Failed to fetch filtered songs:", res.status, res.statusText);
    return [];
  }

  try {
    const songsData = await res.json();
    return songsData.data || [];
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return [];
  }
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