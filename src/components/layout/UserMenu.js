// src/components/layout/UserMenu.js
'use client';

import { useState } from 'react';
import styles from './Header.module.css';
import { logout } from './actions'; // Action đăng xuất

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className={styles.userMenu} onMouseLeave={() => setIsOpen(false)}>
      <button className={styles.avatarButton} onMouseEnter={() => setIsOpen(true)}>
        <span>{user.username}</span>
        {/* Sẽ thay bằng avatar sau */}
        <div className={styles.avatarPlaceholder}>{user.username.charAt(0).toUpperCase()}</div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <a href="/my-songs" className={styles.dropdownItem}>Bài hát yêu thích</a>
          <a href="/settings" className={styles.dropdownItem}>Cài đặt tài khoản</a>
          <hr className={styles.dropdownDivider} />
          <button onClick={handleLogout} className={styles.dropdownItem}>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}