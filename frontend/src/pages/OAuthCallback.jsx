import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/auth';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          setError(`Google OAuth hatası: ${error}`);
          return;
        }
        
        if (!code) {
          setError('Authorization code bulunamadı');
          return;
        }

        // OAuth callback işlemini yap
        await authAPI.handleOAuthCallback(code);
        
        // Başarılı olursa ana sayfaya yönlendir
        navigate('/');
        
      } catch (err) {
        setError('Giriş yapılırken hata oluştu. Lütfen tekrar deneyin.');
        console.error('OAuth callback error:', err);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl">Google ile giriş yapılıyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ {error}</div>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
