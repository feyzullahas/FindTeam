import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("access_token");
      
      if (savedUser && token) {
        try {
          // Token'ın hala geçerli olup olmadığını kontrol et
          const isValid = await authAPI.verifyToken();
          
          if (isValid) {
            // Token geçerli, kullanıcıyı ayarla
            setUser(JSON.parse(savedUser));
          } else {
            // Token geçersiz, localStorage'ı temizle
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
          }
        } catch (error) {
          // Hata durumunda localStorage'ı temizle
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/google/login`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: updateUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
