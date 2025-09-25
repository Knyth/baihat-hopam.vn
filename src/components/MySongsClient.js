// src/components/MySongsClient.js
"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

// Component con để render một bài hát trong danh sách
function FavoriteSongItem({ song, onRemove }) {
  const handleRemove = () => {
    // Gọi hàm onRemove được truyền từ component cha với ID của bài hát
    onRemove(song.id);
  };

  return (
    <div className="favorite-song-item">
      <div className="song-info">
        <Link href={`/songs/${song.slug}`} className="song-title-link">
          {song.title}
        </Link>
        <p className="song-composer">{song.composer ? song.composer.name : "Không rõ"}</p>
      </div>
      <button onClick={handleRemove} className="remove-button" title="Xóa khỏi danh sách">
        🗑️
      </button>
    </div>
  );
}

// Component chính của trang
export default function MySongsClient({ initialSongs }) {
  // Quản lý danh sách bài hát bằng state để có thể cập nhật giao diện
  const [songs, setSongs] = useState(initialSongs);

  const handleRemoveSong = async (songId) => {
    // 1. Cập nhật giao diện ngay lập tức (Optimistic Update)
    // Lọc ra bài hát có id trùng khớp và tạo một mảng mới
    const updatedSongs = songs.filter((song) => song.id !== songId);
    setSongs(updatedSongs);

    // 2. Hiển thị thông báo
    toast("Đã xóa bài hát.", { icon: "🗑️" });

    // 3. Gọi API để xóa thật trong database
    const res = await fetch(`/api/user/favorites/${songId}`, {
      method: "DELETE",
    });

    // 4. Nếu API báo lỗi, hoàn tác lại thay đổi trên giao diện
    if (!res.ok) {
      setSongs(songs); // Trả lại danh sách cũ
      toast.error("Có lỗi xảy ra, không thể xóa bài hát.");
    }
  };

  // Nếu không có bài hát nào, hiển thị trạng thái trống
  if (songs.length === 0) {
    return (
      <div className="empty-state-container">
        <h2>Danh sách của bạn chưa có gì cả!</h2>
        <p>
          Hãy bắt đầu khám phá và nhấn vào biểu tượng ❤️ tại bất kỳ bài hát nào bạn thích để lưu lại
          đây nhé.
        </p>
        <Link href="/songs" className="cta-button">
          Khám phá bài hát ngay
        </Link>
      </div>
    );
  }

  // Nếu có bài hát, hiển thị danh sách
  return (
    <div className="favorites-list-container">
      {songs.map((song) => (
        <FavoriteSongItem key={song.id} song={song} onRemove={handleRemoveSong} />
      ))}
    </div>
  );
}
