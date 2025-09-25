// src/components/BrowseByGenreSection.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./BrowseByGenreSection.module.css";

const BrowseByGenreSection = () => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/genres/featured", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (mounted) setGenres(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        if (mounted) setGenres([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchGenres();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Khám phá theo Thể loại</h2>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : genres.length === 0 ? (
          <p>Chưa có thể loại nổi bật.</p>
        ) : (
          <div className={styles.genreGrid}>
            {genres.map((genre) => (
              <Link
                key={genre.slug || genre.id}
                href={`/genres/${genre.slug}`}
                className={styles.genreTag}
              >
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
