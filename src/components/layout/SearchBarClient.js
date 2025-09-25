// src/components/layout/SearchBarClient.js
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

/**
 * Search bar 3 phần: micro | ô nhập | kính lúp
 * - Enter/click → /songs?query=...
 * - Voice search nếu trình duyệt hỗ trợ (SpeechRecognition)
 */
export default function SearchBarClient() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);

  const doSearch = useCallback(() => {
    const term = q.trim();
    if (!term) return;
    router.push(`/songs?query=${encodeURIComponent(term)}`);
  }, [q, router]);

  // init SpeechRecognition (nếu có)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recog = new SR();
    recog.lang = "vi-VN";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => setListening(true);
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recog.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.trim();
      if (text) {
        setQ(text);
        // nhỏ delay để state kịp cập nhật UI rồi mới push
        setTimeout(() => {
          router.push(`/songs?query=${encodeURIComponent(text)}`);
        }, 10);
      }
    };

    recogRef.current = recog;
    return () => {
      try {
        recog.stop();
      } catch {}
      recogRef.current = null;
    };
  }, [router]);

  const handleMic = () => {
    const recog = recogRef.current;
    if (!recog) {
      // Không hỗ trợ – có thể hiển thị toast sau
      return;
    }
    try {
      if (listening) {
        recog.stop();
      } else {
        recog.start();
      }
    } catch {}
  };

  return (
    <div className={styles.searchWrap}>
      <button
        type="button"
        className={`${styles.iconBtn} ${listening ? styles.micActive : ""}`}
        aria-label="Tìm kiếm bằng giọng nói"
        onClick={handleMic}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3a3 3 0 0 0-3 3v5a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* <input
        className={styles.searchInput}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
        placeholder="Tìm kiếm bài hát, tác giả, nghệ sĩ..."
        aria-label="Tìm kiếm"
      /> */}

      <input
        className={styles.searchInput}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm kiếm bài hát, tác giả, nghệ sĩ..."
        aria-label="Tìm kiếm"
        /* ===== chặn editor & sự khác biệt giữa SSR/Client ===== */
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-ms-editor="false"
        /* Nếu vẫn còn cảnh báo do extension sửa DOM trước hydrate */
        suppressHydrationWarning
      />

      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Thực hiện tìm kiếm"
        onClick={doSearch}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
