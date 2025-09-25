// src/components/SongList.js

"use client";

import Link from "next/link";

export default function SongList({ songs }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {songs.map((song) => (
        <li
          key={song.id}
          style={{
            borderBottom: "1px solid var(--border-color)",
            display: "grid",
            gridTemplateColumns: "1fr auto", // NEW: chừa cột metric khi có
            alignItems: "center",
          }}
        >
          <Link
            href={`/songs/${song.slug}`}
            style={{
              display: "block",
              padding: "1.25rem 0.5rem",
              textDecoration: "none",
              color: "inherit",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <h2 style={{ fontSize: "1.25rem", color: "var(--primary-color)", fontWeight: "600" }}>
              {song.title}
            </h2>
            {song.composer && (
              <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                {song.composer.name}
              </p>
            )}
          </Link>

          {/* === NEW: metric 7 ngày (nếu có) === */}
          {"views7d" in song && (
            <div
              style={{
                paddingRight: ".5rem",
                color: "var(--text-secondary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {song.views7d}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
