import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Search, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            FindTeam
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">
              Ana Sayfa
            </Link>
            <Link to="/posts" className="nav-link">
              İlanlar
            </Link>
            {user && (
              <>
                <Link to="/create-post" className="nav-link flex items-center gap-1">
                  <PlusCircle size={18} />
                  İlan Ver
                </Link>
                <Link to="/profile" className="nav-link flex items-center gap-1">
                  <User size={18} />
                  Profil
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Hoş geldin, {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Çıkış
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Google ile Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
