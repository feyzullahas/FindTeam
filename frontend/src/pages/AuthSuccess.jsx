import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../api/users";

function AuthSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get("user");
        const tokenParam = params.get("token");

        console.log(" Full URL:", window.location.href);
        console.log(" URL params:", params.toString());
        console.log(" User param:", userParam);
        console.log(" Token param:", tokenParam);
        console.log(" Token length:", tokenParam ? tokenParam.length : 0);

        if (userParam && tokenParam) {
          // JWT token'ı localStorage'a kaydet
          localStorage.setItem('access_token', tokenParam);
          console.log(" JWT token saved to localStorage");

          const user = JSON.parse(decodeURIComponent(userParam));
          console.log(" Parsed user from OAuth:", user);

          // Backend'den tam kullanıcı bilgilerini al
          console.log(" Fetching full user profile from backend...");
          const fullUserData = await usersAPI.getProfile();
          console.log(" Full user data from backend:", fullUserData);

          // Tam kullanıcı bilgisini context'e ve localStorage'a kaydet
          const userData = {
            id: fullUserData.id,
            email: fullUserData.email,
            name: fullUserData.name,
            phone: fullUserData.phone,
            city: fullUserData.city,
            age: fullUserData.age,
            positions: fullUserData.positions || [],
            picture: user.picture || null,
            is_verified: fullUserData.is_verified,
            created_at: fullUserData.created_at
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log(" Complete user data saved to context and localStorage");
          
        } else {
          console.error(" No user or token found in URL params");
          setError("Kullanıcı bilgisi bulunamadı");
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (err) {
        console.error(" AuthSuccess error:", err);
        setError("Kullanıcı bilgisi işlenirken hata oluştu: " + err.message);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
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