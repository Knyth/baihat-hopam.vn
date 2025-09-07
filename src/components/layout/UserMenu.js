// src/components/layout/UserMenu.js
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import styles from "./Header.module.css";

export default function UserMenu({ name = "Bạn", email = "", image = "" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const hoverTimer = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const onEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpen(true);
  };
  const onLeave = () => {
    hoverTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const onFocus = () => setOpen(true);
  const onBlur = (e) => {
    if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  const initial = (name || email || "B").trim().charAt(0).toUpperCase();

  return (
    <div
      ref={wrapRef}
      className={`${styles.userMenu} ${open ? styles.open : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <button
        type="button"
        className={styles.userTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title={`${name}${email ? ` • ${email}` : ""}`}
      >
        <span className={styles.userName}>{name}</span>
        <span className={styles.avatar} aria-hidden="true">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" />
          ) : (
            initial
          )}
        </span>
      </button>

      <div className={styles.dropdown} role="menu">
        <ul className={styles.dropdownList}>
          <li role="none">
            <Link href="/my-songs" role="menuitem" className={styles.dropdownItem}>
              Bài hát yêu thích
            </Link>
          </li>
          <li role="none">
            <Link href="/settings" role="menuitem" className={styles.dropdownItem}>
              Cài đặt tài khoản
            </Link>
          </li>

          {/* Vạch ngăn cách chạm sát 2 viền */}
          <li className={styles.dropdownSep} role="separator" aria-hidden="true" />

          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={styles.dropdownItemDanger}
              onClick={() => signOut()}
            >
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
