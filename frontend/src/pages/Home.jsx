import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const Home = () => {
  const { user } = useAuth();

  // Eğer kullanıcı giriş yapmamışsa, sadece giriş ekranı göster
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4">
        <motion.div
          className="max-w-md w-full space-y-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.h1
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Halı Saha <span className="gradient-text">Takım Arkadaşı</span> Bul
            </motion.h1>
            <motion.p
              className="text-xl text-slate-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Türkiye'nin en büyük halı saha topluluğuna katıl!
            </motion.p>
          </div>

          <motion.button
            onClick={() => window.location.href = 'http://localhost:8000/auth/google/login'}
            className="btn btn-primary btn-lg w-full flex items-center justify-center gap-3 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#FFFFFF"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#FFFFFF"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FFFFFF"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#FFFFFF"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google ile Giriş Yap
          </motion.button>

          <motion.div
            className="grid grid-cols-3 gap-4 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['Ücretsiz', 'Hızlı', 'Güvenli'].map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-slate-600 font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Kullanıcı giriş yapmışsa, tam özellikli ana sayfa
  return (
    <div className="pt-24 space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Hoş Geldin, {user.name}! 👋
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Halı sahta takım arkadaşı bulmak için doğru yerdesin!
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
        <div className="card-hover text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">İlan Ver</h3>
          <p className="text-slate-600 mb-6">
            Takım arkadaşları arıyorsun? Hemen ilan ver!
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/create-post'}>
            İlan Ver
          </Button>
        </div>

        <div className="card-hover text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">İlanları Keşfet</h3>
          <p className="text-slate-600 mb-6">
            Takım mı arıyorsun? İlanları incele!
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/posts'}>
            İlanları Ara
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gradient-primary text-white rounded-2xl p-12 text-center mx-4 md:mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Platformumuzda Neler Var?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl font-bold mb-2">1000+</div>
            <p className="text-lg">Aktif Kullanıcı</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">500+</div>
            <p className="text-lg">Günlük İlan</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">81</div>
            <p className="text-lg">Şehir</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
