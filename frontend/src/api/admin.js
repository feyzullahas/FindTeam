const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Admin JWT'si localStorage'da 'admin_token' key'inde saklanır (normal kullanıcı token'ından ayrı)
const getAdminToken = () => localStorage.getItem('admin_token');
const adminHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAdminToken()}`,
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const adminLogin = async (email, password) => {
  const res = await fetch(`${API_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Giriş başarısız');
  }
  const data = await res.json();
  localStorage.setItem('admin_token', data.access_token);
  localStorage.setItem('admin_user', JSON.stringify(data.user));
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getAdminUser = () => {
  try { return JSON.parse(localStorage.getItem('admin_user') || 'null'); }
  catch { return null; }
};

export const isAdminLoggedIn = () => !!getAdminToken();

// ── Stats ─────────────────────────────────────────────────────────────────────

// Admin API endpoints (legacy object interface retained for backwards compat)
export const adminAPI = {
  // İstatistikler
  getStats: async () => {
    const res = await fetch(`${API_URL}/admin/stats`, { headers: adminHeaders() });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'İstatistikler alınamadı'); }
    return res.json();
  },

  // Tüm kullanıcıları getir
  getAllUsers: async () => {
    const res = await fetch(`${API_URL}/admin/users`, { headers: adminHeaders() });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Kullanıcılar alınamadı'); }
    return res.json();
  },

  // Kullanıcı sil
  deleteUser: async (userId) => {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE', headers: adminHeaders() });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Kullanıcı silinemedi'); }
    return res.json();
  },

  // Tüm ilanları getir
  getAllPosts: async () => {
    const res = await fetch(`${API_URL}/admin/posts`, { headers: adminHeaders() });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'İlanlar alınamadı'); }
    return res.json();
  },

  // İlan sil
  deletePost: async (postId) => {
    const res = await fetch(`${API_URL}/admin/posts/${postId}`, { method: 'DELETE', headers: adminHeaders() });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'İlan silinemedi'); }
    return res.json();
  },
};
