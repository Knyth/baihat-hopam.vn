// src/components/layout/Header.js
import Link from "next/link";
import { auth } from "@/lib/auth";
import AuthStatus from "./AuthStatus";
import MobileMenuClient from "./MobileMenuClient";
import LibraryMenuClient from "./LibraryMenuClient";
import SearchBarClient from "./SearchBarClient";
import styles from "./Header.module.css";

export default async function Header() {
  const session = await auth();
  const user = session?.user ?? null;
  const canUpload =
    !!session?.user &&
    (session.user.role === "contributor" || session.user.role === "admin");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* LEFT: Logo + Thư viện */}
        <div className={styles.left}>
          <Link href="/" className={styles.logo} aria-label="Trang chủ">
            <span className={styles.logoFull}>baihat-hopam.vn</span>
            <span className={styles.logoShort}>BH-HA.VN</span>
          </Link>

          {/* Thư viện: dropdown (desktop) */}
          <div className={styles.hideOnMobile}>
            <LibraryMenuClient />
          </div>
        </div>

        {/* MIDDLE: Search */}
        <div className={styles.middle}>
          <SearchBarClient />
        </div>

        {/* RIGHT: Nav + User + Hamburger */}
        <div className={styles.right}>
          <nav className={`${styles.mainNav} ${styles.hideOnMobile}`} aria-label="Điều hướng">
            <Link href="/songs?sort=new" className={styles.navLink}>Bài hát mới</Link>
            <Link href="/songs?sort=trending" className={styles.navLink}>Thịnh hành</Link>
            <Link href="/blog" className={styles.navLink}>Blog</Link>
          </nav>

          {canUpload && (
            <Link href="/upload" className={`${styles.cta} ${styles.hideOnMobile}`}>
              + Tải bài hát
            </Link>
          )}

          <div className={styles.hideOnMobile}>
            <AuthStatus />
          </div>

          {/* Mobile hamburger */}
          <div className={styles.mobileOnly}>
            <MobileMenuClient user={user} canUpload={canUpload} />
          </div>
        </div>
      </div>
    </header>
  );
}
