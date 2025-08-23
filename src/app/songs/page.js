// src/app/songs/page.js

import { Suspense } from 'react'; // === IMPORT Suspense ===
import FilterSidebar from '@/components/FilterSidebar';
import FilterableSongList from '@/components/FilterableSongList';
import SongListSkeleton from '@/components/SongListSkeleton'; // === IMPORT SKELETON ===

async function getFilterData() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const genresReq = fetch(`${API_BASE_URL}/api/genres`, { cache: 'no-store' });
  const composersReq = fetch(`${API_BASE_URL}/api/composers`, { cache: 'no-store' });
  const [genresRes, composersRes] = await Promise.all([genresReq, composersReq]);
  const genres = genresRes.ok ? await genresRes.json() : [];
  const composers = composersRes.ok ? await composersRes.json() : [];
  return { genres, composers };
}

export default async function SongListPage({ searchParams }) {
  const { genres, composers } = await getFilterData();

  return (
    <div className="list-page-layout">
      <aside className="list-sidebar">
        <FilterSidebar genres={genres} composers={composers} />
      </aside>
      <main className="list-main-content">
        <h1 className="text-4xl font-bold" style={{ marginBottom: '1rem' }}>
          Thư viện Hợp âm
        </h1>
        
        {/* === SỬ DỤNG SUSPENSE === */}
        <Suspense 
          // key này rất quan trọng, nó báo cho React biết cần render lại 
          // khi các tham số tìm kiếm thay đổi
          key={JSON.stringify(searchParams)} 
          // fallback là thứ sẽ được hiển thị trong khi chờ
          fallback={<SongListSkeleton />}
        >
          <FilterableSongList searchParams={searchParams} />
        </Suspense>

      </main>
    </div>
  );
}