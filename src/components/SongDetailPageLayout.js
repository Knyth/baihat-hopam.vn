// src/components/SongDetailPageLayout.js

"use client";

// Đây là component chuyên dụng để xử lý layout của trang chi tiết bài hát
export default function SongDetailPageLayout({ mainContent, sidebarContent }) {
  return (
    <div className="song-detail-container">
      <main className="song-detail-main">{mainContent}</main>
      <aside className="song-detail-sidebar">{sidebarContent}</aside>
    </div>
  );
}
