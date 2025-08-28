// src/app/my-songs/page.js
"use client";

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
// useRouter không còn cần thiết cho việc redirect nữa

// Component Skeleton để hiển thị khi đang tải
function SongListSkeleton() {
  return (
    <div>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ backgroundColor: '#e9ecef', height: '28px', width: '250px', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
            <div style={{ backgroundColor: '#e9ecef', height: '20px', width: '150px', borderRadius: '4px' }}></div>
          </div>
          <div style={{ backgroundColor: '#e9ecef', height: '30px', width: '50px', borderRadius: '4px' }}></div>
        </div>
      ))}
    </div>
  );
}

export default function MySongsPage() {
  // const router = useRouter(); // ĐÃ LOẠI BỎ

  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchFavoriteSongs() {
      try {
        const res = await fetch('/api/user/favorites');
        
        // TINH CHỈNH: Không cần kiểm tra 401 nữa vì Middleware đã xử lý
        if (!res.ok) { 
          throw new Error('Không thể tải danh sách yêu thích.'); 
        }

        const data = await res.json();
        setSongs(data.data);
      } catch (err) { 
        setError(err.message); 
      } finally { 
        setIsLoading(false); 
      }
    }
    fetchFavoriteSongs();
  }, []); // Loại bỏ [router] khỏi dependency array

  // === HÀM XỬ LÝ VIỆC XÓA BÀI HÁT ===
  const handleDeleteSong = async (songId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài hát này khỏi danh sách yêu thích?")) {
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(`/api/user/favorites/${songId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Không thể xóa bài hát.');
        }
        // Cập nhật giao diện ngay lập tức
        setSongs(currentSongs => currentSongs.filter(song => song.id !== songId));
      } catch (err) {
        alert(err.message);
      }
    });
  };

  const filteredAndSortedSongs = songs
    .filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (song.composerName && song.composerName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') { return new Date(b.added_at) - new Date(a.added_at); }
      if (sortOrder === 'oldest') { return new Date(a.added_at) - new Date(b.added_at); }
      if (sortOrder === 'az') { return a.title.localeCompare(b.title, 'vi'); }
      return 0;
    });

  if (isLoading) {
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className='text-4xl font-bold'>Bài hát của tôi</h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Đang tải danh sách...</p>
        </div>
        <SongListSkeleton />
      </div>
    );
  }

  if (error) { return <p>Lỗi: {error}</p>; }
  
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className='text-4xl font-bold'>Bài hát của tôi</h1>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          Tổng cộng: {filteredAndSortedSongs.length} bài hát. Đây là không gian riêng để bạn lưu lại những giai điệu tâm đắc nhất.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Tìm trong danh sách đã lưu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
        >
          <option value="newest">Ngày thêm (Mới nhất)</option>
          <option value="oldest">Ngày thêm (Cũ nhất)</option>
          <option value="az">Tên bài hát (A-Z)</option>
        </select>
      </div>

      {filteredAndSortedSongs.length > 0 ? (
        <div>
          {filteredAndSortedSongs.map(song => (
            <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <Link href={`/songs/${song.slug}`} style={{ textDecoration: 'none' }}>
                  <h2 className='text-2xl font-bold text-primary hover:underline'>{song.title}</h2>
                </Link>
                {song.composerName && <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{song.composerName}</p>}
              </div>
              
              <button 
                onClick={() => handleDeleteSong(song.id)}
                disabled={isPending}
                style={{ 
                  color: isPending ? '#6c757d' : '#dc3545', 
                  background: 'none', border: 'none', 
                  cursor: isPending ? 'not-allowed' : 'pointer', 
                  fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '6px', transition: 'background-color 0.2s' 
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8d7da'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--border-color)', borderRadius: '12px' }}>
          <h3 className='text-2xl font-bold'>{songs.length > 0 ? 'Không tìm thấy kết quả phù hợp.' : 'Danh sách của bạn chưa có gì cả!'}</h3>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
             {songs.length > 0 ? 'Hãy thử một từ khóa tìm kiếm khác.' : 'Hãy bắt đầu khám phá và nhấn vào biểu tượng ❤️ tại bất kỳ bài hát nào bạn thích để lưu lại đây nhé.'}
          </p>
          <Link href="/songs" className='button-primary' style={{ marginTop: '2rem', display: 'inline-block' }}>
            Khám phá bài hát ngay
          </Link>
        </div>
      )}
    </div>
  );
}