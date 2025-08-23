// src/components/SongLyrics.js

export default function SongLyrics({ lyrics_chords }) {
  if (!lyrics_chords) return null;

  const regex = /\[([^\]]+)\]/g;
  const lines = lyrics_chords.split('\n');

  return (
    <div className="lyrics-container">
      {lines.map((line, lineIndex) => {
        if (line.trim() === '') {
          return <div key={`break-${lineIndex}`} style={{ height: '0.9em' }} />;
        }

        const parts = line.split(regex);

        return (
          <div key={`line-${lineIndex}`} className="song-line">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return (
                  <span key={`chord-${partIndex}`} className="chord">
                    [{part}]
                  </span>
                );
              } else {
                return part;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}