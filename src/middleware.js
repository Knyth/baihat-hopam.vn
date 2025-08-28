// src/middleware.js
import { NextResponse } from 'next/server';

// Middleware sẽ chạy cho MỌI request trước khi nó đến trang
export function middleware(request) {
  // 1. Lấy URL người dùng đang muốn truy cập
  const { pathname } = request.nextUrl;

  // 2. Lấy cookie 'session' từ request
  const sessionCookie = request.cookies.get('session');

  // 3. Logic bảo vệ cho các trang cá nhân
  if (pathname.startsWith('/my-songs')) {
    // Nếu không có cookie session, chuyển hướng đến trang đăng nhập
    if (!sessionCookie) {
      // Ghi nhớ lại trang họ muốn vào để đưa họ trở lại sau khi đăng nhập
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Logic cho trang đăng nhập/đăng ký
  if (pathname.startsWith('/auth')) {
    // Nếu người dùng ĐÃ có cookie session (đã đăng nhập),
    // chuyển hướng họ về trang chủ để tránh họ đăng nhập lại lần nữa
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Nếu không rơi vào các trường hợp trên, cho phép request đi tiếp
  return NextResponse.next();
}

// Cấu hình matcher để middleware CHỈ chạy trên các đường dẫn cần thiết
// Điều này giúp tối ưu hóa hiệu suất
export const config = {
  matcher: [
    /*
     * Khớp với tất cả các đường dẫn, NGOẠI TRỪ những đường dẫn bắt đầu bằng:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}