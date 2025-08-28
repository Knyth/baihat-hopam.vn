// src/app/auth/page.js
import AuthForm from "@/components/AuthForm";
import { registerUser, loginUser } from './actions';
import { Suspense } from 'react';

// Tách component con để sử dụng hook `useSearchParams`
function AuthFormWrapper({ searchParams }) {
  const pageStyles = {
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    paddingTop: '5vh', minHeight: '80vh', width: '100%',
  };

  const message = searchParams.message || '';
  // NÂNG CẤP: Lấy callbackUrl từ URL, mặc định là trang chủ
  const callbackUrl = searchParams.callbackUrl || '/'; 
  
  return (
    <div style={pageStyles}>
      <AuthForm 
        registerUserAction={registerUser} 
        loginUserAction={loginUser}
        initialMessage={message}
        callbackUrl={callbackUrl} // NÂNG CẤP: Truyền callbackUrl xuống Form
      />
    </div>
  );
}

// Trang chính giờ đây sẽ bọc component con trong Suspense
export default function AuthPage({ searchParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthFormWrapper searchParams={searchParams} />
    </Suspense>
  );
}