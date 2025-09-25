// src/actions/favoriteActions.js
"use server"; // Đánh dấu đây là file chứa Server Actions

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFavorite({ songId }) {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: Bạn cần đăng nhập để thực hiện hành động này.");
  }

  try {
    // 2. Kiểm tra xem người dùng đã thích bài hát này chưa
    const existingFavorite = await prisma.userFavorite.findUnique({
      where: {
        userId_songId: {
          userId: userId,
          songId: songId,
        },
      },
    });

    // 3. Thực hiện hành động Thêm hoặc Xóa
    if (existingFavorite) {
      // Nếu đã thích -> Xóa khỏi danh sách yêu thích
      await prisma.userFavorite.delete({
        where: {
          userId_songId: {
            userId: userId,
            songId: songId,
          },
        },
      });
      // Cập nhật lại trang danh sách bài hát yêu thích nếu người dùng đang ở đó
      revalidatePath("/my-songs");
      return { success: true, added: false }; // Trả về kết quả: đã xóa
    } else {
      // Nếu chưa thích -> Thêm vào danh sách yêu thích
      await prisma.userFavorite.create({
        data: {
          userId: userId,
          songId: songId,
        },
      });
      revalidatePath("/my-songs");
      return { success: true, added: true }; // Trả về kết quả: đã thêm
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Đã có lỗi xảy ra ở server.");
  }
}
