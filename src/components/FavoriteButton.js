// src/components/FavoriteButton.js
"use client";

import { useState, useTransition, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ songId, initialIsFavorited }) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const handleToggleFavorite = async () => {
    if (isPending) return;

    // --- CẬP NHẬT LOGIC MỚI ---
    startTransition(async () => {
      // 1. Cập nhật UI ngay lập tức để người dùng thấy phản hồi
      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);

      // Kích hoạt hiệu ứng "nảy"
      if (newFavoritedState) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400); 
      }

      try {
        // 2. Gọi API endpoint mới, luôn là phương thức POST
        const response = await fetch(`/api/user/favorites/toggle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId }), // Gửi songId trong body
        });

        const result = await response.json();

        // 3. Xử lý kết quả trả về
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Có lỗi xảy ra');
        }

        // Nếu thành công, hiển thị toast
        toast.success(result.added ? 'Đã thêm vào yêu thích!' : 'Đã xóa khỏi yêu thích.');

      } catch (error) {
        // 4. Nếu có lỗi, hoàn tác lại trạng thái UI và báo lỗi
        setIsFavorited(!newFavoritedState); 
        toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    });
  };

  const buttonClasses = [
    styles.favoriteButton,
    isFavorited ? styles.favorited : '',
    isAnimating ? styles.animating : ''
  ].join(' ').trim();

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isPending}
      className={buttonClasses}
      aria-label={isFavorited ? "Xóa khỏi Yêu thích" : "Thêm vào Yêu thích"}
      title={isFavorited ? "Xóa khỏi Yêu thích" : "Thêm vào Yêu thích"}
    >
      {isFavorited ? <FaHeart className={styles.icon} /> : <FaRegHeart className={styles.icon} />}
    </button>
  );
}