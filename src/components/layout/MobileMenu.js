// src/components/layout/MobileMenu.js
// Server wrapper – lấy session & role, truyền cho client

import { auth } from "@/lib/auth";
import MobileMenuClient from "./MobileMenuClient";

export default async function MobileMenu() {
  const session = await auth();
  const user = session?.user || null;
  const canUpload = user?.role === "contributor" || user?.role === "admin";
  return <MobileMenuClient user={user} canUpload={canUpload} />;
}
