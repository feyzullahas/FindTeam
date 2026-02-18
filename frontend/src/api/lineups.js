import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://findteam.onrender.com';

// Lineup endpoints
export const lineupAPI = {
  // Tüm kadroları getir
  getLineups: async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/lineups/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Belirli bir kadroyu getir
  getLineup: async (id) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/lineups/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Yeni kadro oluştur
  createLineup: async (lineupData) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${API_URL}/lineups/`, lineupData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Kadro güncelle
  updateLineup: async (id, lineupData) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.put(`${API_URL}/lineups/${id}`, lineupData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Kadro sil
  deleteLineup: async (id) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.delete(`${API_URL}/lineups/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
