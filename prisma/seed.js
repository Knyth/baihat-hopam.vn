// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

async function main() {
  console.log('Bắt đầu quá trình gieo mầm thông minh...');

  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@baihat-hopam.vn' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@baihat-hopam.vn',
      password_hash: hashedPassword,
    },
  });
  console.log(`Đã tạo/cập nhật người dùng mẫu: ${user.name}`);

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
  
  // === SỬA LỖI TÊN TRƯỜNG Ở ĐÂY ===
  const diemXuaData = {
    title: 'Diễm Xưa',
    slug: 'diem-xua',
    lyricsChords: `1. Mưa vẫn mưa bay trên tầng tháp [Am] cổ\nDài tay em [C] mấy thuở mắt xanh [Dm] xao\n[E7] Nghe lá thu [Am] mưa reo mòn gót [E7] nhỏ\nĐường dài hun hút cho mắt thêm [C] sầu. [E7]\n\n2. Mưa vẫn hay mưa trên hàng lá [Am] nhỏ\nBuổi chiều ngồi [C] ngóng những chuyến mưa [Dm] qua\n[E7] Trên bước chân [Am] em âm thầm lá [E7] đổ\nChợt hồn xanh buốt cho mình xót [Am] xa.\n\nĐK:\nChiều này còn [Dm] mưa sao em không lại\nNhớ [Am] mai trong cơn đau vùi\nLàm sao có [Dm] nhau hằn lên nỗi [E7] đau\nBước [Dm] chân em xin về [E7] mau.\n\n3. Mưa vẫn hay mưa cho đời biển [Am] động\nLàm sao em [C] nhớ những vết chim [Dm] di\n[E7] Xin hãy cho [Am] mưa qua miền đất [E7] rộng\nĐể người phiêu lãng quên mình lãng [Am] du.\n\n4. (Mưa vẫn hay mưa cho đời biển [Am] động\nLàm sao em [C] biết bia đá không [Dm] đau\n[E7] Xin hãy cho [Am] mưa qua miền đất [E7] rộng\nNgày sau sỏi đá cũng cần có [Am] nhau.)`,
    originalKey: 'Am',
    rhythm: 'Slow',
    composerId: tcs.id,
    authorId: user.id
  };
  const diemXua = await prisma.song.upsert({ where: { slug: 'diem-xua' }, update: diemXuaData, create: diemXuaData });
  console.log(`Đã tạo/cập nhật bài hát: ${diemXua.title}`);

  // === SỬA LỖI TÊN TRƯỜNG Ở ĐÂY ===
  const haTrangData = {
    title: 'Hạ Trắng',
    slug: 'ha-trang',
    lyricsChords: `1. Gọi [Am] nắng, trên vai em gầy đường xa áo [Dm] bay\nNắng qua mắt buồn, lòng hoa bướm [E7] say\nLối em đi [Am] về trời không có [Dm] mây\nĐường đi suốt [E7] mùa nắng lên thắp [C] đầy\n\n2. Gọi [Am] nắng, cho cơn mê chiều nhiều hoa trắng [Dm] bay\nCho tay em dài gầy thêm nắng [E7] mai\nBước chân em [Am] về nào anh có [Dm] hay\nGọi em cho [E7] nắng chết trên sông [Am] dài.\n\nĐK: \nThôi xin ơn [Dm] đời trong cơn mê này gọi mùa thu [Am] tới\nTôi đưa em [E7] về chân em bước nhẹ trời buồn gió [Am] cao\nĐời xin có [Dm] nhau dài cho mãi sau nắng không gọi [Am] sầu\nÁo xưa dù [C] nhàu cũng xin bạc [E7] đầu gọi mãi tên [Am] nhau\n\n3. Gọi [Am] nắng, cho tóc em cài loài hoa nắng [Dm] rơi\nNắng đưa em về miền cao gió [E7] bay\nÁo em bây [Am] giờ mờ xa nẻo [Dm] mây\nGọi tên em [E7] mãi suốt cơn mê [Am] này.`,
    originalKey: 'Am',
    rhythm: 'Ballad',
    composerId: tcs.id,
    authorId: user.id
  };
  const haTrang = await prisma.song.upsert({ where: { slug: 'ha-trang' }, update: haTrangData, create: haTrangData });
  console.log(`Đã tạo/cập nhật bài hát: ${haTrang.title}`);

  const nhacTrinh = await prisma.genre.findUnique({ where: { slug: 'nhac-trinh' } });
  const ballad = await prisma.genre.findUnique({ where: { slug: 'ballad' } });

  // === SỬA LỖI TÊN TRƯỜNG Ở ĐÂY ===
  await prisma.songGenre.upsert({ where: { songId_genreId: { songId: diemXua.id, genreId: nhacTrinh.id } }, update: {}, create: { songId: diemXua.id, genreId: nhacTrinh.id }});
  await prisma.songGenre.upsert({ where: { songId_genreId: { songId: diemXua.id, genreId: ballad.id } }, update: {}, create: { songId: diemXua.id, genreId: ballad.id }});
  
  await prisma.songGenre.upsert({ where: { songId_genreId: { songId: haTrang.id, genreId: nhacTrinh.id } }, update: {}, create: { songId: haTrang.id, genreId: nhacTrinh.id }});
  await prisma.songGenre.upsert({ where: { songId_genreId: { songId: haTrang.id, genreId: ballad.id } }, update: {}, create: { songId: haTrang.id, genreId: ballad.id }});
  console.log(`Đã kết nối các bài hát với thể loại.`);

  console.log('Quá trình gieo mầm đã hoàn tất!');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });