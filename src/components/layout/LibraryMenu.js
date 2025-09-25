// src/components/layout/LibraryMenu.js
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

export default function LibraryMenu() {
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
  const onBlur = (e) => {
    if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className={`${styles.menu} ${open ? styles.open : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onBlur={onBlur}
    >
      <button
        type="button"
        className={styles.menuTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Thư viện
        <svg
          className={styles.caret}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
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
          <li role="none">
            <Link href="/genres" role="menuitem" className={styles.dropdownItem}>
              Thể loại
            </Link>
          </li>
          <li role="none">
            <Link href="/melodies" role="menuitem" className={styles.dropdownItem}>
              Giai điệu
            </Link>
          </li>
          <li role="none">
            <Link href="/composers" role="menuitem" className={styles.dropdownItem}>
              Tác giả
            </Link>
          </li>
          <li role="none">
            <Link href="/songs" role="menuitem" className={styles.dropdownItem}>
              Bài hát
            </Link>
          </li>
          <li role="none">
            <Link href="/chords" role="menuitem" className={styles.dropdownItem}>
              Hợp âm
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
