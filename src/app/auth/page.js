// src/app/auth/page.js
import AuthForm from "@/components/AuthForm";
import { registerUser, loginUser } from './actions';

export default function AuthPage() {
  const pageStyles = {
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    paddingTop: '5vh', minHeight: '80vh', width: '100%',
  };
  return (
    <div style={pageStyles}>
      <AuthForm 
        registerUserAction={registerUser} 
        loginUserAction={loginUser} 
      />
    </div>
  );
}