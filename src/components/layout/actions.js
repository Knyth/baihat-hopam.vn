// src/components/layout/actions.js
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  // Xóa cookie session
  cookies().set('session', '', { expires: new Date(0) });
  // Chuyển hướng về trang chủ
  redirect('/');
}