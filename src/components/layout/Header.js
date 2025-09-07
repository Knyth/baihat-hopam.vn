// src/components/layout/Header.js
// Server Component

import Link from "next/link";
import AuthStatus from "./AuthStatus";
import SearchBar from "./SearchBar";
import styles from "./Header.module.css";

export default async function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* LEFT: Logo + Thư viện */}
        <div className={styles.left}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="baihat-hopam.vn - về trang chủ"
          >
            baihat-hopam.vn
          </Link>

          <Link href="/library" className={styles.libraryLink}>
            Thư viện
          </Link>
        </div>

        {/* MIDDLE: Search (mic | input | search) */}
        <div className={styles.middle} role="search">
          <SearchBar />
        </div>

        {/* RIGHT: Actions / Auth */}
        <div className={styles.right}>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
