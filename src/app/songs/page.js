// src/app/songs/page.js

// Import component mới
import SongList from '@/components/SongList';

async function getAllSongs() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE_URL}/api/songs`, {
    cache: 'no-store' 
  });

  if (!res.ok) {
    console.error("Failed to fetch songs:", res.statusText);
    return [];
  }
  
  const result = await res.json();
  return result.data;
}

// Trang này bây giờ là một Server Component, rất hiệu quả cho việc lấy dữ liệu
export default async function SongListPage() {
  const songs = await getAllSongs();

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
      <h1 className="text-4xl font-bold" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        Thư viện Hợp âm
      </h1>
      
      {songs && songs.length > 0 ? (
        // Chỉ cần gọi Client Component và truyền dữ liệu 'songs' vào
        <SongList songs={songs} />
      ) : (
        <p>Không tìm thấy bài hát nào.</p>
      )}
    </div>
  );
}