// src/components/layout/Header.js
"use client"; // <-- BIẾN THÀNH CLIENT COMPONENT

import { useState, useEffect } from 'react'; // <-- IMPORT HOOKS
import Link from 'next/link';
import styles from './Header.module.css';
import AuthStatus from './AuthStatus';

export default function Header() {
  // 1. Tạo "bộ nhớ" để lưu trạng thái đã cuộn
  const [scrolled, setScrolled] = useState(false);

  // 2. Tạo "cảm biến" để lắng nghe sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      // Nếu vị trí cuộn > 10px, đặt trạng thái là "đã cuộn"
      // Nếu không, đặt là "chưa cuộn"
      setScrolled(window.scrollY > 10);
    };

    // Gắn "cảm biến" vào cửa sổ trình duyệt
    window.addEventListener('scroll', handleScroll);

    // Dọn dẹp "cảm biến" khi component bị hủy để tránh rò rỉ bộ nhớ
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Mảng rỗng đảm bảo hiệu ứng chỉ chạy 1 lần

  return (
    // 3. Thay đổi class linh động dựa trên trạng thái "scrolled"
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        <div className={styles.logo}>
          <Link href="/">baihat-hopam.vn</Link>
        </div>
        
        <nav className={styles.navigation}>
          <AuthStatus />
        </nav>
      </div>
    </header>
  );
}