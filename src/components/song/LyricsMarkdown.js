// src/components/song/LyricsMarkdown.js
"use client";
import React from "react";

/**
 * Render chuỗi lyric có hợp âm kiểu [Am] thành HTML:
 *  - Escape HTML để an toàn
 *  - Chỉ chèn <span class="chord">...</span> cho phần hợp âm
 *  - \n -> <br/>
 */
function renderChorded(text = "") {
  const esc = (s) =>
    s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const withChords = esc(text).replace(/\[([^\]\n]+)\]/g, (_, c) => {
    return `<span class="chord">${c}</span>`;
  });
  return withChords.replace(/\n/g, "<br/>");
}

export default function LyricsMarkdown({ text, fontSize = 16 }) {
  return (
    <div
      id="song-content-to-print"
      className="lyrics"
      style={{ fontSize }}
      dangerouslySetInnerHTML={{ __html: renderChorded(text) }}
    />
  );
}
