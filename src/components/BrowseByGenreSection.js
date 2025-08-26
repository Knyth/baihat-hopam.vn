// src/components/BrowseByGenreSection.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './BrowseByGenreSection.module.css';

const BrowseByGenreSection = () => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/genres/featured');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Khám phá theo Thể loại</h2>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <div className={styles.genreGrid}>
            {genres.map(genre => (
              <Link key={genre.slug} href={`/genres/${genre.slug}`} className={styles.genreTag}>
                {genre.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseByGenreSection;