// src/components/Providers.js

// "use client";

// import { SessionProvider } from "next-auth/react";

// export default function Providers({ children, session }) {
//   return (
//     <SessionProvider session={session}>
//       {children}
//     </SessionProvider>
//   );
// }

// src/components/Providers.js
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

// Component này nhận session từ Server Component (layout.js)
// và cung cấp nó cho toàn bộ ứng dụng ở phía Client
export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </SessionProvider>
  );
}
