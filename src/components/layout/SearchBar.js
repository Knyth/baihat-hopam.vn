// src/components/layout/SearchBar.js
"use client";

import { useRef, useState } from "react";
import styles from "./Header.module.css";

export default function SearchBar() {
  const inputRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const onMicClick = (e) => {
    e.preventDefault();
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { inputRef.current?.focus(); return; }

    try {
      const rec = new SR();
      rec.lang = "vi-VN";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      setRecording(true);
      rec.onresult = (event) => {
        const text = event?.results?.[0]?.[0]?.transcript || "";
        if (text && inputRef.current) {
          inputRef.current.value = text;
          inputRef.current.focus();
        }
      };
      rec.onerror = () => setRecording(false);
      rec.onend = () => setRecording(false);
      rec.start();
    } catch {
      setRecording(false);
      inputRef.current?.focus();
    }
  };

  return (
    <form action="/search" method="get" className={styles.searchWrap}>
      <button
        type="button"
        onClick={onMicClick}
        className={`${styles.iconBtn} ${recording ? styles.micActive : ""}`}
        aria-label="Tìm kiếm bằng giọng nói"
        title="Tìm kiếm bằng giọng nói"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/>
        </svg>
      </button>

      <input
        ref={inputRef}
        name="q"
        type="text"
        placeholder="Tìm kiếm bài hát, tác giả, nghệ sĩ..."
        aria-label="Tìm kiếm bài hát, tác giả, nghệ sĩ"
        className={styles.searchInput}
      />

      <button type="submit" className={styles.iconBtn} aria-label="Tìm kiếm" title="Tìm kiếm">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14ZM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14Z"/>
        </svg>
      </button>
    </form>
  );
}
