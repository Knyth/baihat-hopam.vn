// src/app/layout.js
// import './globals.css';
// import Header from '@/components/layout/Header';

// export const metadata = {
//   title: 'baihat-hopam.vn',
//   description: 'Thư viện Hợp âm & Sheet nhạc Việt Nam',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="vi">
//       <body>
//         <Header />
//         {/* NÂNG CẤP: Loại bỏ className="container" khỏi <main> */}
//         {/* Giờ đây thẻ <main> chỉ là một cái bọc đơn giản */}
//         <main>
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }

// src/app/layout.js
import './globals.css';
import Header from '@/components/layout/Header';
// (MỚI) Import component Footer
import Footer from '@/components/layout/Footer'; 

export const metadata = {
  title: 'baihat-hopam.vn',
  description: 'Thư viện Hợp âm & Sheet nhạc Việt Nam',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        {/* (MỚI) Thêm style flexGrow: 1 để đẩy Footer xuống dưới */}
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>

        {/* (MỚI) Thêm component Footer vào cuối trang */}
        <Footer />
      </body>
    </html>
  );
}