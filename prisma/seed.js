// Đây là file "gieo mầm" cho database
// Chúng ta sẽ dùng nó để tạo dữ liệu ban đầu

// Import "bộ công cụ" Prisma Client
const { PrismaClient } = require('../src/generated/prisma');

// Khởi tạo một đối tượng PrismaClient
const prisma = new PrismaClient();

// Danh sách các "hạt giống" thể loại nhạc
const genresToSeed = [
  { name: 'Nhạc Trịnh', slug: 'nhac-trinh', description: 'Những bản tình ca bất hủ của Trịnh Công Sơn.' },
  { name: 'Nhạc Vàng', slug: 'nhac-vang', description: 'Dòng nhạc trữ tình phổ biến trước năm 1975.' },
  { name: 'V-Pop', slug: 'v-pop', description: 'Nhạc Pop hiện đại của Việt Nam.' },
  { name: 'Ballad', slug: 'ballad', description: 'Những bản nhạc nhẹ nhàng, sâu lắng.' },
  { name: 'Rock', slug: 'rock', description: 'Dòng nhạc mạnh mẽ, cá tính.' },
];

// Danh sách các "hạt giống" tác giả
const composersToSeed = [
  { name: 'Trịnh Công Sơn', slug: 'trinh-cong-son', bio: 'Một trong những nhạc sĩ lớn nhất của Tân nhạc Việt Nam.' },
  { name: 'Lam Phương', slug: 'lam-phuong', bio: 'Nhạc sĩ của những ca khúc trữ tình, bình dân và giai điệu giản dị.' },
  { name: 'Phạm Duy', slug: 'pham-duy', bio: 'Nhạc sĩ, ca sĩ, nhà nghiên cứu âm nhạc lớn của Việt Nam.' },
  { name: 'Văn Cao', slug: 'van-cao', bio: 'Tác giả của Quốc ca Việt Nam và những bản tình ca lãng mạn.' },
];

// Dữ liệu bài hát mẫu để "gieo mầm"
const songsToSeed = [
  {
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
  },
];

// Hàm chính để thực hiện việc "gieo mầm"
async function main() {
  console.log('Bắt đầu quá trình gieo mầm...');

  // Gieo mầm cho bảng User (tạo một người dùng mẫu)
  console.log('Đang tạo người dùng mẫu...');
  const user = await prisma.user.upsert({
    where: { email: 'admin@baihat-hopam.vn' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@baihat-hopam.vn',
      password_hash: 'supersecretpassword', // Mật khẩu giả để test
    },
  });
  console.log(`Đã tạo/cập nhật người dùng mẫu: ${user.username}`);

  // Gieo mầm cho bảng Genre
  console.log('Đang gieo mầm thể loại...');
  for (const genre of genresToSeed) {
    await prisma.genre.create({ data: genre });
  }
  console.log('Đã gieo mầm xong thể loại.');

  // Gieo mầm cho bảng Composer
  console.log('Đang gieo mầm tác giả...');
  for (const composer of composersToSeed) {
    await prisma.composer.create({ data: composer });
  }
  console.log('Đã gieo mầm xong tác giả.');

  // Gieo mầm cho bảng Song
  console.log('Đang gieo mầm bài hát...');
  const tcs = await prisma.composer.findUnique({
    where: { slug: 'trinh-cong-son' },
  });

  if (tcs && user) {
    for (const song of songsToSeed) {
      await prisma.song.create({
        data: {
          ...song,
          composer_id: tcs.id,
          author_id: user.id, // Sử dụng ID của user vừa tạo
        },
      });
      console.log(`Đã tạo bài hát: ${song.title}`);
    }
  } else {
    console.log('Bỏ qua gieo mầm bài hát vì không tìm thấy tác giả hoặc người dùng.');
  }

  console.log('Quá trình gieo mầm đã hoàn tất!');
}

// Chạy hàm chính và xử lý kết quả
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });