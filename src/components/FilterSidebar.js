// src/components/FilterSidebar.js

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react';

export default function FilterSidebar({ genres, composers }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const handleComposerSearch = (e) => {
    e.preventDefault(); 
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
  
  // === HÀM MỚI: Xử lý khi người dùng thay đổi cách sắp xếp ===
  const handleSortChange = (sortValue) => {
    const params = new URLSearchParams(searchParams);
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort'); // Mặc dù chúng ta sẽ luôn có giá trị mặc định
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
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Tác giả</h4>
        <form onSubmit={handleComposerSearch}>
          <input 
            type="text" 
            placeholder="Tìm tên tác giả..." 
            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} 
            onChange={(e) => setComposerSearch(e.target.value)}
            value={composerSearch}
          />
        </form>
      </div>

       {/* === NỐI DÂY ĐIỆN CHO BỘ SẮP XẾP === */}
       <div>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Sắp xếp theo</h4>
        <select 
          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
          // 1. Gán giá trị từ URL, nếu không có thì mặc định là 'newest'
          value={searchParams.get('sort') || 'newest'}
          // 2. Gọi hàm handleSortChange khi người dùng chọn
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="views">Xem nhiều nhất</option>
          <option value="name_asc">Tên (A-Z)</option>
        </select>
      </div>
    </div>
  );
}