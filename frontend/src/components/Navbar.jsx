import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, User, LogOut, PlusCircle, FileText, Home, Users, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/posts',       label: 'İlanlar',   icon: Home       },
    { path: '/my-posts',    label: 'İlanlarım', icon: FileText   },
    { path: '/create-post', label: 'İlan Ver',  icon: PlusCircle },
    { path: '/kadro',       label: 'Kadro',     icon: Users      },
    { path: '/profile',     label: 'Profil',    icon: User       },
    ...(user?.is_admin ? [{ path: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      isDark
        ? 'bg-slate-900/80 border-white/10'
        : 'bg-white/90 border-emerald-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/posts" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/40">
            <img src="/logo.png" alt="FindTeam" className="w-full h-full object-cover" />
          </div>
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>FindTeam</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Club logo */}
          <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden mr-2"
               title="Yazılım Geliştirme Kulübü">
            <img src="/software-club-logo.png" alt="Kulüp" className="w-full h-full object-contain" style={{imageRendering:'crisp-edges'}} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(path)
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : isDark
                      ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ml-1 ${
                isDark ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut size={16} strokeWidth={2} />
              Çıkış
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Açık tema' : 'Koyu tema'}
              className={`ml-1 p-2 rounded-lg transition-all duration-150 ${
                isDark ? 'text-slate-300 hover:bg-white/10 hover:text-yellow-300' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
            </button>
          </div>

          {/* Mobile: club logo + hamburger */}
          <div className="md:hidden w-9 h-9 rounded-full overflow-hidden mr-1">
            <img src="/software-club-logo.png" alt="Kulüp" className="w-full h-full object-contain" style={{imageRendering:'crisp-edges'}} />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-emerald-50'
            }`}
            aria-label="Menüyü aç"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`md:hidden backdrop-blur-md border-b px-4 pb-4 pt-2 space-y-1 ${
              isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-emerald-100'
            }`}
          >
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : isDark
                      ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-colors ${
                isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
              }`}
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-colors ${
                isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-emerald-50'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? 'Açık Tema' : 'Koyu Tema'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

