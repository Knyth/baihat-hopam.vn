// src/components/SongListContainer.js
"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import SongList from './SongList';
import SongListSkeleton from './SongListSkeleton';
export default function SongListContainer({ genres }) {
  const searchParams = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      // Xây dựng query string một cách an toàn từ hook
      const queryString = searchParams.toString();
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const songsUrl = `${API_BASE_URL}/api/songs?${queryString}`;
      
      try {
        const res = await fetch(songsUrl);
        if (res.ok) {
          const songsData = await res.json();
          setSongs(songsData.data || []);
        } else {
          setSongs([]);
        }
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, [searchParams]); // Chạy lại mỗi khi searchParams thay đổi
  // Trích xuất các giá trị ban đầu cho FilterSidebar
  const initialSelectedGenres = searchParams.get('genre')?.split(',') || [];
  const initialComposer = searchParams.get('composer') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  return (
    <div className="container list-page-layout">
      <aside className="list-sidebar">
        <FilterSidebar
          genres={genres}
          initialSelectedGenres={initialSelectedGenres}
          initialComposer={initialComposer}
          initialSort={initialSort}
        />
      </aside>
      <main className="list-main-content">
        <h1 className="text-4xl font-bold" style={{ marginBottom: '1rem' }}>
          Thư viện Hợp âm
        </h1>
        {isLoading ? (
          <SongListSkeleton />
        ) : songs.length > 0 ? (
          <SongList songs={songs} />
        ) : (
          <p>Không tìm thấy bài hát nào khớp với bộ lọc của bạn.</p>
        )}
      </main>
    </div>
  );
}
