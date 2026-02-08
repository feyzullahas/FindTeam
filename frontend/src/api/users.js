import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://findteam.onrender.com";

// Create axios instance with timeout
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Handle timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new Error('Sunucu yanıt vermiyor. Backend uyandırılıyor olabilir, lütfen 30 saniye bekleyip tekrar deneyin.'));
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/';
      return Promise.reject(new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.'));
    }

    if (error.response?.status === 400) {
      const message = error.response.data?.detail || 'Geçersiz istek.';
      return Promise.reject(new Error(message));
    }

    if (error.response?.status === 500) {
      return Promise.reject(new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.'));
    }

    // Network error
    if (!error.response) {
      return Promise.reject(new Error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.'));
    }

    return Promise.reject(error);
  }
);

export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor.');
      }

      const response = await axiosInstance.get('/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor.');
      }

      const response = await axiosInstance.put('/users/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Search users
  searchUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.position) params.append('position', filters.position);

      const response = await axiosInstance.get(`/users/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }
};
