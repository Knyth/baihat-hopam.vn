// src/components/SongDisplay.js

"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SongLyrics from '@/components/SongLyrics';
import ControlPanel from '@/components/ControlPanel';
import transposeChord from '@/utils/music';
import SongDetailPageLayout from './SongDetailPageLayout'; // === IMPORT LAYOUT MỚI ===

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
      const transposed = transposeChord( chord, transposeStep);
      return `[${transposed}]`;
    });
  }, [transposeStep, songData.lyrics_chords]);

  const currentKey = useMemo(() => {
    return transposeChord(songData.original_key, transposeStep);
  }, [transposeStep, songData.original_key]);

  // === TÁCH RIÊNG NỘI DUNG 2 CỘT ===
  const mainContent = (
    <div id="song-content-to-print" style={{ paddingBottom: '50px' }}>
      <h1 className="text-4xl font-bold">{songData.title}</h1>
      <h2 className="text-lg text-gray-600 mt-2">
        Sáng tác: {' '}
        <Link href={`/composers/${songData.composer.slug}`} className="composer-link">
          {songData.composer.name}
        </Link>
      </h2>
      <div style={{ fontSize: `${fontSize}px` }} className="mt-6">
        <SongLyrics lyrics_chords={transposedLyrics} />
      </div>
    </div>
  );

  const sidebarContent = (
    <ControlPanel 
      current_key={currentKey}
      onFontSizeChange={handleFontSizeChange}
      onTranspose={handleTranspose}
      songSlug={songData.slug}
      fontSize={fontSize}
    />
  );

  // === DÙNG COMPONENT LAYOUT MỚI ĐỂ RENDER ===
  return (
    <SongDetailPageLayout 
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
}