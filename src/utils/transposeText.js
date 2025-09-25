// src/utils/transposeText.js
import { transposeChord } from "@/utils/music";

const CHORD_IN_BRACKETS = /\[([A-G](?:#|b)?[^\]\s]*)\]/g;

export function normalizeNewlines(text = "") {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\\n/g, "\n");
}

export function transposeChordedText(text = "", steps = 0) {
  if (!steps) return normalizeNewlines(text);
  const src = normalizeNewlines(text);
  return src.replace(CHORD_IN_BRACKETS, (_, chord) => {
    try {
      const t = transposeChord(chord, steps);
      return `[${t}]`;
    } catch {
      return `[${chord}]`;
    }
  });
}

export function transposeKey(originalKey = "C", steps = 0) {
  try {
    return transposeChord(originalKey, steps);
  } catch {
    return originalKey || "C";
  }
}

// ✅ named const rồi export default để tránh warning "anonymous default export"
const transposeUtils = { normalizeNewlines, transposeChordedText, transposeKey };
export default transposeUtils;
