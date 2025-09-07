// src/components/layout/AuthStatus.js
"use client";

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import styles from './Header.module.css'; // Tái sử dụng style của Header

export default function AuthStatus({ session }) {
  // Không cần useSession hay status loading nữa
  // Dữ liệu đã có sẵn từ server

  return (
    <div className={styles.userActions}>
      {session?.user ? (
        <>
          <span className={styles.username}>
            Chào, {session.user.name || session.user.email}
          </span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/auth" className={styles.navButton}>
            Đăng nhập
          </Link>
          <Link href="/auth" className={`${styles.navButton} ${styles.primary}`}>
            Đăng ký
          </Link>
        </>
      )}
    </div>
  );
}