import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const usersAPI = {
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('access_token');
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
