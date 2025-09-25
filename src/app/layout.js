// src/app/layout.js

import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";

// --- KHÔNG GỌI AUTH() Ở ĐÂY NỮA ---

export const metadata = {
  title: "baihat-hopam.vn",
  description: "Thư viện Hợp âm & Sheet nhạc Việt Nam",
};

export default function RootLayout({ children }) {
  // --- BIẾN 'session' ĐÃ BỊ LOẠI BỎ ---

  return (
    <html lang="vi">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Component Providers không cần session nữa, nó sẽ tự lấy từ context */}
        <Providers>
          <Header />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
