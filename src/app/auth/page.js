// src/app/auth/page.js

import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  // Dùng flexbox để căn giữa component AuthForm trên trang
  const pageStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Căn trên cùng để đẹp hơn
    paddingTop: '5vh', // Cách top 1 khoảng
    minHeight: '80vh',
    width: '100%',
  };

  return (
    <div style={pageStyles}>
      <AuthForm />
    </div>
  );
}