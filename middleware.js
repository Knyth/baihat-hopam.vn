// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { cookies } = request;
  const token = cookies.get('session')?.value;
  const response = NextResponse.next();

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      response.headers.set('x-user-payload', JSON.stringify(payload));
    } catch (error) {
      console.log("Token không hợp lệ, đang xóa...");
      response.cookies.delete('session');
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}