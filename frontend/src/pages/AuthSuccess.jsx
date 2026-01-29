import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get("user");

      console.log("URL params:", params.toString());
      console.log("User param:", userParam);

      if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log("Parsed user:", user);

        // Kullanıcı bilgisini context'e kaydet
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture || null,
          is_verified: user.is_verified
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log("User saved to context:", userData);
        
        // 2 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } else {
        setError("Kullanıcı bilgisi bulunamadı");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error("AuthSuccess error:", err);
      setError("Kullanıcı bilgisi işlenirken hata oluştu: " + err.message);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş İşleniyor...</h2>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Ana sayfaya yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Google ile Giriş Başarılı!</h2>
        <p className="text-gray-600">Ana sayfaya yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}

export default AuthSuccess;