// src/components/layout/Header.js
// --- BÂY GIỜ LÀ SERVER COMPONENT ---

import Link from 'next/link';
import { auth } from '@/lib/auth'; // <-- Lấy auth từ server
import AuthStatus from './AuthStatus'; // <-- Component mới sẽ được tạo
import styles from './Header.module.css';

export default async function Header() {
  const session = await auth(); // Lấy session ở phía server

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          baihat-hopam.vn
        </Link>
        {/* Truyền session xuống cho Client Component để xử lý hiển thị */}
        <AuthStatus session={session} /> 
      </div>
    </header>
  );
}