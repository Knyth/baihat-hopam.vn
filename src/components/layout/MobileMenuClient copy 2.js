// src/components/layout/MobileMenuClient.js

'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // ✅ ADDED (active-state theo URL)
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
  const searchParams = useSearchParams(); // ✅ ADDED
  const closeBtnRef = useRef(null);
  const drawerRef = useRef(null);

  // ✅ giữ ref nút hamburger để bỏ qua click chính nó (khi lắng nghe outside click)
  const hamburgerRef = useRef(null);

  // ✅ prefers-reduced-motion (tắt animation/transition nếu người dùng yêu cầu)
  const [reduceMotion, setReduceMotion] = useState(false);

  // ✅ keyboard-only focus ring
  const [kbdMode, setKbdMode] = useState(false);

  // ✅ swipe-to-close state
  const dragState = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    dragging: false,
    // panelWidth sẽ đo khi bắt đầu kéo
    panelWidth: 0,
  });
  const [dragX, setDragX] = useState(0);

  const close = useCallback(() => {
    setDragX(0);
    setOpen(false);
  }, []);
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
        // simple focus trap within drawer
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

  // ✅ click ở BẤT KỲ đâu ngoài drawer -> đóng
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

  // ✅ track prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // ✅ detect input modality cho focus ring “chỉ khi dùng bàn phím”
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Tab') setKbdMode(true); };
    const onMouse = () => setKbdMode(false);
    const onTouch = () => setKbdMode(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onMouse, true);
    window.addEventListener('touchstart', onTouch, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onMouse, true);
      window.removeEventListener('touchstart', onTouch, true);
    };
  }, []);

  // ✅ swipe-to-close (vuốt từ trái sang phải để đóng)
  useEffect(() => {
    if (!open) return;
    const panel = drawerRef.current;
    if (!panel) return;

    const start = (clientX, clientY) => {
      dragState.current.startX = clientX;
      dragState.current.startY = clientY;
      dragState.current.lastX = clientX;
      dragState.current.dragging = false;
      dragState.current.panelWidth = panel.getBoundingClientRect().width || 320;
      setDragX(0);
    };

    const move = (clientX, clientY) => {
      const dx = clientX - dragState.current.startX;
      const dy = clientY - dragState.current.startY;

      // chỉ nhận drag ngang rõ rệt (tránh cản scroll dọc)
      if (!dragState.current.dragging) {
        if (Math.abs(dx) < 6) return; // chưa đủ
        if (Math.abs(dx) < Math.abs(dy) * 1.3) return; // thiên về dọc
        dragState.current.dragging = true;
      }

      // chỉ cho kéo sang phải (đóng)
      const px = Math.max(0, dx);
      dragState.current.lastX = clientX;
      setDragX(px);
    };

    const end = () => {
      if (!dragState.current.dragging) {
        setDragX(0);
        return;
      }
      const threshold = Math.min(100, dragState.current.panelWidth * 0.33);
      if (dragX > threshold) {
        close();
      } else {
        // snap back
        setDragX(0);
      }
    };

    const onPointerDown = (e) => {
      // chỉ bắt đầu khi nhấn trong panel (không lấy overlay)
      if (!panel.contains(e.target)) return;
      panel.setPointerCapture?.(e.pointerId);
      start(e.clientX, e.clientY);
    };
    const onPointerMove = (e) => move(e.clientX, e.clientY);
    const onPointerUp = () => end();

    panel.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      panel.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [open, dragX, close]);

  const initial =
    (user?.name?.trim()?.[0] || user?.email?.trim()?.[0] || 'U').toUpperCase();

  // ✅ Active-state helper: so khớp cả query string (để phân biệt new/trending)
  const currentURL = useMemo(() => {
    const q = searchParams?.toString();
    return q ? `${pathname}?${q}` : pathname || '/';
  }, [pathname, searchParams]);

  const isActive = useCallback((href) => {
    // so sánh tuyệt đối (đúng cả query)
    return currentURL === href;
  }, [currentURL]);

  // ✅ Inline styles dùng chung (để khỏi sửa CSS Module “hoàn hảo” của bạn)
  const panelStyle = reduceMotion
    ? { transition: 'none', transform: open ? `translateX(${dragX}px)` : undefined }
    : (dragX
        ? { transform: `translateX(${dragX}px)` } // đang kéo -> override transform mượt
        : undefined);

  const overlayStyle = reduceMotion ? { transition: 'none' } : undefined;

  const focusStyle = kbdMode
    ? { outline: '2px solid var(--brand, #005a9e)', outlineOffset: '2px' }
    : undefined;

  const activeItemStyle = {
    background: '#f6f7fb',
    borderColor: 'var(--border, #e5e7eb)',
    color: 'var(--brand, #005a9e)'
  };

  return (
    <>
      {/* Hamburger – chỉ hiện ở mobile bằng CSS */}
      <button
        ref={hamburgerRef}
        type="button"
        aria-label="Mở menu"
        className={styles.hamburger}
        onClick={openMenu}
      >
        <FiMenu className={styles.icon} />
      </button>

      {/* Overlay */}
      {open && <div className={styles.backdrop} onClick={close} style={overlayStyle} />}

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobileMenuTitle"
        ref={drawerRef}
        // ✅ chống “nhìn xuyên” ở vài mức zoom/scale, và phục vụ drag
        style={{ isolation: 'isolate', touchAction: 'pan-y', ...panelStyle }}
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
            style={focusStyle} // ✅ focus ring khi dùng bàn phím
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
          <MobileLink
            href="/"
            icon={<FiHome />}
            onClick={close}
            label="Trang chủ"
            active={isActive('/')}
            activeStyle={activeItemStyle}
            focusStyle={focusStyle}
          />
          <MobileLink
            href="/songs?sort=new"
            icon={<FiMusic />}
            onClick={close}
            label="Bài hát mới"
            active={isActive('/songs?sort=new')}
            activeStyle={activeItemStyle}
            focusStyle={focusStyle}
          />
          <MobileLink
            href="/songs?sort=trending"
            icon={<FiTrendingUp />}
            onClick={close}
            label="Thịnh hành"
            active={isActive('/songs?sort=trending')}
            activeStyle={activeItemStyle}
            focusStyle={focusStyle}
          />
          <MobileLink
            href="/blog"
            icon={<FiBookOpen />}
            onClick={close}
            label="Blog"
            active={isActive('/blog')}
            activeStyle={activeItemStyle}
            focusStyle={focusStyle}
          />
          {canUpload && (
            <MobileLink
              href="/upload"
              icon={<FiPlusCircle />}
              onClick={close}
              label="Tải bài hát"
              active={isActive('/upload')}
              activeStyle={activeItemStyle}
              focusStyle={focusStyle}
            />
          )}
        </nav>

        <div className={styles.sectionDivider} />

        <nav className={styles.nav} aria-label="Tài khoản">
          <MobileLink
            href="/my-songs"
            icon={<FiHeart />}
            onClick={close}
            label="Bài hát của tôi"
            active={isActive('/my-songs')}
            activeStyle={activeItemStyle}
            focusStyle={focusStyle}
          />
          <MobileLink
            href="/settings"
            icon={<FiSettings />}
            onClick={close}
            label="Cài đặt"
            active={isActive('/settings')}
            activeStyle={activeItemStyle}
            focusStyle={focusStyle}
          />

          {!user ? (
            <MobileLink
              href="/auth"
              icon={<FiLogIn />}
              onClick={close}
              label="Đăng nhập / Đăng ký"
              active={isActive('/auth')}
              activeStyle={activeItemStyle}
              focusStyle={focusStyle}
            />
          ) : (
            <button
              type="button"
              className={`${styles.item} ${styles.buttonLike}`}
              onClick={() => { close(); signOut(); }}
              // ✅ focus ring khi dùng bàn phím
              style={focusStyle}
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

// --- Sub component giữ nguyên API + thêm active/focus style ---
function MobileLink({ href, icon, label, onClick, active, activeStyle, focusStyle }) {
  return (
    <Link
      href={href}
      className={styles.item}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}     // ✅ a11y
      style={active ? { ...activeStyle, ...focusStyle } : focusStyle} // ✅ inline highlight + focus ring (kbd)
    >
      <span className={styles.left}>{icon}</span>
      <span className={styles.text}>{label}</span>
    </Link>
  );
}
