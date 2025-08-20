"use client";

import { useState, useMemo } from 'react'; // Triệu hồi thêm "bộ nhớ đệm" useMemo
import SongLyrics from '@/components/SongLyrics';
import ControlPanel from '@/components/ControlPanel';
import { transposeChord } from '@/utils/music'; // Triệu hồi "công thức" chuyển tông

export default function SongDisplay({ songData }) {
  // === STATE MANAGEMENT (QUẢN LÝ "TRÍ NHỚ") ===
  const [fontSize, setFontSize] = useState(18);
  // THÊM MỚI: "Trí nhớ" cho bước nhảy tông, ban đầu là 0 (tông gốc)
  const [transposeStep, setTransposeStep] = useState(0);

  // === HANDLERS (CÁC HÀM XỬ LÝ SỰ KIỆN) ===
  const handleFontSizeChange = (amount) => {
    setFontSize(prevSize => Math.max(12, Math.min(32, prevSize + amount)));
  };

  // THÊM MỚI: Hàm xử lý thay đổi tông
  const handleTranspose = (amount) => {
    setTransposeStep(prevStep => prevStep + amount);
  };

  // === DERIVED STATE & MEMOIZATION (TÍNH TOÁN VÀ TỐI ƯU HÓA) ===
  // THÊM MỚI: Tính toán lại lời và hợp âm MỖI KHI transposeStep thay đổi
  const transposedLyrics = useMemo(() => {
    if (transposeStep === 0) {
      return songData.lyrics_chords; // Nếu không chuyển tông, trả về bản gốc
    }
    // Dùng lại "máy quét" hợp âm
    const regex = /\[([^\]]+)\]/g;
    // Thay thế mỗi hợp âm tìm được bằng kết quả từ "công thức" transposeChord
    return songData.lyrics_chords.replace(regex, (match, chord) => {
      const transposed = transposeChord(chord, transposeStep);
      return `[${transposed}]`;
    });
  }, [transposeStep, songData.lyrics_chords]); // Chỉ tính toán lại khi 2 giá trị này thay đổi

  // THÊM MỚI: Tính toán tông hiện tại để hiển thị
  const currentKey = useMemo(() => {
    return transposeChord(songData.original_key, transposeStep);
  }, [transposeStep, songData.original_key]);


  // === RENDER ===
  return (
    <div className="song-detail-layout">
      {/* Cột chính - Nội dung bài hát */}
      <main className="song-content">
        <h1 className="text-4xl font-bold">{songData.title}</h1>
        <h2 className="text-2xl text-gray-600 mt-2">
          Sáng tác: {songData.composer.name}
        </h2>
        
        <div style={{ fontSize: `${fontSize}px` }}>
          {/* SỬA ĐỔI: Dùng lời đã được chuyển tông */}
          <SongLyrics lyrics_chords={transposedLyrics} />
        </div>
      </main>

      {/* Cột phụ - Bảng điều khiển */}
      <aside className="song-sidebar">
        <ControlPanel 
          current_key={currentKey} // SỬA ĐỔI: Dùng tông đã được tính toán
          onFontSizeChange={handleFontSizeChange}
          onTranspose={handleTranspose} // THÊM MỚI: Truyền hàm chuyển tông
        />
      </aside>
    </div>
  );
}