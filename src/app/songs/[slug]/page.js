import SongDisplay from '@/components/SongDisplay';

async function getSongData(slug) {
  // ... (hàm này giữ nguyên, không cần kiểm tra lại)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE_URL}/api/songs/${slug}`);
  if (!res.ok) { return null; }
  return res.json();
}

export default async function SongDetailPage({ params }) {
  const { slug } = params;
  const songData = await getSongData(slug);

  if (!songData) {
    return <div>Không tìm thấy bài hát.</div>;
  }

  // Quan trọng: Nó chỉ return duy nhất component SongDisplay
  return (
      <SongDisplay songData={songData} />
  );
}