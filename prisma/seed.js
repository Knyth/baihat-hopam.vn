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

// Hàm chính để thực hiện việc "gieo mầm"
async function main() {
  console.log('Bắt đầu quá trình gieo mầm...');

  // Gieo mầm cho bảng Genre
  for (const genre of genresToSeed) {
    // prisma.genre.create là lệnh để tạo một bản ghi mới trong bảng Genre
    await prisma.genre.create({
      data: genre,
    });
    console.log(`Đã tạo thể loại: ${genre.name}`);
  }

  // Gieo mầm cho bảng Composer
  for (const composer of composersToSeed) {
    // prisma.composer.create là lệnh để tạo một bản ghi mới trong bảng Composer
    await prisma.composer.create({
      data: composer,
    });
    console.log(`Đã tạo tác giả: ${composer.name}`);
  }

  console.log('Quá trình gieo mầm đã hoàn tất!');
}

// Chạy hàm chính và xử lý kết quả
main()
  .catch((e) => {
    // Bắt lỗi nếu có
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Luôn ngắt kết nối với database sau khi hoàn thành
    await prisma.$disconnect();
  });