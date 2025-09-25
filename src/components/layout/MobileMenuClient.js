// src/components/layout/MobileMenuClient.js

"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiMusic,
  FiTrendingUp,
  FiBookOpen,
  FiPlusCircle,
  FiSettings,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";
import styles from "./MobileMenu.module.css";

export default function MobileMenuClient({ user, canUpload }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const closeBtnRef = useRef(null);
  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null); // để bỏ qua click trên chính nút mở

  // ====== Swipe state (CHỈ cho touch) ======
  const dragRef = useRef({
    active: false, // đã có pointerdown hợp lệ chưa
    dragging: false, // đã vượt qua ngưỡng để coi là kéo chưa
    pointerId: null, // id của con trỏ đang theo dõi
    startX: 0,
    startY: 0,
    panelW: 0,
  });
  const [dragX, setDragX] = useState(0);

  // ====== Active item & a11y (không thay đổi cấu trúc) ======
  const initial = useMemo(() => {
    const src = (user?.name || user?.email || "").trim();
    return src ? src[0].toUpperCase() : "U";
  }, [user]);

  const close = useCallback(() => {
    setDragX(0);
    setOpen(false);
  }, []);
  const openMenu = useCallback(() => setOpen(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]); // đổi route -> đóng

  // Khóa scroll + focus trap khi mở
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = drawerRef.current?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
        if (!f || f.length === 0) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Click BẤT KỲ chỗ nào ngoài panel -> đóng (kể cả không trúng overlay)
  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e) => {
      const t = e.target;
      const inDrawer = drawerRef.current?.contains(t);
      const onHamburger = hamburgerRef.current?.contains(t);
      if (!inDrawer && !onHamburger) close();
    };
    document.addEventListener("pointerdown", onDocPointerDown, true);
    return () => document.removeEventListener("pointerdown", onDocPointerDown, true);
  }, [open, close]);

  // ====== SWIPE-TO-CLOSE (Fix: chỉ cho touch, không cho mouse) ======
  useEffect(() => {
    if (!open) return;
    const panel = drawerRef.current;
    if (!panel) return;

    const start = (e) => {
      // CHỈ nhận bắt đầu vuốt khi là touch (không phải chuột/stylus)
      if (e.pointerType !== "touch") return;

      dragRef.current.active = true;
      dragRef.current.dragging = false;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      dragRef.current.panelW = panel.getBoundingClientRect().width || 320;
      setDragX(0);

      // bắt sự kiện pointer này cho panel
      panel.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
      const d = dragRef.current;
      // ❗ BẮT BUỘC: nếu chưa có start hợp lệ -> bỏ qua (fix “panel chạy theo chuột”)
      if (!d.active || e.pointerId !== d.pointerId) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      // chỉ nhận kéo ngang rõ rệt
      if (!d.dragging) {
        if (Math.abs(dx) < 8) return; // ngưỡng tối thiểu
        if (Math.abs(dx) < Math.abs(dy) * 1.5) return; // ưu tiên dọc -> không coi là kéo
        d.dragging = true;
      }

      // chỉ cho kéo sang phải (để đóng)
      const px = Math.max(0, dx);
      setDragX(px);
    };

    const end = (e) => {
      const d = dragRef.current;
      if (!d.active || e.pointerId !== d.pointerId) return;

      const threshold = Math.min(120, d.panelW * 0.33); // ngưỡng đóng: 33% (tối đa 120px)
      if (d.dragging && dragX > threshold) close();
      else setDragX(0);

      d.active = false;
      d.dragging = false;
      d.pointerId = null;

      panel.releasePointerCapture?.(e.pointerId);
    };

    const cancel = (e) => {
      const d = dragRef.current;
      if (d.pointerId !== e.pointerId) return;
      setDragX(0);
      d.active = false;
      d.dragging = false;
      d.pointerId = null;
      panel.releasePointerCapture?.(e.pointerId);
    };

    // LƯU Ý: chỉ gắn handler lên panel; không bắt pointermove toàn window nữa
    panel.addEventListener("pointerdown", start);
    panel.addEventListener("pointermove", move);
    panel.addEventListener("pointerup", end);
    panel.addEventListener("pointercancel", cancel);
    return () => {
      panel.removeEventListener("pointerdown", start);
      panel.removeEventListener("pointermove", move);
      panel.removeEventListener("pointerup", end);
      panel.removeEventListener("pointercancel", cancel);
    };
  }, [open, dragX, close]);

  // Active-state (chỉ dùng để highlight nhẹ; KHÔNG đổi markup)
  const currentURL = useMemo(() => {
    const q = searchParams?.toString();
    return q ? `${pathname}?${q}` : pathname || "/";
  }, [pathname, searchParams]);

  const isActive = useCallback((href) => currentURL === href, [currentURL]);

  // Inline transform khi đang kéo (chỉ tác động lúc touch-drag)
  const panelTransformStyle = dragX ? { transform: `translateX(${dragX}px)` } : undefined;

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
      {open && <div className={styles.backdrop} onClick={close} />}

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobileMenuTitle"
        ref={drawerRef}
        // Chỉ apply transform khi đang swipe bằng touch
        style={{ isolation: "isolate", touchAction: "pan-y", ...panelTransformStyle }}
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
            <div className={styles.userName}>{user?.name || "Khách"}</div>
            <div className={styles.userEmail}>{user?.email || "Chưa đăng nhập"}</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Điều hướng chính">
          <MobileLink
            href="/"
            icon={<FiHome />}
            onClick={close}
            label="Trang chủ"
            active={isActive("/")}
          />
          <MobileLink
            href="/songs?sort=new"
            icon={<FiMusic />}
            onClick={close}
            label="Bài hát mới"
            active={isActive("/songs?sort=new")}
          />
          <MobileLink
            href="/songs?sort=trending"
            icon={<FiTrendingUp />}
            onClick={close}
            label="Thịnh hành"
            active={isActive("/songs?sort=trending")}
          />
          <MobileLink
            href="/blog"
            icon={<FiBookOpen />}
            onClick={close}
            label="Blog"
            active={isActive("/blog")}
          />
          {canUpload && (
            <MobileLink
              href="/upload"
              icon={<FiPlusCircle />}
              onClick={close}
              label="Tải bài hát"
              active={isActive("/upload")}
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
            active={isActive("/my-songs")}
          />
          <MobileLink
            href="/settings"
            icon={<FiSettings />}
            onClick={close}
            label="Cài đặt"
            active={isActive("/settings")}
          />

          {!user ? (
            <MobileLink
              href="/auth"
              icon={<FiLogIn />}
              onClick={close}
              label="Đăng nhập / Đăng ký"
              active={isActive("/auth")}
            />
          ) : (
            <button
              type="button"
              className={`${styles.item} ${styles.buttonLike}`}
              onClick={() => {
                close();
                signOut();
              }}
            >
              <span className={styles.left}>
                <FiLogOut />
              </span>
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

function MobileLink({ href, icon, label, onClick, active }) {
  // highlight rất nhẹ khi active (không đụng CSS module)
  const activeStyle = active
    ? {
        background: "#f6f7fb",
        borderColor: "var(--border, #e5e7eb)",
        color: "var(--brand, #005a9e)",
      }
    : undefined;

  return (
    <Link
      href={href}
      className={styles.item}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={activeStyle}
    >
      <span className={styles.left}>{icon}</span>
      <span className={styles.text}>{label}</span>
    </Link>
  );
}
