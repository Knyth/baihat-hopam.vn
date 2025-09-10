// src/components/layout/MobileMenuClient.js

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  FiMenu, FiX, FiHome, FiMusic, FiTrendingUp, FiBookOpen,
  FiPlusCircle, FiSettings, FiUser, FiLogIn, FiLogOut, FiHeart
} from 'react-icons/fi';
import styles from './MobileMenu.module.css';

export default function MobileMenuClient({ user, canUpload }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeBtnRef = useRef(null);
  const drawerRef = useRef(null);

  // ✅ ADDED: giữ ref của nút hamburger để không đóng khi click chính nút này
  const hamburgerRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Body scroll lock + focus management when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = drawerRef.current?.querySelectorAll(
          'a,button,[tabindex]:not([tabindex="-1"])'
        );
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  // ✅ ADDED: click ở bất kỳ nơi nào ngoài drawer sẽ đóng menu
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e) => {
      const t = e.target;
      const inDrawer = drawerRef.current?.contains(t);
      const onHamburger = hamburgerRef.current?.contains(t);
      if (!inDrawer && !onHamburger) close();
    };

    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, [open, close]);

  const initial =
    (user?.name?.trim()?.[0] || user?.email?.trim()?.[0] || 'U').toUpperCase();

  return (
    <>
      {/* Hamburger – chỉ hiện ở mobile bằng CSS */}
      <button
        ref={/* ✅ ADDED */ hamburgerRef}
        type="button"
        aria-label="Mở menu"
        className={styles.hamburger}
        onClick={openMenu}
      >
        <FiMenu className={styles.icon} />
      </button>

      {/* Overlay */}
      {open && <div className={styles.backdrop} onClick={close} />}

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobileMenuTitle"
        ref={drawerRef}
      >
        {/* Drawer header */}
        <div className={styles.topbar}>
          <h2 id="mobileMenuTitle" className={styles.title}>
            Thư viện
          </h2>
          <button
            type="button"
            ref={closeBtnRef}
            className={styles.close}
            onClick={close}
            aria-label="Đóng menu"
          >
            <FiX />
          </button>
        </div>

        {/* User summary */}
        <div className={styles.userBox}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>
              {user?.name || 'Khách'}
            </div>
            <div className={styles.userEmail}>
              {user?.email || 'Chưa đăng nhập'}
            </div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Điều hướng chính">
          <MobileLink href="/" icon={<FiHome />} onClick={close} label="Trang chủ" />
          <MobileLink href="/songs?sort=new" icon={<FiMusic />} onClick={close} label="Bài hát mới" />
          <MobileLink href="/songs?sort=trending" icon={<FiTrendingUp />} onClick={close} label="Thịnh hành" />
          <MobileLink href="/blog" icon={<FiBookOpen />} onClick={close} label="Blog" />
          {canUpload && (
            <MobileLink href="/upload" icon={<FiPlusCircle />} onClick={close} label="Tải bài hát" />
          )}
        </nav>

        <div className={styles.sectionDivider} />

        <nav className={styles.nav} aria-label="Tài khoản">
          <MobileLink href="/my-songs" icon={<FiHeart />} onClick={close} label="Bài hát của tôi" />
          <MobileLink href="/settings" icon={<FiSettings />} onClick={close} label="Cài đặt" />
          {!user ? (
            <MobileLink href="/auth" icon={<FiLogIn />} onClick={close} label="Đăng nhập / Đăng ký" />
          ) : (
            <button
              type="button"
              className={`${styles.item} ${styles.buttonLike}`}
              onClick={() => { close(); signOut(); }}
            >
              <span className={styles.left}>{<FiLogOut />}</span>
              <span className={styles.text}>Đăng xuất</span>
            </button>
          )}
        </nav>

        <footer className={styles.footer}>
          <span className={styles.muted}>© baihat-hopam.vn</span>
        </footer>
      </aside>
    </>
  );
}

function MobileLink({ href, icon, label, onClick }) {
  return (
    <Link href={href} className={styles.item} onClick={onClick}>
      <span className={styles.left}>{icon}</span>
      <span className={styles.text}>{label}</span>
    </Link>
  );
}
