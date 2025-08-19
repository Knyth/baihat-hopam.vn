"use client"; // Quan trọng: Phải có dòng này ở đầu tiên

import { useState } from 'react';
import SongLyrics from '@/components/SongLyrics';
import ControlPanel from '@/components/ControlPanel';

export default function SongDisplay({ songData }) {
  // "Trí nhớ" về cỡ chữ
  const [fontSize, setFontSize] = useState(18); // Giá trị ban đầu là 18

  // Hàm cập nhật "trí nhớ"
  const handleFontSizeChange = (amount) => {
    setFontSize(prevSize => Math.max(12, Math.min(32, prevSize + amount)));
  };

  return (
    <div className="song-detail-layout">
      {/* Cột chính - Nội dung bài hát */}
      <main className="song-content">
        <h1 className="text-4xl font-bold">{songData.title}</h1>
        <h2 className="text-2xl text-gray-600 mt-2">
          Sáng tác: {songData.composer.name}
        </h2>
        
        {/* Di chuyển style vào đây */}
        <div style={{ fontSize: `${fontSize}px` }}> 
          <SongLyrics lyrics_chords={songData.lyrics_chords} />
        </div>
      </main>

      {/* Cột phụ - Bảng điều khiển */}
      <aside className="song-sidebar">
        <ControlPanel 
          original_key={songData.original_key}
          onFontSizeChange={handleFontSizeChange}
        />
      </aside>
    </div>
  );
}