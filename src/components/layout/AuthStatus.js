// src/components/layout/AuthStatus.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from './UserMenu';
import styles from './Header.module.css';

export default function AuthStatus() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Khi component được tải ở client, nó sẽ gọi API để kiểm tra trạng thái đăng nhập
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    // Trong khi đang kiểm tra, có thể hiển thị một placeholder trống
    return <div style={{width: '120px', height: '40px'}}></div>;
  }

  return (
    <>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <>
          <Link href="/auth" className={styles.navLink}>Đăng nhập</Link>
          <Link href="/auth" className={`${styles.navLink} ${styles.signUp}`}>Đăng ký</Link>
        </>
      )}
    </>
  );
}