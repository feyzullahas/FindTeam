import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://findteam.onrender.com";

// Axios interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

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

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

      const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

      const response = await axios.get(`${API_BASE_URL}/users/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }
};
