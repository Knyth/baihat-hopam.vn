// src/app/my-songs/page.js

import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Hàm lấy dữ liệu cho Server Component này
async function getFavoriteSongs() {
  const cookieStore = cookies(); // Lấy cookies
  // Chúng ta cần gửi cookie 'session' đi cùng với request
  const sessionCookie = cookieStore.get('session');

  // Nếu không có cookie, không cần gọi API làm gì
  if (!sessionCookie) {
    return null;
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
    headers: {
      // Gửi cookie đi để API có thể xác thực
      'Cookie': `session=${sessionCookie.value}`
    },
    cache: 'no-store', // Luôn lấy dữ liệu mới nhất
  });

  if (!res.ok) {
    // Nếu API trả về lỗi (ví dụ 401 Unauthorized), trả về null
    console.error("Failed to fetch favorites:", res.statusText);
    return null;
  }

  const data = await res.json();
  return data.data;
}


export default async function MySongsPage() {
  const songs = await getFavoriteSongs();

  // === CƠ CHẾ BẢO VỆ ===
  // Nếu getFavoriteSongs trả về null (do không có cookie hoặc lỗi xác thực)
  // thì chuyển hướng người dùng về trang đăng nhập
  if (songs === null) {
    redirect('/auth');
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className='text-4xl font-bold'>Bài hát của tôi</h1>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          Tổng cộng: {songs.length} bài hát. Đây là không gian riêng để bạn lưu lại những giai điệu tâm đắc nhất.
        </p>
      </div>

      {songs.length > 0 ? (
        <div>
          {songs.map(song => (
            <div key={song.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <Link href={`/songs/${song.slug}`} style={{ textDecoration: 'none' }}>
                <h2 className='text-2xl font-bold text-primary hover:underline'>{song.title}</h2>
              </Link>
              {song.composer && <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{song.composer.name}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--border-color)', borderRadius: '12px' }}>
          <h3 className='text-2xl font-bold'>Danh sách của bạn chưa có gì cả!</h3>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Hãy bắt đầu khám phá và nhấn vào biểu tượng ❤️ tại bất kỳ bài hát nào bạn thích để lưu lại đây nhé.
          </p>
          <Link href="/songs" className='button-primary' style={{ marginTop: '2rem', display: 'inline-block' }}>
            Khám phá bài hát ngay
          </Link>
        </div>
      )}
    </div>
  );
}