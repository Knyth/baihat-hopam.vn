// src/app/auth/actions.js
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Hàm trợ giúp để lấy userId từ token, đảm bảo an toàn
async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id;
  } catch (error) {
    return null;
  }
}

// === HÀM ĐĂNG KÝ ===
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

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { success: false, error: 'Email này đã được sử dụng.' };
      }
      return { success: false, error: 'Tên đăng nhập này đã tồn tại.' };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: { username, email, password_hash: hashedPassword },
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return { success: false, error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' };
  }

  redirect('/auth?message=Đăng ký thành công! Vui lòng đăng nhập.');
}

// === HÀM ĐĂNG NHẬP (TINH CHỈNH LẦN CUỐI) ===
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
    
    // TINH CHỈNH CUỐI CÙNG: Luôn trả về success để client xử lý điều hướng
    return { success: true };

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return { success: false, error: 'Đã có lỗi xảy ra trong quá trình đăng nhập.' };
  }
}


// === HÀM ĐỔI MẬT KHẨU ===
export async function changePassword(formData) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return { success: false, error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
    }

    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin." };
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự." };
    }
    if (newPassword !== confirmPassword) {
      return { success: false, error: "Mật khẩu mới và xác nhận mật khẩu không khớp." };
    }
    if (newPassword === currentPassword) {
      return { success: false, error: "Mật khẩu mới không được trùng với mật khẩu cũ." };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: "Không tìm thấy người dùng." };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: "Mật khẩu hiện tại không đúng." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedNewPassword },
    });

    return { success: true, message: "Đổi mật khẩu thành công!" };

  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Đã xảy ra lỗi không mong muốn." };
  }
}