// src/lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/**
 * Lấy danh sách thể loại
 */
export async function getAllGenres() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/genres`);
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu thể loại từ API");
    return await res.json();
  } catch (error) {
    console.error("Lỗi API (getAllGenres):", error);
    return [];
  }
}

/**
 * Lấy danh sách tác giả
 */
export async function getAllComposers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/composers`);
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu tác giả từ API");
    return await res.json();
  } catch (error) {
    console.error("Lỗi API (getAllComposers):", error);
    return [];
  }
}

/**
 * Lấy bài hát mới nhất cho Homepage Recently Added
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getNewestSongs(limit = 10) {
  try {
    const url = `${API_BASE_URL}/api/songs/newest?limit=${encodeURIComponent(limit)}`;
    const res = await fetch(url, {
      // (tuỳ) Nếu gọi ở server component, bạn có thể đặt revalidate:
      // next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu bài hát mới nhất");
    return await res.json();
  } catch (error) {
    console.error("Lỗi API (getNewestSongs):", error);
    return [];
  }
}
