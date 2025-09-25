// src/components/FavoritesList.js

"use client";

import Link from "next/link";

export default function FavoritesList({ items = [] }) {
  if (!items.length) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Bạn chưa yêu thích bài hát nào.</p>
        <p>
          Quay lại{" "}
          <Link href="/" className="composerLink">
            trang chủ
          </Link>{" "}
          để khám phá nhé.
        </p>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((s) => (
        <li key={s.slug} style={{ marginBottom: ".5rem" }}>
          <Link href={`/songs/${s.slug}`}>{s.title}</Link>
        </li>
      ))}
    </ul>
  );
}
