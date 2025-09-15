// src/components/ViewTracker.js
// NEW: Gửi 1 POST /api/songs/[slug]/view mỗi lần người dùng mở trang bài hát.
// Chống double count trong React StrictMode DEV + refresh/ngược trang
// bằng sessionStorage và cờ in-memory.

"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ slug }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!slug) return;

    // 1) Chống double-fire trong cùng phiên render
    if (firedRef.current) return;

    // 2) Chống đếm lại nhiều lần trong cùng tab (Back/Forward)
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) {
      return; // đã đếm trong tab này
    }

    firedRef.current = true;
    sessionStorage.setItem(key, "1");

    const url = `/api/songs/${encodeURIComponent(slug)}/view`;

    // Ưu tiên sendBeacon (không chặn UI, chạy cả khi rời trang)
    const payload = new Blob([], { type: "application/json" });
    let sent = false;
    try {
      if ("sendBeacon" in navigator) {
        sent = navigator.sendBeacon(url, payload);
      }
    } catch (_) {
      // ignore
    }

    if (!sent) {
      // Fallback: POST tiêu chuẩn
      fetch(url, { method: "POST" }).catch(() => {
        // Nếu lỗi, mở lại cờ cho phép thử lại trong phiên này (tùy chiến lược)
        // sessionStorage.removeItem(key);
      });
    }
  }, [slug]);

  return null; // invisible helper
}
