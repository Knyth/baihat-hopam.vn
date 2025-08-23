// src/components/ControlPanel.js

"use client";

import { useState, useEffect } from 'react';

const PlayIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" style={{color: '#28a745'}}> <path d="M8 5v14l11-7z" /> </svg> );
const PauseIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" style={{color: '#dc3545'}}> <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> </svg> );

export default function ControlPanel({ current_key, onFontSizeChange, onTranspose, songSlug, fontSize }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);

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

  const handleToggleScroll = () => setIsScrolling(prev => !prev);
  const handleSpeedChange = (event) => setScrollSpeed(Number(event.target.value));

  const handleDownloadPDF = async () => {
    const element = document.getElementById('song-content-to-print');
    if (!element) return;
    
    const lyricsContainer = element.querySelector('.lyrics-container');
    const originalLineHeight = lyricsContainer ? lyricsContainer.style.lineHeight : '';

    if (lyricsContainer) {
      lyricsContainer.style.lineHeight = '1.4'; 
    }

    const html2pdf = (await import('html2pdf.js')).default;
    const opt = { margin: 1, filename: `${songSlug}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };

    html2pdf().from(element).set(opt).save().then(() => {
      if (lyricsContainer) {
        lyricsContainer.style.lineHeight = originalLineHeight;
      }
    });
  };

  return (
    <div className="panel-card">
      <h3 className="panel-title">Bảng Điều Kiển</h3>
      
      <hr className="panel-divider" />
      
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
          <span className="current-key">{fontSize}px</span>
          <button className="control-button" onClick={() => onFontSizeChange(2)}>A+</button>
        </div>
      </div>
      <div className='control-group'>
        <label className='control-label'>Cuộn trang</label>
        <div className='autoscroll-controls'>
          <button onClick={handleToggleScroll} className='icon-button'>
            {isScrolling ? <PauseIcon /> : <PlayIcon />}
          </button>
          <input type="range" min="1" max="10" step="1" value={scrollSpeed} onChange={handleSpeedChange} className='speed-slider' />
        </div>
      </div>
      <div className='control-group'>
        <label className='control-label'>Lưu trữ</label>
        <div className='action-controls'>
          <button onClick={handleDownloadPDF} className='download-pdf-main'>
            Tải về PDF
          </button>
        </div>
      </div>
    </div>
  );
}