// File này chứa các tiện ích liên quan đến nhạc lý

// 1. "Bảng chữ cái Âm nhạc" - Bao gồm 12 nốt thăng (#)
const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// "Bảng chữ cái Âm nhạc" - Bao gồm 12 nốt giáng (b)
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

/**
 * "Công thức" chuyển tông một hợp âm duy nhất
 * @param {string} chord - Hợp âm đầu vào (ví dụ: "Am", "C#7", "Gbmaj7")
 * @param {number} amount - Số nửa cung cần dịch chuyển (có thể âm hoặc dương)
 * @returns {string} - Hợp âm mới sau khi đã chuyển tông
 */
export const transposeChord = (chord, amount) => {
  // Biểu thức chính quy (Regex) để tách nốt gốc ra khỏi phần còn lại của hợp âm
  // Ví dụ: "C#maj7" -> "C#" và "maj7"
  const regex = /^([A-G][#b]?)/;
  const match = chord.match(regex);

  // Nếu không phải là một hợp âm hợp lệ, trả về y nguyên
  if (!match) {
    return chord;
  }

  const rootNote = match[1]; // Nốt gốc (ví dụ: "C#")
  const restOfChord = chord.substring(rootNote.length); // Phần còn lại (ví dụ: "maj7")

  // Tìm vị trí của nốt gốc trong "bảng chữ cái"
  // Ưu tiên tìm trong bảng nốt giáng (Db) trước, sau đó đến bảng nốt thăng (C#)
  let noteIndex = NOTES_FLAT.indexOf(rootNote);
  let scale = NOTES_FLAT;
  
  if (noteIndex === -1) {
    noteIndex = NOTES_SHARP.indexOf(rootNote);
    scale = NOTES_SHARP;
  }
  
  // Nếu không tìm thấy nốt, trả về y nguyên
  if (noteIndex === -1) {
    return chord;
  }
  
  // Tính toán vị trí của nốt mới
  // Phép chia lấy dư (%) đảm bảo nó luôn quay vòng trong 12 nốt
  const newNoteIndex = (noteIndex + amount + scale.length) % scale.length;
  
  // Lấy ra nốt mới từ "bảng chữ cái"
  const newRootNote = scale[newNoteIndex];
  
  // Ghép nốt mới với phần còn lại để tạo ra hợp âm hoàn chỉnh
  return newRootNote + restOfChord;
};