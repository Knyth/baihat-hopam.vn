// src/components/RelatedSongs.js
// NEW: Section "Có thể bạn sẽ thích" – hiển thị các bài liên quan theo composer/genre.
// Dùng SongCard để đồng bộ UI.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SongCard from "./SongCard";
import styles from "./RelatedSongs.module.css";

export default function RelatedSongs({ slug, limit = 8, title = "Có thể bạn sẽ thích" }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/songs/related/${encodeURIComponent(slug)}?limit=${encodeURIComponent(limit)}`);
        const data = await res.json();
        if (alive) setSongs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch related songs:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug, limit]);

  if (!slug) return null;

  return (
    <section className={styles.section} aria-labelledby="related-songs-title">
      <div className={styles.headerRow}>
        <h2 id="related-songs-title" className={styles.sectionTitle}>{title}</h2>
        <Link href="/songs?sort=trending" className={styles.viewAll}>Xem thịnh hành</Link>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: Math.min(6, limit) }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} aria-hidden="true">
              <div className={styles.skTitle} />
              <div className={styles.skMeta} />
            </div>
          ))}
        </div>
      ) : songs.length > 0 ? (
        <div className={styles.grid}>
          {songs.map((song) => (
            <div key={song.id} className={styles.item}>
              <SongCard song={song} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          Chưa có gợi ý – hãy khám phá mục <Link href="/songs?sort=trending">Thịnh hành</Link>.
        </div>
      )}
    </section>
  );
}
