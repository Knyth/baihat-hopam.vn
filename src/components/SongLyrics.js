// src/components/SongLyrics.js

import transposeChord from '@/utils/music';

export default function SongLyrics({ lyrics_chords, transposeAmount }) {
  if (!lyrics_chords) return null;

  // Regex để tìm các hợp âm, ví dụ: [Am], [G7], [C#m]
  const regex = /\[([^\]]+)\]/g;
  const lines = lyrics_chords.split('\n');

  return (
    <div className="lyrics-container">
      {lines.map((line, lineIndex) => {
        if (line.trim() === '') {
          return <div key={`break-${lineIndex}`} style={{ height: '0.9em' }} />;
        }

        // Tách dòng thành các phần chữ và hợp âm
        const parts = line.split(regex);

        return (
          <div key={`line-${lineIndex}`} className="song-line">
            {parts.map((part, partIndex) => {
              // Các phần tử ở vị trí lẻ chính là hợp âm (nội dung bên trong ngoặc)
              if (partIndex % 2 === 1) {
                // Tính toán hợp âm mới dựa trên hợp âm gốc (part) và mức độ dịch chuyển
                const newChord = transposeChord(part, transposeAmount);
                return (
                  <span 
                    key={`chord-${partIndex}`} 
                    className="chord" 
                  >
                    [{newChord}]
                  </span>
                );
              } else {
                // Các phần tử ở vị trí chẵn là phần lời bài hát
                return part;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}