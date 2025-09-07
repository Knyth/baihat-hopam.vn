// src/components/ControlPanel.js
"use client";

import { useState, useEffect } from 'react';
// --- LOẠI BỎ: Không cần useSession nữa ---
// import { useSession } from 'next-auth/react'; 
import FavoriteButton from './FavoriteButton';
// --- LOẠI BỎ: Không cần Skeleton nữa vì không còn trạng thái loading ---
// import ActionButtonsSkeleton from './ActionButtonsSkeleton'; 

// Icons không thay đổi
const PlayIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" style={{color: '#28a745', width: '24px', height: '24px'}}> <path d="M8 5v14l11-7z" /> </svg> );
const PauseIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" style={{color: '#dc3545', width: '24px', height: '24px'}}> <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> </svg> );

export default function ControlPanel({ 
  current_key, onFontSizeChange, onTranspose, songSlug, fontSize,
  songId, 
  initialIsFavorited,
  isLoggedIn // <-- NHẬN TRỰC TIẾP TỪ SERVER
}) {
  // --- LOẠI BỎ: Tất cả state liên quan đến session ---
  // const { data: session, status } = useSession();
  // const isLoading = status === 'loading';

  // State cho các chức năng khác không thay đổi
  const [isDownloading, setIsDownloading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);

  // Logic cuộn trang và tải PDF không thay đổi
  useEffect(() => {
    let intervalId = null;
    if (isScrolling) {
      intervalId = setInterval(() => { window.scrollBy(0, 1); }, 120 - (scrollSpeed * 10));
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isScrolling, scrollSpeed]);

  const handleToggleScroll = () => setIsScrolling(prev => !prev);
  const handleSpeedChange = (event) => setScrollSpeed(Number(event.target.value));
  
  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const element = document.getElementById('song-content-to-print');
    if (!element) { 
      setIsDownloading(false); 
      return; 
    }
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = { margin: [0.5, 0.5, 0.5, 0.5], filename: `${songSlug}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().from(element).set(opt).save().finally(() => setIsDownloading(false));
  };

  // === LOGIC MỚI: Đơn giản hóa dựa trên prop 'isLoggedIn' ===
  const renderActionButtons = () => {
    // Nếu đã đăng nhập (thông tin từ server), hiển thị cả 2 nút
    if (isLoggedIn) {
      return (
        <>
          <FavoriteButton songId={songId} initialIsFavorited={initialIsFavorited} />
          <button onClick={handleDownloadPDF} disabled={isDownloading} className='download-pdf-main' style={{flexGrow: 1}}>
            {isDownloading ? 'Đang xử lý...' : 'Tải về PDF'}
          </button>
        </>
      );
    }
    // Nếu chưa đăng nhập, chỉ hiển thị nút Tải PDF
    return (
      <button onClick={handleDownloadPDF} disabled={isDownloading} className='download-pdf-main' style={{flexGrow: 1, width: '100%'}}>
        {isDownloading ? 'Đang xử lý...' : 'Tải về PDF'}
      </button>
    );
  }

  // Giao diện JSX không thay đổi nhiều
  return (
    <div className="panel-card"> 
      <h3 className="panel-title">Bảng Điều Khiển</h3>
      <hr className="panel-divider" />
      <div className="control-group"> <label className="control-label">Tông</label> <div className="transpose-controls"> <button className="control-button" onClick={() => onTranspose(-1)}>-</button> <span className="current-key">{current_key}</span> <button className="control-button" onClick={() => onTranspose(1)}>+</button> </div> </div>
      <div className="control-group"> <label className="control-label">Cỡ chữ</label> <div className="fontsize-controls"> <button className="control-button" onClick={() => onFontSizeChange(-2)}>A-</button> <span className="current-key">{fontSize}px</span> <button className="control-button" onClick={() => onFontSizeChange(2)}>A+</button> </div> </div>
      <div className='control-group'> <label className='control-label'>Cuộn trang</label> <div className='autoscroll-controls'> <button onClick={handleToggleScroll} className='icon-button'> {isScrolling ? <PauseIcon /> : <PlayIcon />} </button> <input type="range" min="1" max="10" step="1" value={scrollSpeed} onChange={handleSpeedChange} className='speed-slider' /> </div> </div>
      <div className='control-group'>
        <label className='control-label'>Lưu trữ</label>
        <div className='action-controls' style={{display: 'flex', gap: '10px'}}>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
}