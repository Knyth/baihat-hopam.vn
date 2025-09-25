"use client";

import { useEffect, useRef, useState } from "react";
import FavoriteButton from "./FavoriteButton";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: "#28a745", width: 24, height: 24 }}>
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: "#dc3545", width: 24, height: 24 }}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

// 5 màu đề xuất
const PALETTE = ["#005A9E", "#B23B30", "#3F7F3F", "#B87300", "#5A38D6"];
const DEFAULT_COLOR = "#005A9E";

export default function ControlPanel({
  current_key,
  onFontSizeChange,
  onTranspose,
  songSlug,
  fontSize,
  songId,
  initialIsFavorited,
  isLoggedIn,
  asToolbar = false,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);

  // 👉 Không dùng storage nữa. Mỗi trang/bài luôn khởi tạo là brand.
  const [chordColor, setChordColor] = useState(DEFAULT_COLOR);

  // rAF refs (auto-scroll mượt)
  const rafIdRef = useRef(null);
  const lastTsRef = useRef(0);
  const accRef = useRef(0);

  // Mỗi lần mount hoặc songSlug đổi → reset về brand & apply vào :root
  useEffect(() => {
    setChordColor(DEFAULT_COLOR);
    try {
      document.documentElement.style.setProperty("--chord-color", DEFAULT_COLOR);
    } catch {}
  }, [songSlug]);

  // Khi người dùng đổi màu: apply ngay (không lưu)
  useEffect(() => {
    try {
      document.documentElement.style.setProperty("--chord-color", chordColor);
    } catch {}
  }, [chordColor]);

  // Auto-scroll bằng requestAnimationFrame
  useEffect(() => {
    if (!isScrolling) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTsRef.current = 0;
      accRef.current = 0;
      return;
    }
    const speed = Math.max(1, Math.min(10, Number(scrollSpeed) || 5));
    const pxPerSec = 30 + (speed - 1) * 30;

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      accRef.current += pxPerSec * dt;
      const dy = Math.floor(accRef.current);
      if (dy >= 1) {
        window.scrollBy(0, dy);
        accRef.current -= dy;
      }
      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTsRef.current = 0;
      accRef.current = 0;
    };
  }, [isScrolling, scrollSpeed]);

  const handleToggleScroll = () => setIsScrolling((v) => !v);
  const handleSpeedChange = (e) => setScrollSpeed(Number(e.target.value));

  // const handleDownloadPDF = async () => {
  //   if (isDownloading) return;
  //   setIsDownloading(true);
  //   try {
  //     const el = document.getElementById("song-content-to-print");
  //     if (!el) return;
  //     const html2pdf = (await import("html2pdf.js")).default;
  //     const opt = {
  //       margin:[0.5,0.5,0.5,0.5],
  //       filename:`${songSlug}.pdf`,
  //       image:{ type:"jpeg", quality:0.98 },
  //       html2canvas:{ scale:2, useCORS:true },
  //       jsPDF:{ unit:"in", format:"letter", orientation:"portrait" }
  //     };
  //     await html2pdf().from(el).set(opt).save();
  //   } catch {
  //     // giữ console sạch
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const handleDownloadPDF = async () => {
  if (isDownloading) return;
  setIsDownloading(true);
  try {
    const el = document.getElementById("song-content-to-print");
    if (!el) return;

    // Gắn class để áp CSS in ấn tạm thời (loại bỏ rủi ro bóng đổ/hiệu ứng)
    el.classList.add("pdf-exporting");

    const html2pdf = (await import("html2pdf.js")).default;

    // scale 2.5–3 cho chữ nét hơn; cap ở 3 để file không quá nặng
    const scale = Math.min(3, Math.max(2.5, (window.devicePixelRatio || 2.5)));

    const opt = {
      margin: 12, // mm
      filename: `${songSlug}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
      },
      // Tránh ngắt giữa các dòng lyric; ưu tiên CSS break rules
      pagebreak: { mode: ["css", "legacy"], avoid: [".lyricsLine", ".lyricsContainer"] },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().from(el).set(opt).save();
  } catch {
    // giữ console sạch
  } finally {
    const el = document.getElementById("song-content-to-print");
    if (el) el.classList.remove("pdf-exporting");
    setIsDownloading(false);
  }
};

// UPPPPPPP

  const ActionButtons = (
    <>
      {isLoggedIn && <FavoriteButton songId={songId} initialIsFavorited={initialIsFavorited} />}
      <button onClick={handleDownloadPDF} disabled={isDownloading} className="download-pdf-main" style={{ flexGrow: 1 }}>
        {isDownloading ? "Đang xử lý..." : "Tải về PDF"}
      </button>
    </>
  );

  const ColorChips = (
    <>
      {PALETTE.map((c) => (
        <button
          key={c}
          className={`chip-color${chordColor === c ? " active" : ""}`}
          aria-label={`Chord color ${c}`}
          title="Đổi màu hợp âm"
          style={{ background: c }}
          onClick={() => setChordColor(c)}
        />
      ))}
    </>
  );

  if (asToolbar) {
    return (
      <>
        <div className="toolbar-group">
          <button className="control-button" onClick={() => onTranspose(-1)}>-</button>
          <span className="current-key" style={{ minWidth: 40, textAlign: "center" }}>{current_key}</span>
          <button className="control-button" onClick={() => onTranspose(1)}>+</button>
        </div>

        <div className="toolbar-group">
          <button className="control-button" onClick={() => onFontSizeChange(-2)}>A-</button>
          <span className="current-key" style={{ minWidth: 44, textAlign: "center" }}>{fontSize}px</span>
          <button className="control-button" onClick={() => onFontSizeChange(2)}>A+</button>
        </div>

        <div className="toolbar-group">
          <button onClick={handleToggleScroll} className="icon-button">
            {isScrolling ? <PauseIcon /> : <PlayIcon />}
          </button>
          <input type="range" min="1" max="10" step="1" value={scrollSpeed} onChange={handleSpeedChange} className="speed-slider" />
        </div>

        <div className="toolbar-group">{ColorChips}</div>
      </>
    );
  }

  return (
    <div className="panel-card">
      <h3 className="panel-title">Bảng Điều Khiển</h3>
      <hr className="panel-divider" />

      <div className="control-group">
        <label className="control-label">Tông</label>
        <div className="transpose-controls">
          <button className="control-button" onClick={() => onTranspose(-1)}>-</button>
          <span className="current-key">{current_key}</span>
          <button className="control-button" onClick={() => onTranspose(1)}>+</button>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Cỡ chữ</label>
        <div className="fontsize-controls">
          <button className="control-button" onClick={() => onFontSizeChange(-2)}>A-</button>
          <span className="current-key">{fontSize}px</span>
          <button className="control-button" onClick={() => onFontSizeChange(2)}>A+</button>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Cuộn trang</label>
        <div className="autoscroll-controls">
          <button onClick={handleToggleScroll} className="icon-button">
            {isScrolling ? <PauseIcon /> : <PlayIcon />}
          </button>
          <input type="range" min="1" max="10" step="1" value={scrollSpeed} onChange={handleSpeedChange} className="speed-slider" />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Màu hợp âm</label>
        <div className="autoscroll-controls">{ColorChips}</div>
      </div>

      <div className="control-group">
        <label className="control-label">Lưu trữ</label>
        <div className="action-controls">{ActionButtons}</div>
      </div>
    </div>
  );
}
