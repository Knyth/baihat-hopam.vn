// src/components/TrendingSection.js
// Giữ nguyên form + chiều rộng; chỉ thêm metric (số + pill "7 ngày")

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./TrendingSection.module.css";
import TrendingSkeleton from "./TrendingSkeleton";

function rankClass(idx) {
  if (idx === 0) return styles.rank1;
  if (idx === 1) return styles.rank2;
  if (idx === 2) return styles.rank3;
  return "";
}

export default function TrendingSection({
  title = "Thịnh hành trong Tuần",
  limit = 8,
  layout = "list", // 'list' | 'grid'
  viewAllHref = "/songs?sort=trending",
  showMetric = "views", // 'views' | null
  days = 7,
}) {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function fetchTrending() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/songs/trending?limit=${encodeURIComponent(limit)}&days=${encodeURIComponent(days)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch trending");
        const data = await res.json();
        if (!ignore) setSongs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch trending songs:", err);
          setSongs([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchTrending();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [limit, days]);

  return (
    <section className={styles.section} aria-labelledby="trending-title">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <h2 id="trending-title" className={styles.sectionTitle}>
            {title}
          </h2>
          <div className={styles.headerActions}>
            <Link href={viewAllHref} className={styles.viewAll}>
              Xem tất cả
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <TrendingSkeleton rows={limit} variant={layout} />
        ) : songs.length > 0 ? (
          layout === "grid" ? (
            <ol className={styles.grid} role="list">
              {songs.map((song, index) => {
                const displayName = song?.artists?.[0]?.name || song?.composer?.name || "";
                return (
                  <li key={song.id} className={styles.gridItem}>
                    <div className={`${styles.rankBadge} ${rankClass(index)}`}>{index + 1}</div>
                    <h3 className={styles.songTitle}>
                      <Link href={`/songs/${song.slug}`}>{song.title}</Link>
                    </h3>
                    <p className={styles.displayName}>{displayName}</p>

                    {showMetric === "views" && (
                      <div className={styles.metric} aria-label="Lượt xem trong 7 ngày">
                        <span className={styles.metricNumber}>
                          {Intl.NumberFormat("vi-VN").format(song.views || 0)}
                        </span>
                        {/* >>> pill 7 ngày (bo góc nhỏ) */}
                        <span className={styles.metricHint}>7 ngày</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <ol className={styles.songList} role="list">
              {songs.map((song, index) => {
                const displayName = song?.artists?.[0]?.name || song?.composer?.name || "";
                return (
                  <li key={song.id} className={styles.songListItem}>
                    <div className={`${styles.songRank} ${rankClass(index)}`}>{index + 1}</div>

                    <div className={styles.songInfo}>
                      <h3 className={styles.songTitle}>
                        <Link href={`/songs/${song.slug}`}>{song.title}</Link>
                      </h3>
                      <p className={styles.displayName}>{displayName}</p>
                    </div>

                    {showMetric === "views" && (
                      <div className={styles.metric} aria-label="Lượt xem trong 7 ngày">
                        <span className={styles.metricNumber}>
                          {Intl.NumberFormat("vi-VN").format(song.views || 0)}
                        </span>
                        {/* >>> pill 7 ngày (bo góc nhỏ) */}
                        <span className={styles.metricHint}>7 ngày</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )
        ) : (
          <div className={styles.emptyWrap}>
            <div className={styles.emptyState}>
              <h3>Chưa có bài thịnh hành</h3>
              <p>Hãy quay lại sau hoặc khám phá mục Mới Cập Nhật nhé.</p>
              <Link href="/songs?sort=new" className={styles.linkButton}>
                Xem bài mới
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
