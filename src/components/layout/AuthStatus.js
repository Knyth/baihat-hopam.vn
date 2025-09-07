// src/components/layout/AuthStatus.js
// Server Component

import Link from "next/link";
import { auth } from "../../lib/auth";
import UserMenu from "./UserMenu";
import styles from "./Header.module.css";

export default async function AuthStatus() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <nav className={styles.nav} aria-label="Tài khoản">
        <Link href="/auth" className={styles.cta}>
          Đăng nhập / Đăng ký
        </Link>
      </nav>
    );
  }

  return (
    <nav className={styles.nav} aria-label="Tài khoản">
      <UserMenu
        name={user.name || "Bạn"}
        email={user.email || ""}
        image={user.image || ""}
      />
    </nav>
  );
}
