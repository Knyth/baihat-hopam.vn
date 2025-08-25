// src/components/layout/Header.js

import Link from 'next/link';
import { cookies } from 'next/headers'; // <-- NHẬP KHẨU CÔNG CỤ ĐỌC COOKIE
import { jwtVerify } from 'jose'; // <-- NHẬP KHẨU CÔNG CỤ XÁC THỰC
import styles from './Header.module.css';
import UserMenu from './UserMenu';

// Lấy secret key từ biến môi trường
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Biến Header thành một Async Component để có thể thực hiện xác thực
export default async function Header() {
  let user = null;

  // === LOGIC XÁC THỰC TRỰC TIẾP TẠI ĐÂY ===
  try {
    // 1. Đọc cookie 'session' trực tiếp
    const token = cookies().get('session')?.value;

    if (token) {
      // 2. Giải mã token. Nếu thành công, 'payload' chính là thông tin người dùng
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    }
  } catch (error) {
    // Nếu có lỗi (token hết hạn, không hợp lệ), user vẫn là null
    // Không cần làm gì cả, hệ thống sẽ tự động hiển thị trạng thái chưa đăng nhập
    console.log("Token không hợp lệ hoặc đã hết hạn.");
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <div className={styles.logo}>
          <Link href="/">baihat-hopam.vn</Link>
        </div>
        
        <nav className={styles.navigation}>
          {user ? (
            // Nếu có user, hiển thị UserMenu
            <UserMenu user={user} />
          ) : (
            // Nếu không, hiển thị nút Đăng nhập/Đăng ký
            <>
              <Link href="/auth" className={styles.navLink}>Đăng nhập</Link>
              <Link href="/auth" className={`${styles.navLink} ${styles.signUp}`}>Đăng ký</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}