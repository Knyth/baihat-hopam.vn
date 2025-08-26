// src/components/SongDisplay.js

"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SongLyrics from '@/components/SongLyrics';
import ControlPanel from '@/components/ControlPanel';
import transposeChord from '@/utils/music';
import SongDetailPageLayout from './SongDetailPageLayout';

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

  const mainContent = (
    <div id="song-content-to-print" style={{ paddingBottom: '50px' }}>
      <h1 className="text-4xl font-bold">{songData.title}</h1>
      
      {/* === KHỐI CODE ĐƯỢC CẬP NHẬT === */}
      <div className="text-lg text-gray-600 mt-2">
        <p>
          Sáng tác: {' '}
          <Link href={`/composers/${songData.composer.slug}`} className="composer-link">
            {songData.composer.name}
          </Link>
        </p>
        {songData.artists && songData.artists.length > 0 && (
          <p>
            Trình bày: {' '}
            {songData.artists.map((artist, index) => (
              <span key={artist.slug}>
                <Link href={`/artists/${artist.slug}`} className="composer-link">
                  {artist.name}
                </Link>
                {index < songData.artists.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        )}
      </div>

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

  return (
    <SongDetailPageLayout 
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
}