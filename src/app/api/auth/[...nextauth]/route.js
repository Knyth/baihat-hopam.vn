// src/app/api/auth/[...nextauth]/route.js

// File này chỉ làm một nhiệm vụ duy nhất:
// Lấy các phương thức GET và POST từ "nhà máy" auth.js và xuất ra
// để Next.js có thể tạo API endpoints cho việc đăng nhập, đăng xuất, etc.
// export { GET, POST } from "@/lib/auth";


// src/app/api/auth/[...nextauth]/route.js

// Import object 'handlers' từ nhà máy auth.js
import { handlers } from "@/lib/auth"; 

// Lấy ra GET và POST từ object handlers
export const { GET, POST } = handlers;