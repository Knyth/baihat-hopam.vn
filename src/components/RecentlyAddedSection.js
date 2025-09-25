// src/components/RecentlyAddedSection.js

"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./RecentlyAddedSection.module.css";
import SongCard from "./SongCard";

/**
 * RecentlyAddedSection (v2)
 * - Auto-hide arrows nếu số bài ≤ 4
 * - Fallback Grid khi ít bài, Carousel khi nhiều bài
 * - Có "Xem tất cả" dẫn tới /songs?sort=new
 */
export default function RecentlyAddedSection({ songs, title = "Mới Cập Nhật", isLoading = false }) {
  const loading = isLoading || songs === "loading";
  const list = Array.isArray(songs) ? songs : [];

  const fewItems = list.length <= 4; // <=4: hiển thị dạng grid gọn
  const showArrows = !fewItems; // chỉ hiện mũi tên khi có thể cuộn

  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateNavState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    if (fewItems) return; // grid mode: không cần theo dõi scroll
    updateNavState();
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => updateNavState();
    el.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [fewItems, updateNavState]);

  const scrollByAmount = useMemo(() => 3 * 280, []);
  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });

  const skeletons = useMemo(() => new Array(fewItems ? 4 : 8).fill(0), [fewItems]);

  return (
    <section className={styles.section} aria-labelledby="recently-added-title">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 id="recently-added-title" className={styles.sectionTitle}>
            {title}
          </h2>

          <div className={styles.headerActions}>
            {list.length > 0 && (
              <Link href="/songs?sort=new" className={styles.viewAll}>
                Xem tất cả
              </Link>
            )}
            {showArrows && (
              <div className={styles.navGroup} aria-hidden={!showArrows}>
                <button
                  className={styles.navButton}
                  onClick={scrollLeft}
                  disabled={!canLeft}
                  aria-label="Cuộn sang trái"
                >
                  ‹
                </button>
                <button
                  className={styles.navButton}
                  onClick={scrollRight}
                  disabled={!canRight}
                  aria-label="Cuộn sang phải"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading && (
          <div
            className={fewItems ? styles.grid : styles.carousel}
            ref={!fewItems ? scrollRef : undefined}
          >
            <div className={fewItems ? styles.gridInner : styles.track}>
              {skeletons.map((_, i) => (
                <div key={`sk-${i}`} className={styles.skeletonCard} aria-hidden="true">
                  <div className={styles.skTitle} />
                  <div className={styles.skMeta} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading &&
          list.length > 0 &&
          (fewItems ? (
            <div className={styles.grid}>
              <div className={styles.gridInner}>
                {list.map((song) => (
                  <div key={song.id} className={styles.item}>
                    <SongCard song={song} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.carousel} ref={scrollRef}>
              <div className={styles.track}>
                {list.map((song) => (
                  <div key={song.id} className={styles.item}>
                    <SongCard song={song} />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {!loading && list.length === 0 && (
          <div className={styles.emptyWrap}>
            <div className={styles.emptyState}>
              <h3>Chưa có bài hát nào được thêm vào</h3>
              <p>Hãy quay lại sau hoặc khám phá các mục thịnh hành nhé.</p>
              <Link href="/songs?sort=trending" className={styles.linkButton}>
                Xem thịnh hành
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
