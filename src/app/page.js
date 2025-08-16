// Import hàm "gọi hàng" mà chúng ta vừa tạo
import { getAllGenres } from '@/lib/api';

// Trang chủ bây giờ là một "Server Component"
// Nó có thể chạy code bất đồng bộ (async) trực tiếp
export default async function HomePage() {
  // 1. Ở phía Server: Gọi API để lấy dữ liệu trước khi trang được render
  const genres = await getAllGenres();

  // 2. Ở phía Client: Dùng dữ liệu đã lấy được để render ra HTML
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Chào mừng đến với baihat-hopam.vn!
      </h1>

      {/* Khu vực "Khám phá theo Thể loại" */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Khám phá theo Thể loại</h2>

        {/* Kiểm tra xem có dữ liệu không */}
        {genres.length > 0 ? (
          // Nếu có, hiển thị danh sách
          <div className="flex flex-wrap gap-4">
            {genres.map((genre) => (
              <a
                key={genre.id}
                href={`/songs/genre/${genre.slug}`}
                className="genre-button"
              >
                {genre.name}
              </a>
            ))}
          </div>
        ) : (
          // Nếu không có (API lỗi), hiển thị thông báo
          <p>Không thể tải được danh sách thể loại vào lúc này.</p>
        )}
      </section>

      {/* (Trong tương lai, chúng ta sẽ thêm khu vực "Tác giả nổi bật" ở đây) */}
    </main>
  );
}