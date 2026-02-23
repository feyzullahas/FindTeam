import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, adminLogout, getAdminUser, isAdminLoggedIn } from '../api/admin';
import { Users, FileText, Trash2, AlertCircle, BarChart3, RefreshCw, LogOut, Shield } from 'lucide-react';

// ── Confirmation Modal ────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl max-w-md w-full p-6">
      <div className="flex items-start gap-3 mb-6">
        <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={24} />
        <p className="text-white">{message}</p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          İptal
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
        >
          Evet, Sil
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // Confirmation modal state
  const [modal, setModal] = useState(null); // { message, onConfirm }

  // Redirect to admin login if not authenticated
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 5000); };

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      if (err.message?.includes('403') || err.message?.includes('401')) {
        adminLogout();
        navigate('/admin/login');
        return;
      }
      showError('İstatistikler yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      showError('Kullanıcılar yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.getAllPosts();
      setPosts(data);
    } catch (err) {
      showError('İlanlar yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    if (isAdminLoggedIn()) loadStats();
  }, [loadStats]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    if (tab === 'users' && users.length === 0) loadUsers();
    else if (tab === 'posts' && posts.length === 0) loadPosts();
  };

  const confirmDeleteUser = (userId, email) => {
    setModal({
      message: `"${email}" kullanıcısını ve tüm verilerini kalıcı olarak silmek istiyor musunuz? Bu işlem geri alınamaz.`,
      onConfirm: async () => {
        setModal(null);
        try {
          setLoading(true);
          await adminAPI.deleteUser(userId);
          showSuccess('Kullanıcı silindi.');
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          setStats((s) => s ? { ...s, total_users: s.total_users - 1 } : s);
        } catch (err) {
          showError('Kullanıcı silinemedi: ' + err.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const confirmDeletePost = (postId, title) => {
    setModal({
      message: `"${title}" ilanını kalıcı olarak silmek istiyor musunuz?`,
      onConfirm: async () => {
        setModal(null);
        try {
          setLoading(true);
          await adminAPI.deletePost(postId);
          showSuccess('İlan silindi.');
          setPosts((prev) => prev.filter((p) => p.id !== postId));
          setStats((s) => s ? { ...s, total_posts: s.total_posts - 1 } : s);
        } catch (err) {
          showError('İlan silinemedi: ' + err.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  if (!isAdminLoggedIn()) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {modal && (
        <ConfirmModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-400" size={28} />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Giriş: {adminUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <LogOut size={16} />
            Çıkış
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
            ✓ {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-700">
          {[
            { key: 'stats', label: 'İstatistikler', Icon: BarChart3 },
            { key: 'users', label: `Kullanıcılar${users.length ? ` (${users.length})` : ''}`, Icon: Users },
            { key: 'posts', label: `İlanlar${posts.length ? ` (${posts.length})` : ''}`, Icon: FileText },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === key
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Loading spinner (overlay) */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3" />
            <p className="text-gray-400 text-sm">Yükleniyor...</p>
          </div>
        )}

        {/* ── Stats Tab ──────────────────────────────────────────────── */}
        {activeTab === 'stats' && !loading && (
          <div>
            {stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { label: 'Toplam Kullanıcı', value: stats.total_users, Icon: Users, cardCls: 'bg-blue-500/10 border-blue-500/30', iconCls: 'text-blue-400' },
                  { label: 'Aktif Kullanıcı', value: stats.active_users, Icon: Users, cardCls: 'bg-green-500/10 border-green-500/30', iconCls: 'text-green-400' },
                  { label: 'Toplam İlan', value: stats.total_posts, Icon: FileText, cardCls: 'bg-purple-500/10 border-purple-500/30', iconCls: 'text-purple-400' },
                  { label: 'Toplam Kadro', value: stats.total_lineups, Icon: BarChart3, cardCls: 'bg-orange-500/10 border-orange-500/30', iconCls: 'text-orange-400' },
                ].map(({ label, value, cardCls, iconCls, Icon }) => (
                  <div
                    key={label}
                    className={`border rounded-xl p-6 ${cardCls}`}
                  >
                    <Icon className={`mb-3 ${iconCls}`} size={28} />
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold" style={{ color: '#ffffff' }}>{value ?? '—'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">İstatistikler yükleniyor...</p>
            )}
            <button
              onClick={loadStats}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
            >
              <RefreshCw size={16} />
              Yenile
            </button>
          </div>
        )}

        {/* ── Users Tab ──────────────────────────────────────────────── */}
        {activeTab === 'users' && !loading && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Kullanıcı Yönetimi</h2>
              <button
                onClick={loadUsers}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <RefreshCw size={16} />
                Yenile
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800">
                    <tr>
                      {['ID', 'Email', 'İsim', 'Şehir', 'Kayıt', 'Durum', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{u.id}</td>
                        <td className="px-4 py-3 font-medium">{u.email}</td>
                        <td className="px-4 py-3 text-gray-300">{u.name || '—'}</td>
                        <td className="px-4 py-3 text-gray-300">{u.city || '—'}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(u.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {u.is_admin && (
                              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-xs">Admin</span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs ${u.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                              {u.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => confirmDeleteUser(u.id, u.email)}
                            disabled={u.is_admin}
                            title={u.is_admin ? 'Admin silinemez' : 'Kullanıcıyı sil'}
                            className="text-red-400 hover:text-red-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <p className="text-center py-10 text-gray-500">Kullanıcı bulunamadı.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Posts Tab ──────────────────────────────────────────────── */}
        {activeTab === 'posts' && !loading && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">İlan Yönetimi</h2>
              <button
                onClick={loadPosts}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <RefreshCw size={16} />
                Yenile
              </button>
            </div>
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-gray-500 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>📍 {post.location || '—'}</span>
                        {post.match_time && (
                          <span>📅 {new Date(post.match_time).toLocaleString('tr-TR')}</span>
                        )}
                        <span>👤 Kullanıcı #{post.user_id}</span>
                        <span>🆔 İlan #{post.id}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => confirmDeletePost(post.id, post.title)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="İlanı sil"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-center py-16 text-gray-500">İlan bulunamadı.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
