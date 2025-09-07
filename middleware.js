// /middleware.js (root)
import { NextResponse } from "next/server";
// ⚠️ Nếu alias '@' đang trỏ đến 'src' (thường đúng theo jsconfig),
// dùng "@/lib/auth". Nếu dự án của bạn chưa set alias, đổi thành "./src/lib/auth".
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isProtected = nextUrl.pathname.startsWith("/my-songs");

  if (isProtected && !req.auth) {
    const url = new URL("/auth", nextUrl);
    url.searchParams.set("next", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/my-songs"],
};
