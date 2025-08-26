// src/components/FeaturedComposersSection.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Dùng Image component của Next.js để tối ưu hóa ảnh
import styles from './FeaturedComposersSection.module.css';

const FeaturedComposersSection = () => {
  const [composers, setComposers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComposers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/composers/featured');
        const data = await response.json();
        setComposers(data);
      } catch (error) {
        console.error("Failed to fetch composers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComposers();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Tác giả Nổi bật</h2>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <div className={styles.composerGrid}>
            {composers.map(composer => (
              <Link key={composer.slug} href={`/composers/${composer.slug}`} className={styles.composerCard}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src={composer.image_url || '/default-avatar.png'} // Dùng ảnh mặc định nếu không có
                    alt={`Ảnh của ${composer.name}`}
                    width={100}
                    height={100}
                    className={styles.avatar}
                  />
                </div>
                <p className={styles.composerName}>{composer.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedComposersSection;