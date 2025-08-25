// src/app/auth/actions.js
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function registerUser(formData) {
  try {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!username || !email || !password) {
      return { success: false, error: 'Vui lòng điền đầy đủ thông tin.' };
    }
    if (password.length < 6) {
        return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Email này đã được sử dụng.' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, email, password_hash: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return { success: false, error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' };
  }
}

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