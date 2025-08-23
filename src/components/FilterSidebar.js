// src/components/FilterSidebar.js

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react'; // === THÊM useState ===

export default function FilterSidebar({ genres, composers }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // === THÊM STATE ĐỂ QUẢN LÝ Ô TÌM KIẾM TÁC GIẢ ===
  const [composerSearch, setComposerSearch] = useState(searchParams.get('composer') || '');

  const handleFilterChange = (term, type) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      const currentGenres = params.get('genre')?.split(',') || [];
      if (currentGenres.includes(term)) {
        const newGenres = currentGenres.filter(g => g !== term);
        if (newGenres.length > 0) {
          params.set('genre', newGenres.join(','));
        } else {
          params.delete('genre');
        }
      } else {
        currentGenres.push(term);
        params.set('genre', currentGenres.join(','));
      }
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  // === HÀM MỚI: Xử lý khi người dùng tìm kiếm tác giả ===
  const handleComposerSearch = (e) => {
    e.preventDefault(); // Ngăn form tải lại cả trang
    const params = new URLSearchParams(searchParams);
    if (composerSearch) {
      params.set('composer', composerSearch);
    } else {
      params.delete('composer');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };
  
  const selectedGenres = searchParams.get('genre')?.split(',') || [];

  return (
    <div className="panel-card">
      <h3 className="panel-title">Bộ lọc & Sắp xếp</h3>
      <hr className="panel-divider" />
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Thể loại</h4>
        <div>
          {genres && genres.map(genre => (
            <label key={genre.id} style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                style={{ marginRight: '0.5rem' }} 
                onChange={() => handleFilterChange(genre.slug, 'genre')}
                checked={selectedGenres.includes(genre.slug)}
              /> 
              {genre.name}
            </label>
          ))}
        </div>
      </div>
      
      {/* === NỐI DÂY ĐIỆN CHO Ô TÌM KIẾM TÁC GIẢ === */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Tác giả</h4>
        {/* Bọc input trong một form */}
        <form onSubmit={handleComposerSearch}>
          <input 
            type="text" 
            placeholder="Tìm tên tác giả..." 
            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} 
            // Cập nhật state khi người dùng gõ
            onChange={(e) => setComposerSearch(e.target.value)}
            // Giá trị của input được kiểm soát bởi state
            value={composerSearch}
          />
          {/* Người dùng có thể nhấn Enter để tìm */}
        </form>
      </div>

       <div>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Sắp xếp theo</h4>
        <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <option>Mới nhất</option>
          <option>Xem nhiều nhất</option>
          <option>Tên (A-Z)</option>
        </select>
      </div>
    </div>
  );
}