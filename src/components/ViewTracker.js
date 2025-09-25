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
    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) {
        return; // đã đếm trong tab này
      }
    } catch {
      // Nếu storage bị chặn (private mode), vẫn tiếp tục gửi 1 lần
    }

    firedRef.current = true;

    try {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(key, "1");
      }
    } catch {
      // ignore storage error
    }

    const url = `/api/songs/${encodeURIComponent(slug)}/view`;

    // Ưu tiên sendBeacon (không chặn UI, chạy cả khi rời trang)
    let sent = false;
    try {
      if ("sendBeacon" in navigator) {
        // body có thể để trống nếu API không yêu cầu
        const payload = new Blob([], { type: "application/json" });
        sent = navigator.sendBeacon(url, payload);
      }
    } catch {
      // ignore
    }

    if (!sent) {
      // Fallback: POST tiêu chuẩn
      fetch(url, { method: "POST" }).catch(() => {
        // Nếu lỗi, bỏ qua để không làm bẩn console
      });
    }
  }, [slug]);

  return null; // invisible helper
}
