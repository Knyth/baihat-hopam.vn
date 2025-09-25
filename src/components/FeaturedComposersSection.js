// src/components/FeaturedComposersSection.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./FeaturedComposersSection.module.css";

const FeaturedComposersSection = () => {
  const [composers, setComposers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchComposers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/composers/featured", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setComposers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch composers:", error);
        if (mounted) setComposers([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchComposers();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Tác giả Nổi bật</h2>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : composers.length === 0 ? (
          <p>Chưa có tác giả nổi bật.</p>
        ) : (
          <div className={styles.composerGrid}>
            {composers.map((composer) => {
              const img =
                composer.imageUrl ||
                composer.image_url || // fallback nếu API cũ
                "/default-avatar.png";
              return (
                <Link
                  key={composer.slug || composer.id}
                  href={`/composers/${composer.slug}`}
                  className={styles.composerCard}
                >
                  <div className={styles.avatarWrapper}>
                    <Image
                      src={img}
                      alt={`Ảnh của ${composer.name}`}
                      width={100}
                      height={100}
                      className={styles.avatar}
                    />
                  </div>
                  <p className={styles.composerName}>{composer.name}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedComposersSection;
