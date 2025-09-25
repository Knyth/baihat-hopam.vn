// src/app/auth/page.js

export const dynamic = "force-dynamic";
export const revalidate = 0;

import AuthForm from "@/components/AuthForm";
import { registerUser, loginUser } from "./actions";

const errorMessages = {
  CredentialsSignin: "Email hoặc mật khẩu không đúng.",
  Default: "Đã có lỗi xảy ra. Vui lòng thử lại.",
};

export default async function AuthPage({ searchParams }) {
  // ⬇️ Next 15: BẮT BUỘC await
  const sp = await searchParams;
  const errorKey = sp?.error;
  const message = errorMessages[errorKey] || "";
  const isError = Boolean(errorKey);
  const callbackUrl = sp?.callbackUrl || "/";

  const pageStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "5vh",
    minHeight: "80vh",
    width: "100%",
  };

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
