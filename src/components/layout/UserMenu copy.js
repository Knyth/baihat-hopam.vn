// src/components/layout/UserMenu.js
"use client";

import { useState } from 'react';
import Link from 'next/link'; // <-- Đổi 'a' thành 'Link' để điều hướng mượt hơn
import styles from './Header.module.css';
import { logout } from './actions';

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  // Không cần hàm handleLogout nữa

  return (
    <div className={styles.userMenu} onMouseLeave={() => setIsOpen(false)}>
      <button 
        className={styles.avatarButton} 
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)} // Thêm onClick để hoạt động tốt hơn trên mobile
      >
        <span>{user.username}</span>
        <div className={styles.avatarPlaceholder}>{user.username.charAt(0).toUpperCase()}</div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/my-songs" className={styles.dropdownItem}>Bài hát yêu thích</Link>
          <Link href="/settings" className={styles.dropdownItem}>Cài đặt tài khoản</Link>
          <hr className={styles.dropdownDivider} />
          
          {/* === NÂNG CẤP QUAN TRỌNG NHẤT === */}
          {/* Bọc nút Đăng xuất trong một thẻ form để đảm bảo Server Action được kích hoạt đúng cách */}
          <form action={logout}>
            <button type="submit" className={styles.dropdownItem}>
              Đăng xuất
            </button>
          </form>

        </div>
      )}
    </div>
  );
}