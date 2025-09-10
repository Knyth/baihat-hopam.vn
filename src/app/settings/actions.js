// src/app/settings/actions.js
'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

function result(ok, message) {
  return { ok, message };
}

/** Cập nhật tên hiển thị */
export async function updateProfile(prevState, formData) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) return result(false, 'Bạn cần đăng nhập.');

    const displayName = (formData.get('displayName') || '').toString().trim();
    if (!displayName || displayName.length < 2 || displayName.length > 50) {
      return result(false, 'Tên hiển thị phải từ 2–50 ký tự.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: displayName },
    });

    revalidatePath('/settings');
    return result(true, 'Đã lưu thay đổi.');
  } catch (e) {
    console.error('[updateProfile]', e);
    return result(false, 'Không thể lưu thay đổi. Vui lòng thử lại.');
  }
}

/** Đổi mật khẩu */
export async function changePassword(prevState, formData) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) return result(false, 'Bạn cần đăng nhập.');

    const current = (formData.get('current') || '').toString();
    const next = (formData.get('next') || '').toString();
    const confirm = (formData.get('confirm') || '').toString();

    if (!current || !next || !confirm) {
      return result(false, 'Vui lòng nhập đủ các trường.');
    }
    if (next.length < 6) {
      return result(false, 'Mật khẩu mới tối thiểu 6 ký tự.');
    }
    if (next !== confirm) {
      return result(false, 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return result(false, 'Không tìm thấy người dùng.');

    // Tự dò tên cột hash phổ biến
    const hashField =
      ('passwordHash' in dbUser && 'passwordHash') ||
      ('password_hash' in dbUser && 'password_hash') ||
      ('hashedPassword' in dbUser && 'hashedPassword') ||
      ('password' in dbUser && 'password') ||
      null;

    if (!hashField || !dbUser[hashField]) {
      return result(false, 'Tài khoản chưa hỗ trợ đổi mật khẩu.');
    }

    const ok = await bcrypt.compare(current, dbUser[hashField]);
    if (!ok) return result(false, 'Mật khẩu hiện tại không đúng.');

    const newHash = await bcrypt.hash(next, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { [hashField]: newHash },
    });

    return result(true, 'Đổi mật khẩu thành công!');
  } catch (e) {
    console.error('[changePassword]', e);
    return result(false, 'Không thể đổi mật khẩu. Vui lòng thử lại.');
  }
}
