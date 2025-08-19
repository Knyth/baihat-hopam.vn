// Hàm này sẽ lấy dữ liệu từ API mà chúng ta vừa tạo
async function getSongData(slug) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE_URL}/api/songs/${slug}`);
  
  // Nếu không tìm thấy bài hát, API sẽ trả về lỗi 404
  if (!res.ok) {
    return null; // Trả về null để chúng ta có thể hiển thị trang "Not Found"
  }
  
  return res.json();
}

// Đây là trang chi tiết bài hát động
export default async function SongDetailPage({ params }) {
  const { slug } = params;
  const songData = await getSongData(slug);

  // Nếu không có dữ liệu bài hát, hiển thị thông báo
  if (!songData) {
    return <div>Không tìm thấy bài hát.</div>;
  }

  // Nếu có dữ liệu, hiển thị tên bài hát và tên tác giả
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{songData.title}</h1>
      <h2 className="text-2xl text-gray-600 mt-2">
        Sáng tác: {songData.composer.name}
      </h2>
      
      {/* (Trong tương lai, chúng ta sẽ hiển thị lời và hợp âm ở đây) */}
    </main>
  );
}