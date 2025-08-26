// src/components/TrendingSection.js
"use client";

import { useState, useEffect } from 'react';
// === DÒNG CODE ĐƯỢC THÊM VÀO ===
import Link from 'next/link'; 
import styles from './TrendingSection.module.css';

const TrendingSection = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/songs/trending');
        const data = await response.json();
        setSongs(data);
      // === DÒNG CODE ĐÃ ĐƯỢC SỬA LỖI ===
      } catch (error) { 
        console.error("Failed to fetch trending songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Thịnh hành trong Tuần</h2>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <ol className={styles.songList}>
            {songs.map((song, index) => (
              <li key={song.id} className={styles.songListItem}>
                <span className={styles.songRank}>{index + 1}</span>
                <div className={styles.songInfo}>
                    <h3 className={styles.songTitle}>
                        {/* === SỬA THẺ <a> THÀNH COMPONENT <Link> === */}
                        <Link href={`/songs/${song.slug}`}>{song.title}</Link>
                    </h3>
                    <p className={styles.displayName}>
                        {song.artists?.[0]?.name || song.composer?.name || ''}
                    </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;