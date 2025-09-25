// prisma/seed.js  (CommonJS)
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

/** Utils */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}
function slugify(str) {
  return normalizeText(str)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/** Upserts */
async function upsertUser() {
  const hashedPassword = await bcrypt.hash("adminpassword", 10);
  return prisma.user.upsert({
    where: { email: "admin@baihat-hopam.vn" },
    update: {},
    create: {
      name: "admin",
      email: "admin@baihat-hopam.vn",
      password_hash: hashedPassword,
    },
  });
}

async function upsertGenres() {
  const genresToSeed = [
    { name: "Nhạc Trịnh", slug: "nhac-trinh" },
    { name: "Nhạc Vàng", slug: "nhac-vang" },
    { name: "V-Pop", slug: "v-pop" },
    { name: "Ballad", slug: "ballad" },
    { name: "Rock", slug: "rock" },
  ];
  for (const g of genresToSeed) {
    await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
  }
}

async function upsertComposers() {
  const composersToSeed = [
    { name: "Trịnh Công Sơn", slug: "trinh-cong-son" },
    { name: "Lam Phương", slug: "lam-phuong" },
    { name: "Phạm Duy", slug: "pham-duy" },
    { name: "Văn Cao", slug: "van-cao" },
  ];
  for (const c of composersToSeed) {
    const search_name = normalizeText(c.name); // composer yêu cầu search_name
    await prisma.composer.upsert({
      where: { slug: c.slug },
      update: { name: c.name, search_name },
      create: { ...c, search_name },
    });
  }
}

async function upsertArtists(names) {
  // artist KHÔNG có search_name → chỉ name + slug
  const artists = [];
  for (const name of names) {
    const slug = slugify(name);
    const artist = await prisma.artist.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    artists.push(artist);
  }
  return artists;
}

async function connectSongGenres(songId, genreSlugs = []) {
  for (const slug of genreSlugs) {
    const genre = await prisma.genre.findUnique({ where: { slug } });
    if (!genre) continue;
    await prisma.songGenre.upsert({
      where: { songId_genreId: { songId, genreId: genre.id } },
      update: {},
      create: { songId, genreId: genre.id },
    });
  }
}

async function connectSongArtists(songId, artistNames = []) {
  // Xoá nối cũ rồi tạo lại, tránh trùng
  await prisma.songArtist.deleteMany({ where: { songId } });
  for (const name of artistNames) {
    const slug = slugify(name);
    const artist = await prisma.artist.findUnique({ where: { slug } });
    if (!artist) continue;
    await prisma.songArtist.create({
      data: {
        song: { connect: { id: songId } },
        artist: { connect: { id: artist.id } },
      },
    });
  }
}

async function upsertSong({
  title,
  slug, // optional → auto từ title nếu không truyền
  composerSlug, // optional
  authorUserId, // dùng để connect relation author
  lyricsChords, // optional (NHƯNG model đang bắt buộc) → sẽ fill default
  originalKey, // optional
  rhythm, // optional
  createdAt, // optional
  genreSlugs = [],
  artistNames = [],
}) {
  const songSlug = slug || slugify(title);
  const composer = composerSlug
    ? await prisma.composer.findUnique({ where: { slug: composerSlug } })
    : null;

  // Đảm bảo luôn có lyricsChords (model required)
  const lc = lyricsChords ?? "[Chưa cập nhật lời & hợp âm]";

  const base = {
    title,
    slug: songSlug,
    lyricsChords: lc, // ✅ luôn set
    ...(originalKey ? { originalKey } : {}),
    ...(rhythm ? { rhythm } : {}),
    ...(composer ? { composer: { connect: { id: composer.id } } } : {}),
  };

  // upsert song
  const song = await prisma.song.upsert({
    where: { slug: songSlug },
    update: {
      ...base,
      updatedAt: new Date(),
    },
    create: {
      ...base,
      author: { connect: { id: authorUserId } }, // connect relation author
      createdAt: createdAt || new Date(),
      updatedAt: new Date(),
    },
  });

  // Nối genres / artists
  await connectSongGenres(song.id, genreSlugs);
  await connectSongArtists(song.id, artistNames);

  return song;
}

/** MAIN */
async function main() {
  console.log("Bắt đầu seed…");
  const user = await upsertUser();
  await upsertGenres();
  await upsertComposers();

  // Bảo đảm các nghệ sĩ chính có mặt
  await upsertArtists([
    "Trịnh Công Sơn",
    "Khánh Ly",
    "Hồng Nhung",
    "Elvis Phương",
    "Chế Linh",
    "Thanh Tuyền",
  ]);

  // ===== Hai bài đã có (cập nhật & gắn artists/genres) =====
  await upsertSong({
    title: "Diễm Xưa",
    slug: "diem-xua",
    composerSlug: "trinh-cong-son",
    authorUserId: user.id,
    originalKey: "Am",
    rhythm: "Slow",
    lyricsChords: `1. Mưa vẫn mưa bay trên tầng tháp [Am] cổ...\n\nĐK: Chiều này còn [Dm] mưa sao em không lại...`,
    genreSlugs: ["nhac-trinh", "ballad"],
    artistNames: ["Trịnh Công Sơn", "Khánh Ly"],
  });

  await upsertSong({
    title: "Hạ Trắng",
    slug: "ha-trang",
    composerSlug: "trinh-cong-son",
    authorUserId: user.id,
    originalKey: "Am",
    rhythm: "Ballad",
    lyricsChords: `1. Gọi [Am] nắng, trên vai em gầy đường xa áo [Dm] bay...\n\nĐK: Thôi xin ơn [Dm] đời trong cơn mê này...`,
    genreSlugs: ["nhac-trinh", "ballad"],
    artistNames: ["Trịnh Công Sơn"],
  });

  // Bổ sung composer nếu thiếu
  await prisma.composer.upsert({
    where: { slug: "tran-thien-thanh" },
    update: { name: "Trần Thiện Thanh", search_name: normalizeText("Trần Thiện Thanh") },
    create: {
      name: "Trần Thiện Thanh",
      slug: "tran-thien-thanh",
      search_name: normalizeText("Trần Thiện Thanh"),
    },
  });

  // ===== Thêm batch bài mới cho Recently Added =====
  const batch = [
    {
      title: "Biển Nhớ",
      composerSlug: "trinh-cong-son",
      artistNames: ["Khánh Ly"],
      genreSlugs: ["nhac-trinh", "ballad"],
      originalKey: "Am",
      rhythm: "Slow",
      createdAt: daysAgo(0),
    },
    {
      title: "Tuổi Đá Buồn",
      composerSlug: "trinh-cong-son",
      artistNames: ["Khánh Ly"],
      genreSlugs: ["nhac-trinh", "ballad"],
      originalKey: "Dm",
      rhythm: "Slow",
      createdAt: daysAgo(1),
    },
    {
      title: "Cát Bụi",
      composerSlug: "trinh-cong-son",
      artistNames: ["Trịnh Công Sơn"],
      genreSlugs: ["nhac-trinh"],
      originalKey: "C",
      rhythm: "Slow",
      createdAt: daysAgo(2),
    },
    {
      title: "Một Cõi Đi Về",
      composerSlug: "trinh-cong-son",
      artistNames: ["Hồng Nhung"],
      genreSlugs: ["nhac-trinh"],
      originalKey: "G",
      rhythm: "Ballad",
      createdAt: daysAgo(3),
    },
    {
      title: "Nối Vòng Tay Lớn",
      composerSlug: "trinh-cong-son",
      artistNames: ["Trịnh Công Sơn"],
      genreSlugs: ["nhac-trinh", "rock"],
      originalKey: "G",
      rhythm: "March",
      createdAt: daysAgo(4),
    },
    {
      title: "Đóa Hoa Vô Thường",
      composerSlug: "trinh-cong-son",
      artistNames: ["Hồng Nhung"],
      genreSlugs: ["nhac-trinh"],
      originalKey: "Em",
      rhythm: "Ballad",
      createdAt: daysAgo(5),
    },
    {
      title: "Tình Khúc Vàng",
      composerSlug: "lam-phuong",
      artistNames: ["Elvis Phương"],
      genreSlugs: ["nhac-vang", "ballad"],
      originalKey: "G",
      rhythm: "Ballad",
      createdAt: daysAgo(6),
    },
    {
      title: "Lâu Đài Tình Ái",
      composerSlug: "tran-thien-thanh",
      artistNames: ["Chế Linh", "Thanh Tuyền"],
      genreSlugs: ["nhac-vang", "ballad"],
      originalKey: "G",
      rhythm: "Slow",
      createdAt: daysAgo(7),
    },
  ];

  for (const item of batch) {
    await upsertSong({
      ...item,
      authorUserId: user.id,
      // Không truyền lyricsChords → hàm upsertSong sẽ tự fill placeholder
    });
  }

  console.log("✅ Seed hoàn tất!");
}

/** Run */
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
