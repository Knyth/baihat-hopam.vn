// src/app/api/auth/me/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Chỉ trả về những thông tin an toàn
    const user = { id: payload.id, username: payload.username };
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}