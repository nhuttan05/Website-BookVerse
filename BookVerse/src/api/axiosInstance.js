// =====================================================
//  API LAYER — Axios Instance với JWT Interceptors
//  Đây là cơ chế bảo mật quan trọng nhất trong frontend
// =====================================================

import axios from 'axios';

// Base URL của Spring Boot Backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Tạo một Axios instance riêng biệt — KHÔNG dùng axios mặc định
// Lý do: Cô lập cấu hình, tránh ảnh hưởng các request bên ngoài hệ thống
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 giây timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// =====================================================
//  REQUEST INTERCEPTOR — Gắn JWT Token vào mọi request
// =====================================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc cookie trong môi trường production)
    const token = localStorage.getItem('bookverse_access_token');

    if (token) {
      // Gắn token theo chuẩn Bearer — Spring Boot Security sẽ đọc header này
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Lỗi ở phía request (network error trước khi gửi)
    return Promise.reject(error);
  }
);

// =====================================================
//  RESPONSE INTERCEPTOR — Xử lý lỗi tập trung
// =====================================================
axiosInstance.interceptors.response.use(
  (response) => {
    // Chỉ trả về phần data để component không cần `.data.data`
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Case 1: Token hết hạn (401 Unauthorized)
    // Thực hiện Refresh Token một lần, nếu vẫn lỗi thì logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu để tránh vòng lặp vô hạn

      try {
        const refreshToken = localStorage.getItem('bookverse_refresh_token');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Lưu token mới vào storage
        localStorage.setItem('bookverse_access_token', data.accessToken);
        localStorage.setItem('bookverse_refresh_token', data.refreshToken);

        // Gắn token mới và gửi lại request bị lỗi
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token cũng hết hạn → Buộc người dùng đăng nhập lại
        localStorage.removeItem('bookverse_access_token');
        localStorage.removeItem('bookverse_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Case 2: Không có quyền truy cập (403 Forbidden)
    if (error.response?.status === 403) {
      console.error('[BookVerse API] Access Forbidden - Bạn không có quyền truy cập tài nguyên này.');
    }

    // Case 3: Server lỗi (500)
    if (error.response?.status >= 500) {
      console.error('[BookVerse API] Server Error - Vui lòng thử lại sau.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
