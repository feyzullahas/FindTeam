import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Trophy, MapPin } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  // Eğer kullanıcı giriş yapmamışsa, sadece giriş ekranı göster
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Halı Saha <span className="text-blue-600">Takım Arkadaşı</span> Bul
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Türkiye'nin en büyük halı saha topluluğuna katıl!
            </p>
          </div>

          <button
            onClick={() => window.location.href = 'http://localhost:8000/auth/google/login'}
            className="btn btn-primary text-lg px-8 py-4 w-full flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google ile Giriş Yap
          </button>

          <div className="text-center">
            <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ücretsiz
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Hızlı
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Güvenli
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmışsa, tam özellikli ana sayfa
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Hoş Geldin, {user.name}! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Halı sahta takım arkadaşı bulmak için doğru yerdesin!
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex justify-center mb-4">
            <Users className="text-blue-600" size={48} />
          </div>
          <h3 className="text-xl font-semibold mb-2">İlan Ver</h3>
          <p className="text-gray-600 mb-4">
            Takım arkadaşları arıyorsun? Hemen ilan ver!
          </p>
          <button className="btn btn-primary">
            İlan Ver
          </button>
        </div>

        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex justify-center mb-4">
            <Search className="text-blue-600" size={48} />
          </div>
          <h3 className="text-xl font-semibold mb-2">İlanları Keşfet</h3>
          <p className="text-gray-600 mb-4">
            Takım mı arıyorsun? İlanları incele!
          </p>
          <button className="btn btn-secondary">
            İlanları Ara
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Platformumuzda Neler Var?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">1000+</div>
            <p>Aktif Kullanıcı</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <p>Günlük İlan</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">81</div>
            <p>Şehir</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
