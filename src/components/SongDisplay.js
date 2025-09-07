// src/components/SongDisplay.js
"use client";

import React, { useState, useMemo } from 'react';
import { transposeChord } from '@/utils/music';
import styles from './SongDisplay.module.css';
import ControlPanel from './ControlPanel'; 

export default function SongDisplay({ songData, initialIsFavorited, isLoggedIn }) {
  const [transposeAmount, setTransposeAmount] = useState(0);
  const [fontSize, setFontSize] = useState(16);

  const handleTranspose = (amount) => {
    setTransposeAmount(prev => prev + amount);
  };
  
  const handleFontSizeChange = (amount) => {
    setFontSize(prev => Math.max(10, Math.min(32, prev + amount)));
  }

  const displayKey = transposeChord(songData.originalKey, transposeAmount);

  const parsedLyrics = useMemo(() => {
    if (!songData.lyricsChords) return null;
    const correctedLyrics = songData.lyricsChords.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
    const chordRegex = /(\[[^\]]+\])/g;

    return correctedLyrics.split('\n').map((line, lineIndex) => {
      if (line.trim() === '') {
        return <div key={lineIndex} className={styles.lineBreak}></div>;
      }
      const parts = line.split(chordRegex);
      return <div key={lineIndex} className={styles.lyricsLine}>{
        parts.map((part, partIndex) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            const originalChord = part.slice(1, -1);
            return (
              <strong key={partIndex} className={styles.chord}>
                [{transposeChord(originalChord, transposeAmount)}]
              </strong>
            );
          }
          return <span key={partIndex}>{part}</span>;
        })
      }</div>;
    });
  }, [songData.lyricsChords, transposeAmount]);

  return (
    <div className={styles.songDetailLayout}> 
      <div className={styles.mainContent}>
        <div id="song-content-to-print">
          <div className={styles.header}>
              <h1>{songData.title}</h1>
              {/* --- DÒNG CODE ĐÃ ĐƯỢC CẬP NHẬT --- */}
              <p className={styles.songMeta}>
                Sáng tác: 
                <a 
                  href={`/composers/${songData.composer?.slug}`} 
                  className={styles.composerLink} /* <<< THÊM CLASS VÀO ĐÂY */
                >
                  {songData.composer?.name}
                </a>
              </p>
          </div>
          <div className={styles.lyricsContainer} style={{ fontSize: `${fontSize}px` }}>
              {parsedLyrics}
          </div>
        </div>
      </div>

      <aside className={styles.sidebar}>
          <ControlPanel
            current_key={displayKey}
            onTranspose={handleTranspose}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            songSlug={songData.slug}
            songId={songData.id}
            initialIsFavorited={initialIsFavorited}
            isLoggedIn={isLoggedIn}
          />
      </aside>
    </div>
  );
}