// src/app/auth/page.js

// --- THÊM DÒNG NÀY ĐỂ XỬ LÝ TRIỆT ĐỂ CẢNH BÁO ---
export const dynamic = 'force-dynamic';

import AuthForm from "@/components/AuthForm";
import { registerUser, loginUser } from './actions';
import { Suspense } from 'react';

const errorMessages = {
  'CredentialsSignin': 'Email hoặc mật khẩu không đúng.',
  'Default': 'Đã có lỗi xảy ra. Vui lòng thử lại.'
};

function AuthFormWrapper({ searchParams }) {
  const pageStyles = {
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    paddingTop: '5vh', minHeight: '80vh', width: '100%',
  };

  const errorKey = searchParams.error;
  const message = errorMessages[errorKey] || '';
  const isError = !!errorKey;
  const callbackUrl = searchParams.callbackUrl || '/'; 
  
  return (
    <div style={pageStyles}>
      <AuthForm 
        registerUserAction={registerUser} 
        loginUserAction={loginUser}
        initialMessage={message}
        isError={isError}
        callbackUrl={callbackUrl}
      />
    </div>
  );
}

export default function AuthPage({ searchParams }) {
  return (
    // Sử dụng Suspense là một best practice rất tốt!
    <Suspense fallback={<div>Loading...</div>}>
      <AuthFormWrapper searchParams={searchParams} />
    </Suspense>
  );
}