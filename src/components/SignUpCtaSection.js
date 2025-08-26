// src/components/SignUpCtaSection.js
"use client";

import Link from 'next/link';
import styles from './SignUpCtaSection.module.css';

const SignUpCtaSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Trở thành một phần của Cộng đồng!</h2>
        <p className={styles.subtitle}>
          Lưu bài hát yêu thích, tạo playlist riêng và nhận những cập nhật mới nhất. Hoàn toàn miễn phí!
        </p>
        <Link href="/login" className={styles.ctaButton}>
          Đăng ký Ngay
        </Link>
      </div>
    </section>
  );
};

export default SignUpCtaSection;