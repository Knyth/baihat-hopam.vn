// src/app/auth/actions.js
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function registerUser(formData) { /* ... giữ nguyên code ... */ }

export async function loginUser(formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return { success: false, error: 'Vui lòng điền đầy đủ thông tin.' };
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    cookies().set('session', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24
    });

    return { success: true };
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return { success: false, error: 'Đã có lỗi xảy ra trong quá trình đăng nhập.' };
  }
}