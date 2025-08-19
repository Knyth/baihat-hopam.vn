// Đây là Component chuyên dụng để hiển thị Lời bài hát và Hợp âm

// Component này nhận vào một prop là chuỗi lyrics_chords thô
export default function SongLyrics({ lyrics_chords }) {
  
  // Đây là hàm "ma thuật" để phân tích và biến đổi text
  const parseAndRenderLyrics = (text) => {
    // Nếu không có text, trả về null để không hiển thị gì
    if (!text) return null;

    // Biểu thức chính quy (Regex) để tìm tất cả các chuỗi có dạng [Chord]
    const regex = /\[([^\]]+)\]/g;

    // Tách toàn bộ text thành từng dòng riêng biệt
    const lines = text.split('\n');

    // Dùng .map để duyệt qua từng dòng và biến đổi nó
    return lines.map((line, lineIndex) => {
      
      // Nếu là dòng trống, chỉ tạo một thẻ <br> để tạo khoảng cách
      if (line.trim() === '') {
        return <br key={`br-${lineIndex}`} />;
      }

      // Tách một dòng thành các phần xen kẽ: [lời, hợp âm, lời, hợp âm...]
      // Ví dụ: "tầng tháp [Am] cổ" sẽ thành ["tầng tháp ", "Am", " cổ"]
      const parts = line.split(regex);

      return (
        // Mỗi dòng là một thẻ <p> riêng biệt
        <p key={lineIndex} className="song-line">
          {parts.map((part, partIndex) => {
            // Logic quan trọng: Các phần tử ở vị trí lẻ (1, 3, 5...) chính là hợp âm
            if (partIndex % 2 === 1) {
              return (
                <strong key={partIndex} className="chord">
                  [{part}]
                </strong>
              );
            } else {
              // Các phần tử ở vị trí chẵn (0, 2, 4...) là lời bài hát
              return part;
            }
          })}
        </p>
      );
    });
  };

  return (
    <div className="lyrics-container">
      {parseAndRenderLyrics(lyrics_chords)}
    </div>
  );
}