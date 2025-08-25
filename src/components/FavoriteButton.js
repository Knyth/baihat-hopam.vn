// src/components/FavoriteButton.js
"use client";

import { useState, useTransition } from 'react';

export default function FavoriteButton({ songId, initialIsFavorited }) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, startTransition] = useTransition();

  const handleFavorite = async () => {
    // Nếu chưa yêu thích, thực hiện hành động "thêm"
    if (!isFavorited) {
      setIsFavorited(true); // Cập nhật giao diện ngay lập tức
      startTransition(async () => {
        const res = await fetch(`/api/user/favorites/${songId}`, { method: 'POST' });
        if (!res.ok) {
          // Nếu có lỗi, trả lại trạng thái cũ
          setIsFavorited(false); 
          alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
      });
    } else { // Nếu đã yêu thích, thực hiện hành động "xóa"
      setIsFavorited(false); // Cập nhật giao diện ngay lập tức
      startTransition(async () => {
        const res = await fetch(`/api/user/favorites/${songId}`, { method: 'DELETE' });
        if (!res.ok) {
          // Nếu có lỗi, trả lại trạng thái cũ
          setIsFavorited(true);
          alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
      });
    }
  };

  return (
    <button onClick={handleFavorite} disabled={isPending} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem' }}>
      {isFavorited ? '❤️' : '🤍'}
    </button>
  );
}