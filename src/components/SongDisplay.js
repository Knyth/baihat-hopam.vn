// src/components/SongDisplay.js

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./SongDisplay.module.css";
import ControlPanel from "./ControlPanel";
import RelatedSongs from "./RelatedSongs";
import * as TT from "@/utils/transposeText";
import { safeStorage } from "@/utils/safeStorage";

export default function SongDisplay({ songData, initialIsFavorited, isLoggedIn }) {
  // Keys for per-song persistence
  const songSlug = songData?.slug || "";
  const K = {
    font: songSlug ? `bhha.font.${songSlug}` : null,
    tr:   songSlug ? `bhha.tr.${songSlug}`   : null,
  };

  // State
  const [transposeAmount, setTransposeAmount] = useState(0);
  const [fontSize, setFontSize] = useState(16);

  // Load saved values (once per song)
  useEffect(() => {
    if (!songSlug) return;
    const savedFont = Number(safeStorage.get(K.font)) || 16;
    const savedTr = Number(safeStorage.get(K.tr)) || 0;
    setFontSize(Math.max(12, Math.min(32, savedFont)));
    setTransposeAmount(((savedTr % 12) + 12) % 12); // normalize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songSlug]);

  // Persist on change
  useEffect(() => {
    if (!songSlug) return;
    safeStorage.set(K.font, String(fontSize));
  }, [fontSize, songSlug, K.font]);

  useEffect(() => {
    if (!songSlug) return;
    safeStorage.set(K.tr, String(transposeAmount));
  }, [transposeAmount, songSlug, K.tr]);

  // Handlers
  const handleTranspose = (delta) => {
    setTransposeAmount((prev) => {
      let next = prev + delta;
      if (next > 11) next -= 12;
      if (next < -11) next += 12;
      return next;
    });
  };
  const handleFontSizeChange = (delta) =>
    setFontSize((prev) => Math.max(12, Math.min(32, prev + delta)));

  // Derived
  const displayKey = useMemo(
    () => TT.transposeKey(songData?.originalKey || "C", transposeAmount),
    [songData?.originalKey, transposeAmount]
  );

  const normalizedText = useMemo(
    () => TT.normalizeNewlines(songData?.lyricsChords || ""),
    [songData?.lyricsChords]
  );

  const displayedText = useMemo(
    () => TT.transposeChordedText(normalizedText, transposeAmount),
    [normalizedText, transposeAmount]
  );

  const chordTokenRegex = /(\[[^\]]+\])/g;
  const parsedLyrics = useMemo(() => {
    if (!displayedText) return null;
    return displayedText.split("\n").map((line, i) => {
      if (line.trim() === "") {
        return <div key={`br-${i}`} className={styles.lineBreak} />;
      }
      const parts = line.split(chordTokenRegex);
      return (
        <div key={`ln-${i}`} className={styles.lyricsLine}>
          {parts.map((part, j) => {
            if (!part) return null;
            if (part.startsWith("[") && part.endsWith("]")) {
              return (
                <strong key={`ch-${i}-${j}`} className={styles.chord}>
                  {part}
                </strong>
              );
            }
            return <span key={`tx-${i}-${j}`}>{part}</span>;
          })}
        </div>
      );
    });
  }, [displayedText]);

  const composerSlug = songData?.composer?.slug || "";
  const composerName = songData?.composer?.name || "Không rõ tác giả";

  return (
    <>
      <div className="song-detail-container">
        <div className="song-detail-main">
          <div id="song-content-to-print">
            <div className={styles.header}>
              <h1>{songData.title}</h1>
              <p className={styles.songMeta}>
                Sáng tác:{" "}
                {composerSlug ? (
                  <Link
                    href={`/composers/${composerSlug}`}
                    className={styles.composerLink}
                    aria-label={`Nhạc sĩ ${composerName}`}
                    title={composerName}
                    prefetch
                  >
                    {composerName}
                  </Link>
                ) : (
                  <span className={styles.composerLink} aria-label={composerName}>
                    {composerName}
                  </span>
                )}
              </p>
            </div>

            {/* Divider thẩm mỹ dưới header */}
            <hr className={styles.sectionDivider} aria-hidden="true" />

            <div className={styles.lyricsContainer} style={{ fontSize: `${fontSize}px` }}>
              {parsedLyrics}
            </div>
          </div>

          <RelatedSongs slug={songSlug} limit={8} />
        </div>

        {/* Desktop sticky card */}
        <aside className="song-detail-sidebar">
          <ControlPanel
            current_key={displayKey}
            onTranspose={handleTranspose}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            songSlug={songSlug}
            songId={songData.id}
            initialIsFavorited={initialIsFavorited}
            isLoggedIn={isLoggedIn}
          />
        </aside>
      </div>

      {/* Tablet/mobile fixed toolbar */}
      <div className="control-toolbar">
        <div className="toolbar-inner">
          <ControlPanel
            asToolbar
            current_key={displayKey}
            onTranspose={handleTranspose}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            songSlug={songSlug}
            songId={songData.id}
            initialIsFavorited={initialIsFavorited}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </>
  );
}
