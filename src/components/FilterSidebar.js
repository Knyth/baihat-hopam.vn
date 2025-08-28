// src/components/FilterSidebar.js
"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
// Component giờ đây nhận các giá trị mặc định từ props
export default function FilterSidebar({ genres, initialSelectedGenres, initialComposer, initialSort }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleFilterChange = (filterType, value) => {
    // Tạo URLSearchParams từ URL hiện tại để giữ các bộ lọc khác
    const params = new URLSearchParams(window.location.search);
    if (filterType === 'genre') {
      const currentGenres = params.get('genre')?.split(',').filter(Boolean) || [];
      if (currentGenres.includes(value)) {
        const newGenres = currentGenres.filter(g => g !== value);
        if (newGenres.length > 0) {
          params.set('genre', newGenres.join(','));
        } else {
          params.delete('genre');
        }
      } else {
        currentGenres.push(value);
        params.set('genre', currentGenres.join(','));
      }
    } else if (filterType === 'composer') {
        if (value) {
            params.set('composer', value);
        } else {
            params.delete('composer');
        }
    } else if (filterType === 'sort') {
        params.set('sort', value);
    }
    
    startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
    });
  };
  
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
                onChange={() => handleFilterChange('genre', genre.slug)}
                // Đọc giá trị từ prop, không còn dùng hook
                checked={initialSelectedGenres.includes(genre.slug)}
              /> 
              {genre.name}
            </label>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Tác giả</h4>
        <form onSubmit={(e) => { e.preventDefault(); handleFilterChange('composer', e.target.elements.composer.value); }}>
          <input 
            name="composer" // Thêm name để dễ truy cập
            type="text" 
            placeholder="Tìm tên tác giả..." 
            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} 
            defaultValue={initialComposer} // Dùng defaultValue để không cần state
          />
        </form>
      </div>
       <div>
        <h4 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Sắp xếp theo</h4>
        <select 
          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
          value={initialSort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="views">Xem nhiều nhất</option>
          <option value="name_asc">Tên (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
