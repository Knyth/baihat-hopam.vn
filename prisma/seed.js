// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu quá trình gieo mầm thông minh...');

  // === 1. TẠO NGƯỜI DÙNG MẪU (Dùng upsert) ===
  const user = await prisma.user.upsert({
    where: { email: 'admin@baihat-hopam.vn' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@baihat-hopam.vn',
      password_hash: 'supersecretpassword', // Chỉ để test
    },
  });
  console.log(`Đã tạo/cập nhật người dùng mẫu: ${user.username}`);


  // === 2. TẠO THỂ LOẠI (Dùng upsert) ===
  const genresToSeed = [
    { name: 'Nhạc Trịnh', slug: 'nhac-trinh' },
    { name: 'Nhạc Vàng', slug: 'nhac-vang' },
    { name: 'V-Pop', slug: 'v-pop' },
    { name: 'Ballad', slug: 'ballad' },
    { name: 'Rock', slug: 'rock' },
  ];
  for (const genreData of genresToSeed) {
    await prisma.genre.upsert({
      where: { slug: genreData.slug },
      update: {},
      create: genreData,
    });
  }
  console.log('Đã gieo mầm xong thể loại.');


  // === 3. TẠO TÁC GIẢ (Dùng upsert) ===
  const composersToSeed = [
    { name: 'Trịnh Công Sơn', slug: 'trinh-cong-son' },
    { name: 'Lam Phương', slug: 'lam-phuong' },
    { name: 'Phạm Duy', slug: 'pham-duy' },
    { name: 'Văn Cao', slug: 'van-cao' },
  ];
  for (const composerData of composersToSeed) {
    await prisma.composer.upsert({
      where: { slug: composerData.slug },
      update: {},
      create: composerData,
    });
  }
  console.log('Đã gieo mầm xong tác giả.');


  // === 4. TẠO HOẶC CẬP NHẬT BÀI HÁT ===

  // Lấy ID của Trịnh Công Sơn
  const tcs = await prisma.composer.findUnique({ where: { slug: 'trinh-cong-son' } });

  // --- DIỄM XƯA ---
  const diemXua = await prisma.song.upsert({
    where: { slug: 'diem-xua' },
    update: {}, // Không cập nhật gì nếu đã tồn tại
    create: {
      title: 'Diễm Xưa',
      slug: 'diem-xua',
      lyrics_chords: `1. Mưa vẫn mưa bay trên tầng tháp [Am] cổ
Dài tay em [C] mấy thuở mắt xanh [Dm] xao
[E7] Nghe lá thu [Am] mưa reo mòn gót [E7] nhỏ
Đường dài hun hút cho mắt thêm [C] sầu. [E7]

2. Mưa vẫn hay mưa trên hàng lá [Am] nhỏ
Buổi chiều ngồi [C] ngóng những chuyến mưa [Dm] qua
[E7] Trên bước chân [Am] em âm thầm lá [E7] đổ
Chợt hồn xanh buốt cho mình xót [Am] xa.

ĐK:
Chiều này còn [Dm] mưa sao em không lại
Nhớ [Am] mai trong cơn đau vùi
Làm sao có [Dm] nhau hằn lên nỗi [E7] đau
Bước [Dm] chân em xin về [E7] mau.

3. Mưa vẫn hay mưa cho đời biển [Am] động
Làm sao em [C] nhớ những vết chim [Dm] di
[E7] Xin hãy cho [Am] mưa qua miền đất [E7] rộng
Để người phiêu lãng quên mình lãng [Am] du.

4. (Mưa vẫn hay mưa cho đời biển [Am] động
Làm sao em [C] biết bia đá không [Dm] đau
[E7] Xin hãy cho [Am] mưa qua miền đất [E7] rộng
Ngày sau sỏi đá cũng cần có [Am] nhau.)`,
      original_key: 'Am',
      rhythm: 'Slow',
      composer_id: tcs.id,
      author_id: user.id,
    },
  });
  console.log(`Đã tạo/cập nhật bài hát: ${diemXua.title}`);

  // --- HẠ TRẮNG ---
  const haTrang = await prisma.song.upsert({
    where: { slug: 'ha-trang' },
    update: {},
    create: {
      title: 'Hạ Trắng',
      slug: 'ha-trang',
      lyrics_chords: '[Am] Gọi nắng! [G] Trên vai em gầy [C] đường xa áo bay...',
      original_key: 'Am',
      rhythm: 'Ballad',
      composer_id: tcs.id,
      author_id: user.id,
    },
  });
  console.log(`Đã tạo/cập nhật bài hát: ${haTrang.title}`);


  // === 5. KẾT NỐI BÀI HÁT VỚI THỂ LOẠI (Bước quan trọng nhất) ===
  
  // Lấy ID của các thể loại
  const nhacTrinh = await prisma.genre.findUnique({ where: { slug: 'nhac-trinh' } });
  const ballad = await prisma.genre.findUnique({ where: { slug: 'ballad' } });

  // Kết nối "Diễm Xưa" với Nhạc Trịnh và Ballad
  await prisma.songGenre.upsert({
    where: { song_id_genre_id: { song_id: diemXua.id, genre_id: nhacTrinh.id } },
    update: {},
    create: { song_id: diemXua.id, genre_id: nhacTrinh.id },
  });
  await prisma.songGenre.upsert({
    where: { song_id_genre_id: { song_id: diemXua.id, genre_id: ballad.id } },
    update: {},
    create: { song_id: diemXua.id, genre_id: ballad.id },
  });
  console.log(`Đã kết nối "${diemXua.title}" với các thể loại.`);

  // Kết nối "Hạ Trắng" với Nhạc Trịnh
  await prisma.songGenre.upsert({
    where: { song_id_genre_id: { song_id: haTrang.id, genre_id: nhacTrinh.id } },
    update: {},
    create: { song_id: haTrang.id, genre_id: nhacTrinh.id },
  });
  console.log(`Đã kết nối "${haTrang.title}" với các thể loại.`);

  console.log('Quá trình gieo mầm đã hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });