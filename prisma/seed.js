// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Hàm trợ giúp: Chuẩn hóa text để tìm kiếm
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

async function main() {
  console.log('Bắt đầu quá trình gieo mầm thông minh...');

  const user = await prisma.user.upsert({ where: { email: 'admin@baihat-hopam.vn' }, update: {}, create: { username: 'admin', email: 'admin@baihat-hopam.vn', password_hash: 'supersecretpassword' } });
  console.log(`Đã tạo/cập nhật người dùng mẫu: ${user.username}`);

  const genresToSeed = [{ name: 'Nhạc Trịnh', slug: 'nhac-trinh' }, { name: 'Nhạc Vàng', slug: 'nhac-vang' }, { name: 'V-Pop', slug: 'v-pop' }, { name: 'Ballad', slug: 'ballad' }, { name: 'Rock', slug: 'rock' }];
  for (const genreData of genresToSeed) {
    await prisma.genre.upsert({ where: { slug: genreData.slug }, update: {}, create: genreData });
  }
  console.log('Đã gieo mầm xong thể loại.');

  const composersToSeed = [{ name: 'Trịnh Công Sơn', slug: 'trinh-cong-son' }, { name: 'Lam Phương', slug: 'lam-phuong' }, { name: 'Phạm Duy', slug: 'pham-duy' }, { name: 'Văn Cao', slug: 'van-cao' }];
  for (const composerData of composersToSeed) {
    const search_name = normalizeText(composerData.name);
    await prisma.composer.upsert({
      where: { slug: composerData.slug },
      update: { name: composerData.name, search_name: search_name },
      create: { ...composerData, search_name: search_name },
    });
  }
  console.log('Đã gieo mầm xong tác giả (với chỉ mục tìm kiếm).');

  const tcs = await prisma.composer.findUnique({ where: { slug: 'trinh-cong-son' } });
  
  const diemXuaData = { title: 'Diễm Xưa', slug: 'diem-xua', lyrics_chords: `1. Mưa vẫn mưa bay trên tầng tháp [Am] cổ\nDài tay em [C] mấy thuở mắt xanh [Dm] xao...`, original_key: 'Am', rhythm: 'Slow', composer_id: tcs.id, author_id: user.id };
  const diemXua = await prisma.song.upsert({ where: { slug: 'diem-xua' }, update: {}, create: diemXuaData });
  console.log(`Đã tạo/cập nhật bài hát: ${diemXua.title}`);

  const haTrangData = { title: 'Hạ Trắng', slug: 'ha-trang', lyrics_chords: '[Am] Gọi nắng! [G] Trên vai em gầy [C] đường xa áo bay...', original_key: 'Am', rhythm: 'Ballad', composer_id: tcs.id, author_id: user.id };
  const haTrang = await prisma.song.upsert({ where: { slug: 'ha-trang' }, update: {}, create: haTrangData });
  console.log(`Đã tạo/cập nhật bài hát: ${haTrang.title}`);

  const nhacTrinh = await prisma.genre.findUnique({ where: { slug: 'nhac-trinh' } });
  const ballad = await prisma.genre.findUnique({ where: { slug: 'ballad' } });

  // Kết nối cho Diễm Xưa
  await prisma.songGenre.upsert({ where: { song_id_genre_id: { song_id: diemXua.id, genre_id: nhacTrinh.id } }, update: {}, create: { song_id: diemXua.id, genre_id: nhacTrinh.id }});
  await prisma.songGenre.upsert({ where: { song_id_genre_id: { song_id: diemXua.id, genre_id: ballad.id } }, update: {}, create: { song_id: diemXua.id, genre_id: ballad.id }});
  
  // Kết nối cho Hạ Trắng
  await prisma.songGenre.upsert({ where: { song_id_genre_id: { song_id: haTrang.id, genre_id: nhacTrinh.id } }, update: {}, create: { song_id: haTrang.id, genre_id: nhacTrinh.id }});
  // === DÒNG MỚI ĐƯỢC THÊM VÀO ĐỂ SỬA LỖI ===
  await prisma.songGenre.upsert({ where: { song_id_genre_id: { song_id: haTrang.id, genre_id: ballad.id } }, update: {}, create: { song_id: haTrang.id, genre_id: ballad.id }});
  // ==========================================
  console.log(`Đã kết nối các bài hát với thể loại.`);

  console.log('Quá trình gieo mầm đã hoàn tất!');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });