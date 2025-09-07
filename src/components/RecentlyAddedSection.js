// src/components/RecentlyAddedSection.js

"use client"; // <-- BƯỚC 1: BIẾN NÓ THÀNH CLIENT COMPONENT

import React from 'react';
import Link from 'next/link';

// Component SongCard bây giờ chỉ là một phần của Client Component, hoàn toàn hợp lệ
function SongCard({ song }) {
    // Style tạm thời cho card
    const cardStyles = {
        display: 'block',
        border: '1px solid #ddd',
        padding: '1rem',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.2s',
    };

    // BƯỚC 2: LOGIC TƯƠNG TÁC ĐƯỢC XỬ LÝ HOÀN TOÀN BÊN TRONG CLIENT COMPONENT
    const handleMouseOver = (e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <Link 
            href={`/songs/${song.slug}`} 
            style={cardStyles}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <h3>{song.title}</h3>
        </Link>
    );
}

export default function RecentlyAddedSection({ songs }) {
  // Styles tạm thời
  const styles = {
    section: { padding: '2rem 0' },
    title: { fontSize: '2rem', marginBottom: '1.5rem' },
    songsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
    emptyMessage: { color: '#666' }
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Mới Cập Nhật</h2>
      
      {Array.isArray(songs) && songs.length > 0 ? (
        <div style={styles.songsGrid}>
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <p style={styles.emptyMessage}>Chưa có bài hát nào được thêm vào.</p>
      )}
      
    </section>
  );
}