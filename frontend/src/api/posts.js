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

export const postsAPI = {
  // Get all posts with filters
  getPosts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.post_type) params.append('post_type', filters.post_type);
      if (filters.position) params.append('position', filters.position);
      if (filters.skip) params.append('skip', filters.skip);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(`${API_BASE_URL}/posts/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor.');
      }

      const response = await axios.post(`${API_BASE_URL}/posts/`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  // Get user's posts
  getMyPosts: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor.');
      }

      const response = await axios.get(`${API_BASE_URL}/posts/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get my posts error:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor.');
      }

      const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor.');
      }

      const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }
};
