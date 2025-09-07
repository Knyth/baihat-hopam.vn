// src/app/my-songs/page.js

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Container from "@/components/layout/Container";
import FavoritesList from "@/components/FavoritesList"; // <-- IMPORT COMPONENT MỚI

export default async function MySongsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    // Middleware đã xử lý, nhưng để đây để tăng cường bảo mật
    redirect("/auth"); 
  }

  const favoriteSongs = await prisma.userFavorite.findMany({
    where: { userId: userId },
    include: {
      song: { 
        include: {
          composer: { select: { name: true } },
          artists: { select: { artist: { select: { name: true } } }, take: 1 }, // Lấy 1 nghệ sĩ đầu tiên
        },
      },
    },
    orderBy: { addedAt: 'desc' }
  });

  return (
    <Container>
      <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Bài hát Yêu thích</h1>
        <p style={{ color: '#6c757d', marginTop: 0, marginBottom: '2rem' }}>
          Tất cả những giai điệu bạn đã lưu lại.
        </p>

        {/* --- SỬ DỤNG COMPONENT MỚI, THAY THẾ CHO DỮ LIỆU THÔ --- */}
        <FavoritesList favoriteSongs={favoriteSongs} />
        
      </div>
    </Container>
  );
}