// src/app/contact/page.js
import StaticPageLayout from "@/components/layout/StaticPageLayout";

export const metadata = {
  title: "Liên hệ & Góp ý | baihat-hopam.vn",
  description:
    "Chúng tôi luôn lắng nghe ý kiến của bạn. Hãy liên hệ để góp ý, báo lỗi hoặc yêu cầu bài hát mới.",
};

export default function ContactPage() {
  return (
    <StaticPageLayout title="Liên hệ & Góp ý">
      <p>
        Sự phát triển của <strong>baihat-hopam.vn</strong> không thể thiếu những ý kiến đóng góp quý
        báu từ cộng đồng. Chúng tôi luôn trân trọng và lắng nghe mọi phản hồi, dù là nhỏ nhất.
      </p>
      <p>
        Nếu bạn có bất kỳ câu hỏi, góp ý, phát hiện lỗi sai trong hợp âm, hoặc muốn yêu cầu một bài
        hát mới chưa có trên trang, xin đừng ngần ngại liên hệ với chúng tôi qua địa chỉ email dưới
        đây.
      </p>

      <h2>Địa chỉ Email</h2>
      <p>Để liên hệ, vui lòng gửi email trực tiếp đến địa chỉ:</p>
      {/* NÂNG CẤP 2: Làm cho khối email nổi bật hơn */}
      <p
        style={{
          backgroundColor: "#e7f5ff",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid #99d9ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        {/* Icon lá thư */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ width: "24px", height: "24px", color: "var(--primary-color)" }}
        >
          <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
          <path d="M19 8.839 10.772 13.1a2.75 2.75 0 0 1-2.544 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
        </svg>
        <a
          href="mailto:contact@baihat-hopam.vn"
          style={{
            fontWeight: "700",
            fontSize: "1.2rem",
            color: "var(--primary-color)",
          }}
        >
          contact@baihat-hopam.vn
        </a>
      </p>
      <p>
        Đội ngũ phát triển sẽ cố gắng phản hồi bạn trong thời gian sớm nhất có thể. Cảm ơn bạn đã
        chung tay xây dựng một cộng đồng âm nhạc ngày càng lớn mạnh!
      </p>
    </StaticPageLayout>
  );
}
