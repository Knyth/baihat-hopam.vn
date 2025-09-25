// src/utils/chordpro.js

// Chuẩn hoá xuống dòng: \r\n, \r => \n
export function normalizeNewlines(s = "") {
  return String(s).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * parseChordPro:
 * - Đọc các directive: {title:}, {composer:}, {key:}, {slug:}, {artists:}, {genres:}
 * - Trả về { meta, body }
 */
export function parseChordPro(src = "") {
  const text = normalizeNewlines(src);
  const lines = text.split("\n");
  const meta = {
    title: "",
    composer: "",
    key: "",
    slug: "",
    artists: [],
    genres: [],
  };
  const bodyLines = [];

  // {name: value}
  const dirRe = /^\{(\w+)\s*:\s*([^}]+)\}/;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const m = line.match(dirRe);
    if (m) {
      const k = m[1].toLowerCase();
      const v = m[2].trim();

      if (k === "title") meta.title = v;
      else if (k === "composer" || k === "artist" || k === "subtitle") meta.composer = v;
      else if (k === "key") meta.key = v;
      else if (k === "slug") meta.slug = v;
      else if (k === "artists")
        meta.artists = v.split(",").map((s) => s.trim()).filter(Boolean);
      else if (k === "genres")
        meta.genres = v.split(",").map((s) => s.trim()).filter(Boolean);

      continue; // bỏ dòng directive khỏi body
    }
    bodyLines.push(line);
  }

  const body = bodyLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();

  return { meta, body };
}
