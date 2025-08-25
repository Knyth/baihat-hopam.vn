// src/app/songs/[slug]/page.js

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import FavoriteButton from '@/components/FavoriteButton'; // <-- IMPORT NÚT BẤM
import { notFound } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Hàm trợ giúp để lấy thông tin người dùng hiện tại (tái sử dụng)
async function getCurrentUser() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// Hàm chính để render trang
export default async function SongDetailPage({ params }) {
  const { slug } = params;

  // 1. Lấy thông tin bài hát từ database
  const song = await prisma.song.findUnique({
    where: { slug },
  });

  if (!song) {
    notFound(); // Hiển thị trang 404 nếu không tìm thấy bài hát
  }

  // 2. Lấy thông tin người dùng đang đăng nhập
  const user = await getCurrentUser();
  let isFavorited = false;

  // 3. Nếu người dùng đã đăng nhập, kiểm tra xem họ đã yêu thích bài hát này chưa
  if (user) {
    const favoriteRecord = await prisma.userFavorite.findUnique({
      where: {
        user_id_song_id: {
          user_id: user.id,
          song_id: song.id,
        },
      },
    });
    isFavorited = !!favoriteRecord; // Chuyển kết quả thành true/false
  }

  return (
    <div>
      <h1>{song.title}</h1>
      <p>Nội dung bài hát sẽ hiển thị ở đây...</p>
      
      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Hiển thị nút Yêu thích CHỈ KHI người dùng đã đăng nhập */}
      {user && (
        <div>
          <h3>Lưu vào Sổ tay của bạn:</h3>
          <FavoriteButton songId={song.id} initialIsFavorited={isFavorited} />
        </div>
      )}

      {!user && (
        <p>
          <a href="/auth" style={{ color: 'var(--primary-color)' }}>Đăng nhập</a> để lưu bài hát này!
        </p>
      )}
    </div>
  );
}