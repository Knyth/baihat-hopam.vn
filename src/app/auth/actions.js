// src/app/auth/actions.js
"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation"; // <<< IMPORT REDIRECT

// Register Action không thay đổi
export async function registerUser(formData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) return { error: "Vui lòng điền đầy đủ thông tin." };
    if (password.length < 6) return { error: "Mật khẩu phải có ít nhất 6 ký tự." };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Email này đã được sử dụng." };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password_hash: hashedPassword },
    });

    return { success: "Đăng ký thành công! Vui lòng đăng nhập." };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." };
  }
}

// === HÀM ĐĂNG NHẬP ĐƯỢC THIẾT KẾ LẠI HOÀN TOÀN ===
export async function loginUser(formData) {
  try {
    // signIn sẽ tự động redirect nếu thành công, hoặc ném lỗi nếu thất bại
    await signIn("credentials", formData);
  } catch (error) {
    // Bắt lỗi cụ thể của NextAuth
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // THAY ĐỔI QUAN TRỌNG: Tự redirect về trang auth với thông báo lỗi
          return redirect("/auth?error=CredentialsSignin");
        default:
          return redirect("/auth?error=Default");
      }
    }
    // Rất quan trọng: Phải ném lại lỗi để Next.js xử lý các lỗi redirect thành công
    throw error;
  }
}

// Logout không thay đổi
export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
