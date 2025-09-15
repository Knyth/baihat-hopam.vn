// src/components/SongListContainer.js
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import SongList from './SongList';
import SongListSkeleton from './SongListSkeleton';

export default function SongListContainer({ genres }) {
  const searchParams = useSearchParams();

  // === NEW: bắt sort mode (mặc định 'newest') ===
  const sortParam = searchParams.get('sort') || 'newest';
  const isTrendingMode = sortParam === 'trending';

  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

        // === NEW: route riêng cho 'trending' (7 ngày gần nhất) ===
        if (isTrendingMode) {
          const limit = Number(searchParams.get('limit')) || 50; // tuỳ chỉnh
          const url = `${API_BASE_URL}/api/songs/trending?limit=${encodeURIComponent(limit)}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch trending list');
          const data = await res.json();
          // data đã ở dạng [{id,slug,title,composer,artists,views7d}]
          setSongs(Array.isArray(data) ? data : []);
        } else {
          // === Giữ nguyên flow cũ cho các sort khác ===
          const queryString = searchParams.toString();
          const songsUrl = `${API_BASE_URL}/api/songs?${queryString}`;
          const res = await fetch(songsUrl);
          if (res.ok) {
            const songsData = await res.json();
            setSongs(songsData.data || []);
          } else {
            setSongs([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [searchParams, isTrendingMode]);

  // Trích xuất giá trị ban đầu cho FilterSidebar (không dùng khi trending)
  const initialSelectedGenres = searchParams.get('genre')?.split(',') || [];
  const initialComposer = searchParams.get('composer') || '';
  const initialSort = sortParam;

  return (
    <div className="container list-page-layout">
      {/* === Khi 'trending', ẩn FilterSidebar cho gọn === */}
      {!isTrendingMode && (
        <aside className="list-sidebar">
          <FilterSidebar
            genres={genres}
            initialSelectedGenres={initialSelectedGenres}
            initialComposer={initialComposer}
            initialSort={initialSort}
          />
        </aside>
      )}

      <main className="list-main-content">
        {/* === Tiêu đề động === */}
        <h1 className="text-4xl font-bold" style={{ marginBottom: '0.25rem' }}>
          {isTrendingMode ? 'Thịnh hành' : 'Thư viện Hợp âm'}
        </h1>
        {isTrendingMode && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Top bài được xem nhiều trong <strong>7 ngày gần đây</strong>.
          </p>
        )}

        {isLoading ? (
          <SongListSkeleton />
        ) : songs.length > 0 ? (
          // SongList đã hỗ trợ hiển thị composer; nếu có views7d, component sẽ hiển thị nhỏ ở bên phải (xem cập nhật file SongList.js)
          <SongList songs={songs} />
        ) : (
          <p>Không tìm thấy bài hát nào khớp với bộ lọc của bạn.</p>
        )}
      </main>
    </div>
  );
}
