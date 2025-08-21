// File này chứa các tiện ích liên quan đến nhạc lý

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const transposeChord = (chord, amount) => {
  const regex = /^([A-G][#b]?)/;
  const match = chord.match(regex);

  if (!match) return chord;

  const rootNote = match[1];
  const restOfChord = chord.substring(rootNote.length);

  let noteIndex = NOTES_FLAT.indexOf(rootNote);
  let scale = NOTES_FLAT;
  
  if (noteIndex === -1) {
    noteIndex = NOTES_SHARP.indexOf(rootNote);
    scale = NOTES_SHARP;
  }
  
  if (noteIndex === -1) return chord;
  
  const newNoteIndex = (noteIndex + amount + scale.length) % scale.length;
  const newRootNote = scale[newNoteIndex];
  
  return newRootNote + restOfChord;
};

// === THAY ĐỔI QUAN TRỌNG NHẤT LÀ ĐÂY ===
// Chúng ta "xuất khẩu" hàm này ra như là một "gói hàng" mặc định duy nhất.
export default transposeChord;