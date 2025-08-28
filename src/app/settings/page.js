// src/app/settings/page.js
"use client";

import React, { useState, useEffect, useTransition } from 'react'; // Thêm React vào import
import { useRouter } from 'next/navigation';
// (MỚI) Import Server Action
import { changePassword } from '../auth/actions';

// Component Skeleton cho form
function SettingsSkeleton() {
  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#e9ecef', height: '20px', width: '100px', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
        <div style={{ backgroundColor: '#e9ecef', height: '40px', width: '100%', borderRadius: '4px' }}></div>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#e9ecef', height: '20px', width: '100px', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
        <div style={{ backgroundColor: '#e9ecef', height: '40px', width: '100%', borderRadius: '4px' }}></div>
      </div>
      <div style={{ backgroundColor: '#e9ecef', height: '45px', width: '120px', borderRadius: '4px', marginTop: '1rem' }}></div>
    </div>
  );
}

// (NÂNG CẤP) Component Form Đổi mật khẩu giờ đây sẽ chứa toàn bộ logic của nó
function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const formRef = React.useRef(null); // Dùng để reset form

  const styles = {
    inputGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontWeight: '600', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await changePassword(formData);

      if (result && result.success) {
        setMessage(result.message);
        setIsError(false);
        formRef.current?.reset(); // Reset các ô input sau khi thành công
      } else if (result && result.error) {
        setMessage(result.error);
        setIsError(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} style={{ maxWidth: '600px' }}>
      {message && (
        <p style={{ 
          padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', 
          backgroundColor: isError ? '#f8d7da' : '#d4edda', 
          color: isError ? '#721c24' : '#155724'
        }}>
          {message}
        </p>
      )}
      <div style={styles.inputGroup}>
        <label htmlFor="current-password" style={styles.label}>Mật khẩu hiện tại</label>
        <input type="password" id="current-password" name="currentPassword" required style={styles.input} disabled={isPending} />
      </div>
      <div style={styles.inputGroup}>
        <label htmlFor="new-password" style={styles.label}>Mật khẩu mới</label>
        <input type="password" id="new-password" name="newPassword" required style={styles.input} disabled={isPending} />
      </div>
      <div style={styles.inputGroup}>
        <label htmlFor="confirm-password" style={styles.label}>Xác nhận mật khẩu mới</label>
        <input type="password" id="confirm-password" name="confirmPassword" required style={styles.input} disabled={isPending} />
      </div>
      <button type="submit" className="button-primary" disabled={isPending}>
        {isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.status === 401) {
          router.push('/auth?callbackUrl=/settings');
          return;
        }
        if (!res.ok) { throw new Error('Không thể tải thông tin người dùng.'); }
        const data = await res.json();
        setUser(data);
        setUsername(data.username);
      } catch (err) {
        setMessage(err.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    startTransition(async () => {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username }),
        });
        const result = await res.json();
        if (!res.ok) { throw new Error(result.error || 'Đã xảy ra lỗi.'); }
        setMessage(result.message);
        setIsError(false);
      } catch (err) {
        setMessage(err.message);
        setIsError(true);
      }
    });
  };

  const styles = {
    layout: { display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' },
    sidebar: { flex: '0 0 200px', borderRight: '1px solid var(--border-color)', paddingRight: '2rem' },
    content: { flex: '1 1 auto', paddingTop: '0.5rem' },
    menuItem: { padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginBottom: '0.5rem', transition: 'background-color 0.2s' },
    activeMenuItem: { backgroundColor: '#e9ecef', color: 'var(--text-main)' },
    inputGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontWeight: '600', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' },
  };

  const renderContent = () => {
    if (isLoading) { return <SettingsSkeleton />; }
    if (!user) { return <p style={{ color: '#dc3545' }}>{message || 'Không thể tải dữ liệu người dùng.'}</p>; }

    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmitProfile} style={{ maxWidth: '600px' }}>
            {message && (
              <p style={{ 
                padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', 
                backgroundColor: isError ? '#f8d7da' : '#d4edda', 
                color: isError ? '#721c24' : '#155724'
              }}>
                {message}
              </p>
            )}
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>Tên hiển thị</label>
              <input 
                type="text" id="username" name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input} 
                disabled={isPending}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input type="email" id="email" name="email" value={user.email} style={styles.input} disabled readOnly />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Email không thể thay đổi.
              </p>
            </div>
            <button type="submit" className="button-primary" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        );
      case 'password':
        return <ChangePasswordForm />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className='text-4xl font-bold'>Cài đặt Tài khoản</h1>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.
        </p>
      </div>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div 
            style={{ ...styles.menuItem, ...(activeTab === 'profile' ? styles.activeMenuItem : {}) }}
            onClick={() => { setActiveTab('profile'); setMessage(''); }}
          >
            Thông tin cá nhân
          </div>
          <div 
            style={{ ...styles.menuItem, ...(activeTab === 'password' ? styles.activeMenuItem : {}) }}
            onClick={() => { setActiveTab('password'); setMessage(''); }}
          >
            Đổi mật khẩu
          </div>
        </aside>
        <main style={styles.content}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}