// src/components/layout/Header.js

import Link from 'next/link';
import styles from './Header.module.css';
import AuthStatus from './AuthStatus'; // <-- IMPORT "TRINH SÁT"

// Header giờ là một component Server tĩnh, không còn async
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <div className={styles.logo}>
          <Link href="/">baihat-hopam.vn</Link>
        </div>
        
        <nav className={styles.navigation}>
          {/* Giao toàn bộ nhiệm vụ động cho AuthStatus */}
          <AuthStatus />
        </nav>
      </div>
    </header>
  );
}