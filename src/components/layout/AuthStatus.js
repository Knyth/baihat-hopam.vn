// src/components/layout/AuthStatus.js
// Server Component

import Link from "next/link";
import { auth } from "../../lib/auth";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";

export default async function AuthStatus() {
  const session = await auth();
  const user = session?.user;

  // Chưa đăng nhập → CTA
  if (!user) {
    return (
      <nav className={styles.userArea} aria-label="Tài khoản">
        <Link href="/auth" className={styles.cta}>
          Đăng nhập / Đăng ký
        </Link>
      </nav>
    );
  }

  // Đã đăng nhập: ẩn/hiện +Tải bài hát theo role
  const canUpload = user?.role === "contributor" || user?.role === "admin";

  return (
    <nav className={styles.userArea} aria-label="Tài khoản">
      {canUpload && (
        <Link href="/upload" className={styles.navLink}>
          + Tải bài hát
        </Link>
      )}

      <UserMenu name={user.name || "Bạn"} email={user.email || ""} image={user.image || ""} />
    </nav>
  );
}
