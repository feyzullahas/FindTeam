import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { authAPI } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.login(loginData);
      window.location.href = '/posts'; // Reload to update auth context
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.password_confirm) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(registerData);
      window.location.href = '/posts'; // Reload to update auth context
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eğer kullanıcı giriş yapmamışsa, giriş/kayıt ekranı göster
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{background:'linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #065f46 100%)'}}>
        <motion.div
          className="max-w-sm w-full space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Halı Saha <span className="text-emerald-400">Takım Arkadaşı</span> Bul
            </motion.h1>
            <motion.p
              className="text-sm text-slate-300 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Maç Başlasın: Aradığın Oyuncu Bir Tık Uzakta.
            </motion.p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <motion.form
              onSubmit={handleLogin}
              className="space-y-3 bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Şifre
                </label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-transparent text-slate-400">veya</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/google/login`}
                className="w-full flex items-center justify-center gap-2.5 bg-white text-slate-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors border border-white/30"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            </motion.form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <motion.form
              onSubmit={handleRegister}
              className="space-y-3 bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Şifre
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="En az 6 karakter"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerData.password_confirm}
                  onChange={(e) => setRegisterData({ ...registerData, password_confirm: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Şifrenizi tekrar girin"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </button>
            </motion.form>
          )}

          <motion.div
            className="grid grid-cols-3 gap-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['Ücretsiz', 'Hızlı', 'Güvenli'].map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium">{feature}</span>
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
