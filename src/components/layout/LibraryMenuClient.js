// src/components/layout/LibraryMenuClient.js
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

/**
 * Dropdown "Thư viện" – mở bằng hover/focus/click
 * Có "hover bridge" nên rê từ nút xuống menu không bị tắt.
 */
export default function LibraryMenuClient() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeMenu = () => setOpen(false);

  // đóng nếu click ra ngoài
  useEffect(() => {
    if (!open) return;
    const onOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onOutside, true);
    return () => document.removeEventListener("pointerdown", onOutside, true);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.menu} ${open ? styles.open : ""}`}
      onPointerEnter={openMenu}
      onPointerLeave={() => {
        closeTimer.current = window.setTimeout(closeMenu, 100);
      }}
    >
      <button
        type="button"
        className={styles.menuTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={openMenu}
        onBlur={() => (closeTimer.current = window.setTimeout(closeMenu, 120))}
      >
        Thư viện
        <svg className={styles.caret} width="16" height="16" viewBox="0 0 20 20">
          <path
            d="M5 7l5 6 5-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.menuDropdown} role="menu">
        <ul className={styles.dropdownList}>
          <li>
            <Link href="/genres" className={styles.dropdownItem}>
              Thể loại
            </Link>
          </li>
          <li>
            <Link href="/melodies" className={styles.dropdownItem}>
              Giai điệu
            </Link>
          </li>
          <li>
            <Link href="/composers" className={styles.dropdownItem}>
              Tác giả
            </Link>
          </li>
          <li>
            <Link href="/songs" className={styles.dropdownItem}>
              Bài hát
            </Link>
          </li>
          <li>
            <Link href="/chords" className={styles.dropdownItem}>
              Hợp âm
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
