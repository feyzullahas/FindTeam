import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://findteam.onrender.com";

export const authAPI = {
  // Google OAuth login
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  },

  // Logout
  logout: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return null;

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Handle OAuth callback
  handleOAuthCallback: async (code) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/google/callback`,
        {
          params: { code },
        }
      );

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error("OAuth callback error:", error);
      throw error;
    }
  },

  // Register with email/password
  register: async (userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(
        error.response?.data?.detail || "Kayıt başarısız oldu"
      );
    }
  },

  // Login with email/password
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.detail || "Giriş başarısız oldu"
      );
    }
  },
};
