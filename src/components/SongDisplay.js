"use client";

import { useState, useMemo } from 'react';
import SongLyrics from '@/components/SongLyrics';
import ControlPanel from '@/components/ControlPanel';
// === THAY ĐỔI QUAN TRỌNG NHẤT LÀ ĐÂY ===
// Nhập khẩu "gói hàng" mặc định và đặt tên cho nó là transposeChord
import transposeChord from '@/utils/music';

export default function SongDisplay({ songData }) {
  const [fontSize, setFontSize] = useState(18);
  const [transposeStep, setTransposeStep] = useState(0);

  const handleFontSizeChange = (amount) => {
    setFontSize(prevSize => Math.max(12, Math.min(32, prevSize + amount)));
  };

  const handleTranspose = (amount) => {
    setTransposeStep(prevStep => prevStep + amount);
  };

  const transposedLyrics = useMemo(() => {
    if (transposeStep === 0) return songData.lyrics_chords;
    const regex = /\[([^\]]+)\]/g;
    return songData.lyrics_chords.replace(regex, (match, chord) => {
      // Bây giờ chúng ta có thể gọi trực tiếp, không cần musicUtils. nữa
      const transposed = transposeChord(chord, transposeStep);
      return `[${transposed}]`;
    });
  }, [transposeStep, songData.lyrics_chords]);

  const currentKey = useMemo(() => {
    // Gọi trực tiếp
    return transposeChord(songData.original_key, transposeStep);
  }, [transposeStep, songData.original_key]);

  return (
    <div className="song-detail-layout">
      <main className="song-content">
        <h1 className="text-4xl font-bold">{songData.title}</h1>
        <h2 className="text-2xl text-gray-600 mt-2">
          Sáng tác: {songData.composer.name}
        </h2>
        
        <div id="song-content-to-print" style={{ fontSize: `${fontSize}px` }}>
          <SongLyrics lyrics_chords={transposedLyrics} />
        </div>
      </main>

      <aside className="song-sidebar">
        <ControlPanel 
          current_key={currentKey}
          onFontSizeChange={handleFontSizeChange}
          onTranspose={handleTranspose}
          songSlug={songData.slug}
        />
      </aside>
    </div>
  );
}

