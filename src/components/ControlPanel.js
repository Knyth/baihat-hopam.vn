"use client";

// Nhận vào các props mới: current_key và onTranspose
export default function ControlPanel({ current_key, onFontSizeChange, onTranspose }) {
  
  return (
    <div className="control-panel">
      <div className="panel-card">
        <h3 className="panel-title">Bảng Điều Khiển</h3>
        
        <div className="control-group">
          <label className="control-label">Tông</label>
          <div className="transpose-controls">
            {/* NỐI DÂY: Gắn hàm onTranspose vào sự kiện onClick */}
            <button 
              className="control-button"
              onClick={() => onTranspose(-1)} // Giảm 1 nửa cung
            >
              -
            </button>
            <span className="current-key">{current_key}</span> 
            <button 
              className="control-button"
              onClick={() => onTranspose(1)} // Tăng 1 nửa cung
            >
              +
            </button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Cỡ chữ</label>
          <div className="fontsize-controls">
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