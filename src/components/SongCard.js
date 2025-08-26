// src/components/SongCard.js

import Link from 'next/link';
import styles from './SongCard.module.css';

const SongCard = ({ song }) => {
  // Ưu tiên hiển thị tên ca sĩ đầu tiên, nếu không có thì hiển thị tên tác giả
  const displayName = song.artists?.[0]?.name || song.composer?.name || '';

  return (
    <Link href={`/songs/${song.slug}`} className={styles.card}>
      <h3 className={styles.songTitle}>{song.title}</h3>
      <p className={styles.displayName}>{displayName}</p>
    </Link>
  );
};

export default SongCard;