// src/components/AuthForm.js
"use client";

import React, { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react'; // <<< IMPORT signIn TỪ 'next-auth/react'
import { useRouter } from 'next/navigation'; // <<< IMPORT useRouter
import styles from './AuthForm.module.css';

export default function AuthForm({ 
  registerUserAction, 
  initialMessage, 
  isError, 
  callbackUrl 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(isError || initialMessage ? 'login' : 'register');
  const [message, setMessage] = useState(initialMessage || '');
  const [error, setError] = useState(isError);
  const [isPending, startTransition] = useTransition();

  // === HÀM ĐĂNG KÝ VẪN DÙNG SERVER ACTION ===
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await registerUserAction(formData);
      if (result?.success) {
        setMessage(result.success);
        setError(false);
        setActiveTab('login');
        // Xóa các trường trong form đăng ký sau khi thành công
        e.target.reset(); 
      } else if (result?.error) {
        setMessage(result.error);
        setError(true);
      }
    });
  };

  // === HÀM ĐĂNG NHẬP SỬ DỤNG signIn CỦA CLIENT ===
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email');
      const password = formData.get('password');

      const result = await signIn('credentials', {
        redirect: false, // Rất quan trọng: Ngăn signIn tự chuyển hướng
        email,
        password,
      });

      if (result.error) {
        // Nếu có lỗi, hiển thị thông báo
        setMessage('Email hoặc mật khẩu không đúng.');
        setError(true);
      } else {
        // Nếu thành công, tự chuyển hướng bằng router
        // Điều này sẽ đảm bảo trang được cập nhật đúng cách
        router.push(callbackUrl || '/');
        router.refresh(); // Thêm dòng này để đảm bảo server state được cập nhật
      }
    });
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.tabContainer}>
        <button className={`${styles.tabButton} ${activeTab === 'register' ? styles.active : ''}`} onClick={() => setActiveTab('register')}>Đăng ký</button>
        <button className={`${styles.tabButton} ${activeTab === 'login' ? styles.active : ''}`} onClick={() => setActiveTab('login')}>Đăng nhập</button>
      </div>
      <div className={styles.formContainer}>
        {message && (
          <p className={`${styles.message} ${error ? styles.error : styles.success}`}>{message}</p>
        )}
        
        <div style={{ display: activeTab === 'register' ? 'block' : 'none' }}>
          <form onSubmit={handleRegister} noValidate>
            <div className={styles.inputGroup}><label htmlFor="register-name">Tên hiển thị</label><input type="text" id="register-name" name="name" required disabled={isPending} /></div>
            <div className={styles.inputGroup}><label htmlFor="register-email">Email</label><input type="email" id="register-email" name="email" required disabled={isPending} /></div>
            <div className={styles.inputGroup}><label htmlFor="register-password">Mật khẩu</label><input type="password" id="register-password" name="password" required disabled={isPending} /></div>
            <button type="submit" className={styles.submitButton} disabled={isPending}>{isPending ? 'Đang xử lý...' : 'Tạo tài khoản'}</button>
          </form>
        </div>

        <div style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
           {/* Form đăng nhập giờ sử dụng onSubmit thay vì action */}
          <form onSubmit={handleLogin} noValidate>
            <div className={styles.inputGroup}><label htmlFor="login-email">Email</label><input type="email" id="login-email" name="email" required disabled={isPending}/></div>
            <div className={styles.inputGroup}><label htmlFor="login-password">Mật khẩu</label><input type="password" id="login-password" name="password" required disabled={isPending} /></div>
            <button type="submit" className={styles.submitButton} disabled={isPending}>{isPending ? 'Đang xử lý...' : 'Đăng nhập'}</button>
            <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>
          </form>
        </div>
      </div>
    </div>
  );
}