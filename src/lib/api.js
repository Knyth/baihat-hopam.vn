// File này sẽ chứa tất cả các hàm để gọi đến API backend của chúng ta

// Xác định địa chỉ gốc của API.
// Khi ở môi trường phát triển (development), nó sẽ là http://localhost:3000
// Khi triển khai lên Vercel, nó sẽ tự động lấy tên miền của website
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Hàm để lấy danh sách tất cả các thể loại nhạc từ backend
 * @returns {Promise<Array>} Một mảng chứa các đối tượng genre
 */
export async function getAllGenres() {
  try {
    // Dùng fetch để gửi một yêu cầu GET đến "đường ống" /api/genres
    const response = await fetch(`${API_BASE_URL}/api/genres`);

    // Nếu phản hồi không thành công (ví dụ: lỗi 404, 500), ném ra một lỗi
    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu thể loại từ API');
    }

    // Chuyển đổi phản hồi từ dạng text sang dạng JSON
    const data = await response.json();

    // Trả về dữ liệu đã được xử lý
    return data;
  } catch (error) {
    // In lỗi ra console để gỡ lỗi
    console.error('Lỗi API (getAllGenres):', error);
    // Trả về một mảng rỗng để tránh làm sập trang web nếu API lỗi
    return [];
  }
}

/**
 * Hàm để lấy danh sách tất cả các tác giả từ backend
 * @returns {Promise<Array>} Một mảng chứa các đối tượng composer
 */
export async function getAllComposers() {
  try {
    // Dùng fetch để gửi một yêu cầu GET đến "đường ống" /api/composers
    const response = await fetch(`${API_BASE_URL}/api/composers`);

    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu tác giả từ API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi API (getAllComposers):', error);
    return [];
  }
}