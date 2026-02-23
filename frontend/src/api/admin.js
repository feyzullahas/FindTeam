const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// Admin JWT'si localStorage'da 'admin_token' key'inde saklanır (normal kullanıcı token'ından ayrı)
const getAdminToken = () => localStorage.getItem('admin_token');
const adminHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAdminToken()}`,
});

// Render uyku hatasını yakala
const handleFetchError = (err, fallback) => {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    throw new Error('Sunucu yanıt vermiyor. Backend uyandırılıyor olabilir, lütfen 30 saniye bekleyip tekrar deneyin.');
  }
  throw err;
};

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
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: adminHeaders() });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'İstatistikler alınamadı'); }
      return res.json();
    } catch (err) { handleFetchError(err); }
  },

  // Tüm kullanıcıları getir
  getAllUsers: async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers: adminHeaders() });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Kullanıcılar alınamadı'); }
      return res.json();
    } catch (err) { handleFetchError(err); }
  },

  // Kullanıcı sil
  deleteUser: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE', headers: adminHeaders() });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Kullanıcı silinemedi'); }
      return res.json();
    } catch (err) { handleFetchError(err); }
  },

  // Tüm ilanları getir
  getAllPosts: async () => {
    try {
      const res = await fetch(`${API_URL}/admin/posts`, { headers: adminHeaders() });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'İlanlar alınamadı'); }
      return res.json();
    } catch (err) { handleFetchError(err); }
  },

  // İlan sil
  deletePost: async (postId) => {
    try {
      const res = await fetch(`${API_URL}/admin/posts/${postId}`, { method: 'DELETE', headers: adminHeaders() });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'İlan silinemedi'); }
      return res.json();
    } catch (err) { handleFetchError(err); }
  },
};
