import React, { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts';
import { POST_TYPES, CITIES, POSITIONS, formatDate, formatPhoneNumber } from '../utils/helpers';
import { Filter, Phone, MapPin, Users, Calendar, Clock, RefreshCw } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ city: '', post_type: '', position: '' });

  useEffect(() => { fetchPosts(); }, [filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getPosts(filters);
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || 'İlanlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) =>
    setFilters(prev => ({ ...prev, [field]: value }));

  const clearFilters = () =>
    setFilters({ city: '', post_type: '', position: '' });

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">İlanlar</h1>
        <p className="text-sm text-slate-400 mt-1">
          {loading ? 'Yükleniyor…' : `${posts.length} ilan bulundu`}
        </p>
      </div>

      {/* Filter card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Filter size={16} className="text-emerald-400" />
            Filtrele
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Temizle
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="form-label">Şehir</label>
            <select className="form-input" value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}>
              <option value="">Tüm şehirler</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">İlan türü</label>
            <select className="form-input" value={filters.post_type}
              onChange={(e) => handleFilterChange('post_type', e.target.value)}>
              <option value="">Tüm türler</option>
              {POST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {filters.post_type === 'player' && (
            <div>
              <label className="form-label">Pozisyon</label>
              <select className="form-input" value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}>
                <option value="">Tüm pozisyonlar</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* States */}
      {error && (
        <div className="card mb-6" style={{background:'rgba(239,68,68,0.15)',borderColor:'rgba(239,68,68,0.3)'}}>
          <p className="text-red-300 text-sm mb-3">{error}</p>
          <button onClick={fetchPosts} className="btn btn-sm btn-danger flex items-center gap-1.5">
            <RefreshCw size={14} /> Tekrar dene
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400">
            İlk yüklemede backend uyandırılıyor olabilir…
          </span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm">
            {hasFilters ? 'Kriterlere uygun ilan bulunamadı.' : 'Henüz ilan bulunmuyor.'}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="btn btn-sm btn-outline mt-4">
              Filtreleri temizle
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="card card-hover animate-fade-up">
              {/* Title row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-white leading-snug">
                  {post.title}
                </h3>
                <span className={`badge shrink-0 ${
                  post.post_type === 'team' ? 'badge-primary' : 'badge-warning'
                }`}>
                  {post.post_type === 'team' ? 'Takım Arıyor' : 'Oyuncu Arıyor'}
                </span>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-200 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-emerald-400" />{post.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-emerald-400" />{formatDate(post.created_at)}
                </span>
                {post.match_time && (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Clock size={13} />{post.match_time}
                  </span>
                )}
                {post.venue && (
                  <span className="flex items-center gap-1 text-sky-400 font-medium">
                    <MapPin size={13} />{post.venue}
                  </span>
                )}
              </div>

              {post.description && (
                <p className="text-sm text-white mb-3 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              )}

              {post.positions_needed?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Users size={13} />
                  </span>
                  {post.positions_needed.map((pos, i) => (
                    <span key={i} className="badge badge-neutral">{pos}</span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-slate-400">
                  {post.user_name && `İlan: ${post.user_name}`}
                </span>
                {post.contact_info?.phone ? (
                  <a
                    href={`tel:${post.contact_info.phone}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Phone size={15} />
                    {formatPhoneNumber(post.contact_info.phone)}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Phone size={13} />Telefon yok
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
