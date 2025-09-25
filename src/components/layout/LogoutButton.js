// src/components/layout/LogoutButton.js

import { logoutUser } from "@/app/auth/actions";
import styles from "./Header.module.css"; // Tái sử dụng style từ Header

export default function LogoutButton() {
  return (
    <form action={logoutUser}>
      <button type="submit" className={styles.navButton}>
        Đăng xuất
      </button>
    </form>
  );
}
