// src/components/HeroSection.js
"use client";

import Link from 'next/link';
import styles from './HeroSection.module.css'; // Chúng ta sẽ tạo file CSS này ở bước sau

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Thư viện Hợp âm & Sheet nhạc cho Người yêu nhạc Việt
        </h1>
        <p className={styles.heroSubtitle}>
          Tìm kiếm, tùy chỉnh tông, và tải về hàng ngàn bài hát
          một cách dễ dàng và hoàn toàn miễn phí.
        </p>
        <Link href="/songs" className={styles.heroCtaButton}>
          Khám phá Ngay
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;