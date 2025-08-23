// src/components/SongList.js

"use client"; // === DẤU HIỆU QUAN TRỌNG NHẤT: Biến component này thành Client Component ===

import Link from 'next/link';

export default function SongList({ songs }) {
  // Toàn bộ logic hiển thị danh sách bây giờ nằm ở đây
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {songs.map((song) => (
        <li key={song.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
          <Link 
            href={`/songs/${song.slug}`} 
            style={{ 
              display: 'block', 
              padding: '1.25rem 0.5rem', 
              textDecoration: 'none', 
              color: 'inherit', 
              transition: 'background-color 0.2s' 
            }}
            // Các trình xử lý sự kiện bây giờ hoàn toàn hợp lệ trong Client Component
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '600' }}>
              {song.title}
            </h2>
            {song.composer && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {song.composer.name}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}