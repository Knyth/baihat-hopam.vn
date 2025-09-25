// src/components/ChordColorMount.js
"use client";

// Mục tiêu: đảm bảo khi client mount, chord color = brand/primary.
// Không dùng storage để tránh "nhớ màu" giữa các bài/tab.

import { useEffect } from "react";

const DEFAULT = "#005A9E";

export default function ChordColorMount() {
  useEffect(() => {
    try {
      document.documentElement.style.setProperty("--chord-color", DEFAULT);
    } catch {
      // giữ console sạch trong môi trường chặn DOM
    }
  }, []);

  return null; // no UI
}
