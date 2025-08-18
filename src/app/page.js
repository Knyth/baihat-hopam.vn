// Import hàm "gọi hàng" mà chúng ta vừa tạo
import { getAllGenres, getAllComposers } from '@/lib/api';

// Trang chủ bây giờ là một "Server Component"
export default async function HomePage() {
  // 1. Ở phía Server: Gọi API để lấy dữ liệu trước khi trang được render
  const genres = await getAllGenres();
  const composers = await getAllComposers();

  // 2. Ở phía Client: Dùng dữ liệu đã lấy được để render ra HTML
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Chào mừng đến với baihat-hopam.vn!
      </h1>

      {/* Khu vực "Khám phá theo Thể loại" */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Khám phá theo Thể loại</h2>

        {genres.length > 0 ? (
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
          <p>Không thể tải được danh sách thể loại vào lúc này.</p>
        )}
      </section>

      {/* Khu vực "Tác giả Nổi bật" */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tác giả Nổi bật</h2>

        {composers.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {composers.map((composer) => (
              <a
                key={composer.id}
                href={`/songs/composer/${composer.slug}`}
                className="text-gray-800 hover:text-blue-600 transition-colors"
              >
                {composer.name}
              </a>
            ))}
          </div>
        ) : (
          <p>Không thể tải được danh sách tác giả vào lúc này.</p>
        )}
      </section>
      
    </main>
  );
}