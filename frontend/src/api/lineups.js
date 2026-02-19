import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://findteam.onrender.com';

// Lineup endpoints
export const lineupAPI = {
  // Tüm kadroları getir
  getLineups: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }
      
      console.log('🔗 API Request: GET /lineups/');
      const response = await axios.get(`${API_URL}/lineups/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📩 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getLineups error:', error.response || error);
      throw error;
    }
  },

  // Belirli bir kadroyu getir
  getLineup: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }
      
      console.log(`🔗 API Request: GET /lineups/${id}`);
      const response = await axios.get(`${API_URL}/lineups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📩 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getLineup error:', error.response || error);
      throw error;
    }
  },

  // Yeni kadro oluştur
  createLineup: async (lineupData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }
      
      console.log('🔗 API Request: POST /lineups/');
      console.log('📤 Request Data:', lineupData);
      
      const response = await axios.post(`${API_URL}/lineups/`, lineupData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📩 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ createLineup error:', error.response?.data || error);
      throw error;
    }
  },

  // Kadro güncelle
  updateLineup: async (id, lineupData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }
      
      console.log(`🔗 API Request: PUT /lineups/${id}`);
      console.log('📤 Request Data:', lineupData);
      
      const response = await axios.put(`${API_URL}/lineups/${id}`, lineupData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📩 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateLineup error:', error.response?.data || error);
      throw error;
    }
  },

  // Kadro sil
  deleteLineup: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token bulunamadı. Lütfen giriş yapın.');
      }
      
      console.log(`🔗 API Request: DELETE /lineups/${id}`);
      const response = await axios.delete(`${API_URL}/lineups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📩 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteLineup error:', error.response?.data || error);
      throw error;
    }
  }
};
