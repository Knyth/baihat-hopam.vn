// src/components/AuthForm.js
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import styles from './AuthForm.module.css';

export default function AuthForm({ registerUserAction, loginUserAction, initialMessage, callbackUrl }) {
  const [activeTab, setActiveTab] = useState('register');
  const [message, setMessage] = useState(initialMessage || '');
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialMessage.includes('thành công')) {
      setActiveTab('login');
      setIsError(false);
    }
  }, [initialMessage]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await registerUserAction(formData);

      if (result && result.error) {
        setIsError(true);
        setMessage(result.error);
      }
      // Khi thành công, Server Action sẽ tự redirect
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await loginUserAction(formData);
      
      if (result && result.success) {
        // GIẢI PHÁP TỐI THƯỢỢNG: Dùng hard navigation đến đúng callbackUrl
        window.location.href = callbackUrl; 
      } else if (result && result.error) {
        setIsError(true);
        setMessage(result.error);
      }
    });
  };
  
  return (
    <div className={styles.authCard}>
      <div className={styles.tabContainer}>
        <button className={`${styles.tabButton} ${activeTab === 'register' ? styles.active : ''}`} onClick={() => { setActiveTab('register'); setMessage(''); }}>
          Đăng ký
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'login' ? styles.active : ''}`} onClick={() => { setActiveTab('login'); setMessage(''); }}>
          Đăng nhập
        </button>
      </div>
      <div className={styles.formContainer}>
        {message && (
          <p className={`${styles.message} ${isError ? styles.error : styles.success}`}>
            {message}
          </p>
        )}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div className={styles.inputGroup}><label htmlFor="register-username">Tên hiển thị</label><input type="text" id="register-username" name="username" required disabled={isPending} /></div>
            <div className={styles.inputGroup}><label htmlFor="register-email">Email</label><input type="email" id="register-email" name="email" required disabled={isPending} /></div>
            <div className={styles.inputGroup}><label htmlFor="register-password">Mật khẩu</label><input type="password" id="register-password" name="password" required disabled={isPending} /></div>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending && activeTab === 'register' ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </form>
        )}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className={styles.inputGroup}><label htmlFor="login-email">Email</label><input type="email" id="login-email" name="email" required disabled={isPending} /></div>
            <div className={styles.inputGroup}><label htmlFor="login-password">Mật khẩu</label><input type="password" id="login-password" name="password" required disabled={isPending} /></div>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending && activeTab === 'login' ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>
          </form>
        )}
      </div>
    </div>
  );
}