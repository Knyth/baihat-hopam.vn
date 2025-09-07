// src/components/FavoritesList.js
"use client";

import SongCard from './SongCard';
import styles from './FavoritesList.module.css'; // Chúng ta sẽ tạo file CSS này ngay sau đây

export default function FavoritesList({ favoriteSongs }) {
  // favoriteSongs là mảng được truyền từ server component (/my-songs/page.js)

  // Trường hợp 1: Danh sách rỗng
  if (!favoriteSongs || favoriteSongs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Danh sách của bạn chưa có gì cả!</h3>
        <p>Hãy bắt đầu khám phá và nhấn vào biểu tượng ♥ tại bất kỳ bài hát nào bạn thích để lưu lại đây nhé.</p>
        <a href="/" className={styles.exploreButton}>Khám phá bài hát ngay</a>
      </div>
    );
  }

  // Trường hợp 2: Có bài hát trong danh sách
  return (
    <div className={styles.grid}>
      {favoriteSongs.map(fav => (
        // Mỗi 'fav' là một object { addedAt, song: {...} }
        // Chúng ta truyền object 'song' vào cho SongCard
        <SongCard key={fav.song.id} song={fav.song} />
      ))}
    </div>
  );
}