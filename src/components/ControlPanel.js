"use client";

// Nó KHÔNG cần useState ở đây

export default function ControlPanel({ original_key, fontSize, onFontSizeChange }) {
  
  return (
    <div className="control-panel">
      <div className="panel-card">
        {/* ... (phần tiêu đề và tông) ... */}
        <h3 className="panel-title">Bảng Điều Khiển</h3>
        
        <div className="control-group">
          <label className="control-label">Tông</label>
          <div className="transpose-controls">
            <button className="control-button">-</button>
            <span className="current-key">{original_key}</span> 
            <button className="control-button">+</button>
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">Cỡ chữ</label>
          <div className="fontsize-controls">
            {/* Quan trọng: Phải có sự kiện `onClick` ở đây */}
            <button 
              className="control-button" 
              onClick={() => onFontSizeChange(-2)} 
            >
              A-
            </button>
            <button 
              className="control-button"
              onClick={() => onFontSizeChange(2)}
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}