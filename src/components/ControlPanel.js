"use client";

import { useState, useEffect } from 'react';
// BƯỚC 1: Xóa dòng import 'html2pdf.js' khỏi đây. Chúng ta sẽ gọi nó sau.

export default function ControlPanel({ current_key, onFontSizeChange, onTranspose, songSlug }) {
  // --- STATE CHO CUỘN TỰ ĐỘNG ---
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);

  // --- LOGIC CUỘN TỰ ĐỘNG (HOÀN TOÀN ĐÚNG, SẼ HOẠT ĐỘNG SAU KHI SỬA LỖI) ---
  useEffect(() => {
    let intervalId = null;
    if (isScrolling) {
      intervalId = setInterval(() => {
        window.scrollBy(0, 1);
      }, 120 - (scrollSpeed * 10));
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScrolling, scrollSpeed]);

  // --- HÀM XỬ LÝ ---
  const handleToggleScroll = () => setIsScrolling(prev => !prev);
  const handleSpeedChange = (event) => setScrollSpeed(Number(event.target.value));

  // BƯỚC 2: SỬA ĐỔI HÀM TẢI PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById('song-content-to-print');
    if (!element) return;

    // Chỉ import khi người dùng bấm nút!
    // Dùng (await import(...)).default để lấy đúng module
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 1,
      filename: `${songSlug}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Gọi hàm sau khi đã import thành công
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="control-panel">
      <div className="panel-card">
        <h3 className="panel-title">Bảng Điều Kiển</h3>
        
        {/* Các control group khác giữ nguyên */}
        <div className="control-group">
          <label className="control-label">Tông</label>
          <div className="transpose-controls">
            <button className="control-button" onClick={() => onTranspose(-1)}>-</button>
            <span className="current-key">{current_key}</span>
            <button className="control-button" onClick={() => onTranspose(1)}>+</button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Cỡ chữ</label>
          <div className="fontsize-controls">
            <button className="control-button" onClick={() => onFontSizeChange(-2)}>A-</button>
            <button className="control-button" onClick={() => onFontSizeChange(2)}>A+</button>
          </div>
        </div>

        <div className='control-group'>
          <label className='control-label'>Cuộn tự động</label>
          <div className='autoscroll-controls'>
            <button onClick={handleToggleScroll} className='control-button scroll-toggle'>
              {isScrolling ? 'Tạm dừng' : 'Bắt đầu'}
            </button>
            <input
              type="range" min="1" max="10" step="1"
              value={scrollSpeed}
              onChange={handleSpeedChange}
              className='speed-slider'
            />
          </div>
        </div>

        <div className='control-group'>
          <label className='control-label'>Lưu trữ</label>
          <div className='action-controls'>
            <button onClick={handleDownloadPDF} className='control-button download-pdf'>
              Tải về PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}