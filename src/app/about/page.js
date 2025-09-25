// src/app/about/page.js

export const metadata = { title: "Giới thiệu | baihat-hopam.vn" };

export default function AboutPage() {
  return (
    <main className="container" style={{ maxWidth: 1140, margin: "0 auto", padding: "1.5rem" }}>
      <h1>Giới thiệu</h1>
      <p>
        Chúng tôi xây dựng thư viện hợp âm &amp; lời nhạc Việt để giúp mọi người chơi nhạc dễ dàng
        hơn.
      </p>
      <p>
        Nếu bạn có góp ý, xin gửi về hộp thư &ldquo;support@baihat-hopam.vn&rdquo; hoặc dùng mục
        Liên hệ.
      </p>
    </main>
  );
}
