// src/utils/music.js

// Hàm này sẽ nhận một hợp âm và một lượng để dịch chuyển
export const transposeChord = (chord, amount) => {
  // BƯỚC BẢO VỆ (GUARD CLAUSE):
  // Nếu "chord" không phải là một chuỗi ký tự hợp lệ,
  // hãy trả về ngay lập tức để tránh bị crash.
  if (!chord || typeof chord !== "string") {
    return chord;
  }

  // Mảng các nốt nhạc theo thứ tự chromatic
  const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const flatScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  // Regex để tách nốt gốc và phần còn lại của hợp âm (ví dụ: "m7", "sus4")
  const regex = /^([A-G][#b]?)(.*)/;
  const match = chord.match(regex);

  // Nếu không khớp với định dạng hợp âm, trả về nguyên bản
  if (!match) return chord;

  const root = match[1];
  const rest = match[2];

  // Tìm vị trí của nốt gốc trong thang âm
  let rootIndex = scale.indexOf(root);
  if (rootIndex === -1) {
    rootIndex = flatScale.indexOf(root);
  }
  if (rootIndex === -1) return chord; // Không tìm thấy nốt, trả về nguyên bản

  // Tính toán vị trí mới sau khi dịch chuyển
  let newIndex = (rootIndex + amount) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }

  // Lấy nốt mới và ghép lại với phần còn lại
  const newRoot = scale[newIndex];
  return newRoot + rest;
};

// Bạn có thể thêm các hàm xử lý nhạc lý khác vào đây trong tương lai
