// src/components/RecentlyAddedSection.js
"use client";

import { useState, useEffect } from 'react';
import SongCard from './SongCard';
import styles from './RecentlyAddedSection.module.css';

const RecentlyAddedSection = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewestSongs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/songs/newest');
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Failed to fetch newest songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewestSongs();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Mới Cập Nhật</h2>
        {isLoading ? (
          <p>Đang tải bài hát...</p>
        ) : (
          <div className={styles.songsGrid}>
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAddedSection;