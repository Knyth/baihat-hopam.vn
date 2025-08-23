// src/components/SongListSkeleton.js

// Component này mô phỏng giao diện của một mục trong danh sách bài hát
const SkeletonItem = () => (
  <li style={{ borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0.5rem' }}>
    <div style={{ height: '20px', width: '60%', backgroundColor: '#e9ecef', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
    <div style={{ height: '16px', width: '30%', backgroundColor: '#e9ecef', borderRadius: '4px' }}></div>
  </li>
);

// Component chính, hiển thị nhiều mục skeleton
export default function SongListSkeleton() {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </ul>
  );
}