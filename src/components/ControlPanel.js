// src/components/ControlPanel.js

"use client";

import { useEffect, useRef, useState } from "react";
import FavoriteButton from "./FavoriteButton";

/* ================= Icons ================= */
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
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M5 20h14v-2H5v2zm7-18-5 5h3v6h4V7h3l-5-5z" />
  </svg>
);

/* ================= Constants ================= */
const PALETTE = ["#005A9E", "#B23B30", "#3F7F3F", "#B87300", "#5A38D6"];
const DEFAULT_COLOR = "#005A9E";

/* ================= Scroll utils ================= */
function isScrollableByStyle(el) {
  if (!el) return false;
  const oy = getComputedStyle(el).overflowY;
  return oy === "auto" || oy === "scroll" || oy === "overlay";
}
function canScroll(el) {
  if (!el) return false;
  return (el.scrollHeight || 0) > (el.clientHeight || 0);
}
function findScrollableAncestor(fromEl) {
  let el = fromEl;
  while (el && el !== document.body && el !== document.documentElement) {
    if (canScroll(el)) return el;
    el = el.parentElement;
  }
  return null;
}
function deepScanBestScrollable() {
  const all = document.querySelectorAll("*");
  let best = null,
    bestDelta = 0;
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    if (!el.getBoundingClientRect) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const delta = (el.scrollHeight || 0) - (el.clientHeight || 0);
    if (delta > bestDelta) {
      bestDelta = delta;
      best = el;
    }
  }
  return best && bestDelta > 0 ? best : null;
}
function getBestScrollEl() {
  const content = document.getElementById("song-content-to-print");
  if (content && (canScroll(content) || isScrollableByStyle(content))) return content;
  if (content) {
    const anc0 = findScrollableAncestor(content);
    if (anc0 && canScroll(anc0)) return anc0;
  }
  const candidates = [
    "#song-content-to-print",
    "[data-scroll]",
    ".lyrics-container",
    ".page-scroll",
    "main",
    "#__next",
    ".app-root",
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el && (canScroll(el) || isScrollableByStyle(el))) return el;
    const anc = el && findScrollableAncestor(el);
    if (anc && canScroll(anc)) return anc;
  }
  const active = document.activeElement;
  if (active && active !== document.body) {
    const anc2 = findScrollableAncestor(active);
    if (anc2 && canScroll(anc2)) return anc2;
  }
  const deepBest = deepScanBestScrollable();
  if (deepBest) return deepBest;
  return document.scrollingElement || document.documentElement || document.body;
}
function getMaxY(el) {
  return (el.scrollHeight || 0) - (el.clientHeight || 0);
}
function getY(el) {
  if (!el) return 0;
  if (el === document.scrollingElement || el === document.documentElement || el === document.body) {
    const se = document.scrollingElement;
    return se ? se.scrollTop : document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return el.scrollTop;
}
function setYStrong(el, y, dyForWindow) {
  if (!el) return;
  const before = getY(el);
  if (el === document.scrollingElement || el === document.documentElement || el === document.body) {
    if (document.scrollingElement) document.scrollingElement.scrollTop = y;
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
  } else {
    el.scrollTop = y;
  }
  let after = getY(el);
  if (Math.abs(after - before) >= 0.5) return;
  window.scrollTo(0, y);
  after = getY(el);
  if (Math.abs(after - before) >= 0.5) return;
  if (typeof dyForWindow === "number" && Math.abs(dyForWindow) > 0.2) {
    window.scrollBy(0, dyForWindow);
  }
}
const mapSpeed = (s) => 3 + (Math.max(1, Math.min(10, s)) - 1) * 1.5;

/* ================= Global AutoScroll singleton ================= */
function initAutoScrollBus() {
  if (typeof window === "undefined") return null;
  const w = window;
  if (w.__BH_AS) return w.__BH_AS;

  const bus = {
    isScrolling: false,
    speed: 5,
    reduceFactor: 1,
    el: null,
    rafId: null,
    prev: 0,
    pos: 0,
    vCur: 0,
    vTgt: 0,
    listeners: new Set(),

    _emit() {
      const evt = new CustomEvent("bh:auto", {
        detail: { isScrolling: this.isScrolling, speed: this.speed },
      });
      w.dispatchEvent(evt);
    },

    setSpeed(s) {
      this.speed = Math.max(1, Math.min(10, Number(s) || 5));
      this.vTgt = mapSpeed(this.speed) * this.reduceFactor;
      this._emit();
    },

    _pickEl() {
      this.el = getBestScrollEl();
      this.pos = getY(this.el);
    },

    start() {
      // dừng vòng cũ (nếu có) trước khi start để không bị 2 vòng chạy trùng
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      const mql = w.matchMedia?.("(prefers-reduced-motion: reduce)");
      this.reduceFactor = mql && mql.matches ? 0.6 : 1;

      this._pickEl();
      this.vTgt = mapSpeed(this.speed) * this.reduceFactor;

      this.isScrolling = true;
      this.prev = 0;
      this._emit();

      const SMOOTHING = 0.12;
      const bottomGuard = 4;

      const tick = (ts) => {
        if (!this.isScrolling) {
          this.rafId = null;
          return;
        }

        const prev = this.prev || ts;
        const dt = Math.max(0, Math.min(0.05, (ts - prev) / 1000));
        this.prev = ts;

        const vNew = this.vCur + (this.vTgt - this.vCur) * SMOOTHING;
        this.vCur = vNew;

        let pos = this.pos + vNew * dt;
        const maxY = getMaxY(this.el);

        if (maxY - pos <= bottomGuard) {
          this.vTgt = 0;
          if (Math.abs(vNew) < 0.25) {
            setYStrong(this.el, maxY, vNew * dt);
            this.stop(); // sẽ emit trong stop()
            return;
          }
          pos = Math.min(pos, maxY);
        }

        this.pos = pos;
        setYStrong(this.el, pos, vNew * dt);
        this.rafId = requestAnimationFrame(tick);
      };

      this.rafId = requestAnimationFrame(tick);
    },

    stop() {
      this.isScrolling = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.prev = 0;
      this.vCur = 0;
      this._emit();
    },
  };

  w.__BH_AS = bus;
  return bus;
}

/* ================= Component ================= */
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
  // local view state, sync với bus
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const [chordColor, setChordColor] = useState(DEFAULT_COLOR);

  const lastToggleTsRef = useRef(0);

  // brand color reset per song
  useEffect(() => {
    setChordColor(DEFAULT_COLOR);
    try {
      document.documentElement.style.setProperty("--chord-color", DEFAULT_COLOR);
    } catch {}
  }, [songSlug]);
  useEffect(() => {
    try {
      document.documentElement.style.setProperty("--chord-color", chordColor);
    } catch {}
  }, [chordColor]);

  // mount: sync với singleton
  useEffect(() => {
    const bus = initAutoScrollBus();
    if (!bus) return;
    // đồng bộ state ban đầu
    setIsScrolling(bus.isScrolling);
    setScrollSpeed(bus.speed);

    const onState = (e) => {
      const { isScrolling: s, speed } = e.detail || {};
      setIsScrolling(!!s);
      if (typeof speed === "number") setScrollSpeed(speed);
    };
    window.addEventListener("bh:auto", onState);
    return () => window.removeEventListener("bh:auto", onState);
  }, []);

  /* ================= Hover-pause (OPT-IN qua ?hoverPause=1) ================= */
  useEffect(() => {
    const pointerFine = window.matchMedia?.("(pointer: fine)")?.matches;
    const enableHover =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("hoverPause") === "1";
    if (!pointerFine || !enableHover) return;

    const bus = initAutoScrollBus();
    if (!bus) return;

    const el = getBestScrollEl();

    const onEnter = () => {
      if (bus.isScrolling) bus.stop();
    };
    const onLeave = () => {
      if (!bus.isScrolling) bus.start();
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [songSlug]);

  /* ================= Handlers ================= */
  const acceptToggleOnce = () => {
    const now = performance.now();
    if (now - lastToggleTsRef.current < 150) return false; // chặn trùng touch/click
    lastToggleTsRef.current = now;
    return true;
  };

  const handleToggle = () => {
    const bus = initAutoScrollBus();
    if (!bus) return;
    if (bus.isScrolling) bus.stop();
    else bus.start();
    // local state sẽ sync qua event
  };

  const onPlayPointerUp = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch {}
    if (acceptToggleOnce()) handleToggle();
  };
  const onPlayTouchEnd = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch {}
    if (acceptToggleOnce()) handleToggle();
  };
  const onPlayClick = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch {}
    if (acceptToggleOnce()) handleToggle();
  };
  const onPlayMouseDown = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch {}
  };

  const handleSpeedChange = (e) => {
    const v = Number(e.target.value);
    setScrollSpeed(v);
    const bus = initAutoScrollBus();
    if (bus) bus.setSpeed(v);
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const el = document.getElementById("song-content-to-print");
      if (!el) return;
      el.classList.add("pdf-exporting");

      const html2pdf = (await import("html2pdf.js")).default;
      const scale = Math.min(3, Math.max(2.5, window.devicePixelRatio || 2.5));
      const opt = {
        margin: 12,
        filename: `${songSlug}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale, useCORS: true, letterRendering: true, backgroundColor: "#ffffff" },
        pagebreak: { mode: ["css", "legacy"], avoid: [".lyricsLine", ".lyricsContainer"] },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().from(el).set(opt).save();
    } catch {
      /* silent */
    } finally {
      const el2 = document.getElementById("song-content-to-print");
      if (el2) el2.classList.remove("pdf-exporting");
      setIsDownloading(false);
    }
  };

  const ActionButtons = (
    <>
      {isLoggedIn && <FavoriteButton songId={songId} initialIsFavorited={initialIsFavorited} />}
      <button
        type="button"
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="download-pdf-main"
        style={{ flexGrow: 1 }}
      >
        {isDownloading ? "Đang xử lý..." : "Tải về PDF"}
      </button>
    </>
  );

  const ColorChips = (
    <>
      {PALETTE.map((c) => (
        <button
          type="button"
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

  /* ================= Toolbar (footer) ================= */
  if (asToolbar) {
    const showDebug =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debugScroll") === "1";
    return (
      <>
        {/* 1. Transpose */}
        <div className="toolbar-group group-transpose">
          <button
            type="button"
            className="control-button"
            onClick={() => onTranspose(-1)}
            aria-label="Giảm tông"
          >
            -
          </button>
          <span className="metric metric-key">{current_key}</span>
          <button
            type="button"
            className="control-button"
            onClick={() => onTranspose(1)}
            aria-label="Tăng tông"
          >
            +
          </button>
        </div>

        {/* 2. Font size */}
        <div className="toolbar-group group-font">
          <button
            type="button"
            className="control-button"
            onClick={() => onFontSizeChange(-2)}
            aria-label="Giảm cỡ chữ"
          >
            A-
          </button>
          <span className="metric metric-font">{fontSize}</span>
          <button
            type="button"
            className="control-button"
            onClick={() => onFontSizeChange(2)}
            aria-label="Tăng cỡ chữ"
          >
            A+
          </button>
        </div>

        {/* 3. Auto scroll */}
        <div className="toolbar-group group-scroll">
          <button
            type="button"
            className="icon-button"
            aria-label={isScrolling ? "Tạm dừng cuộn" : "Bắt đầu cuộn"}
            aria-pressed={isScrolling}
            style={{ touchAction: "manipulation" }}
            onPointerUp={onPlayPointerUp}
            onTouchEnd={onPlayTouchEnd}
            onMouseDown={onPlayMouseDown}
            onClick={onPlayClick}
          >
            {isScrolling ? <PauseIcon /> : <PlayIcon />}
          </button>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={scrollSpeed}
            onChange={handleSpeedChange}
            className="speed-slider"
            aria-label="Tốc độ cuộn"
          />
          {showDebug && (
            <button
              type="button"
              className="control-button"
              onClick={() => {
                const el = getBestScrollEl();
                // eslint-disable-next-line no-console
                console.log(
                  "[DBG] Picked:",
                  el?.tagName,
                  el?.id ? `#${el.id}` : "",
                  el?.className ? `.${String(el.className).replace(/\s+/g, ".")}` : "",
                );
                if (el) {
                  console.log(
                    "[DBG] scrollTop/scrollHeight/clientHeight:",
                    getY(el),
                    el.scrollHeight,
                    el.clientHeight,
                  );
                  const before = getY(el);
                  setYStrong(el, before + 48, 48);
                  const after = getY(el);
                  console.log("[DBG] nudged +48px:", { before, after });
                }
              }}
              title="Debug scroll container"
            >
              DBG
            </button>
          )}
        </div>

        {/* 4. Color chips */}
        <div className="toolbar-group group-colors">{ColorChips}</div>

        {/* 5. Lưu trữ */}
        <div className="toolbar-group group-save">
          {isLoggedIn && (
            <div className="favorite-compact">
              <FavoriteButton songId={songId} initialIsFavorited={initialIsFavorited} />
            </div>
          )}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="icon-button download-pdf-compact"
            aria-label="Tải về PDF"
            title="Tải về PDF"
          >
            <DownloadIcon />
          </button>
        </div>
      </>
    );
  }

  /* ================= Panel (sidebar desktop) ================= */
  return (
    <div className="panel-card">
      <h3 className="panel-title">Bảng Điều Khiển</h3>
      <hr className="panel-divider" />

      <div className="control-group">
        <label className="control-label">Tông</label>
        <div className="transpose-controls">
          <button type="button" className="control-button" onClick={() => onTranspose(-1)}>
            -
          </button>
          <span className="current-key">{current_key}</span>
          <button type="button" className="control-button" onClick={() => onTranspose(1)}>
            +
          </button>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Cỡ chữ</label>
        <div className="fontsize-controls">
          <button type="button" className="control-button" onClick={() => onFontSizeChange(-2)}>
            A-
          </button>
          <span className="current-key">{fontSize}px</span>
          <button type="button" className="control-button" onClick={() => onFontSizeChange(2)}>
            A+
          </button>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Cuộn trang</label>
        <div className="autoscroll-controls">
          <button
            type="button"
            className="icon-button"
            aria-pressed={isScrolling}
            style={{ touchAction: "manipulation" }}
            onPointerUp={onPlayPointerUp}
            onTouchEnd={onPlayTouchEnd}
            onMouseDown={onPlayMouseDown}
            onClick={onPlayClick}
          >
            {isScrolling ? <PauseIcon /> : <PlayIcon />}
          </button>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={scrollSpeed}
            onChange={handleSpeedChange}
            className="speed-slider"
          />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Màu hợp âm</label>
        <div className="autoscroll-controls">
          {PALETTE.map((c) => (
            <button
              type="button"
              key={c}
              className={`chip-color${chordColor === c ? " active" : ""}`}
              aria-label={`Chord color ${c}`}
              title="Đổi màu hợp âm"
              style={{ background: c }}
              onClick={() => setChordColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Lưu trữ</label>
        <div className="action-controls">
          {isLoggedIn && <FavoriteButton songId={songId} initialIsFavorited={initialIsFavorited} />}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="download-pdf-main"
            style={{ flexGrow: 1 }}
          >
            {isDownloading ? "Đang xử lý..." : "Tải về PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
