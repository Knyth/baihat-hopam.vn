// src/components/SongCard.js

import Link from "next/link";
import styles from "./SongCard.module.css";

/**
 * Card tối giản, dùng lại nhiều nơi.
 * Ưu tiên hiển thị nghệ sĩ đầu tiên; nếu không có, fallback composer.
 */
const SongCard = ({ song }) => {
  const displayName = song?.artists?.[0]?.name || song?.composer?.name || "";
  const href = `/songs/${song.slug}`;

  return (
    <Link
      href={href}
      className={styles.card}
      aria-label={`${song.title}${displayName ? ` — ${displayName}` : ""}`}
    >
      <h3 className={styles.songTitle} title={song.title}>
        {song.title}
      </h3>
      {displayName ? (
        <p className={styles.displayName} title={displayName}>
          {displayName}
        </p>
      ) : (
        <p className={styles.displayNameMuted}>Không rõ nghệ sĩ/tác giả</p>
      )}
    </Link>
  );
};

export default SongCard;
