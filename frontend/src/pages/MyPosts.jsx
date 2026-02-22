import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import { formatDate, formatPhoneNumber } from '../utils/helpers';
import { Trash2, Edit2, Calendar, MapPin, Users, Phone, Clock, Eye } from 'lucide-react';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const myPosts = await postsAPI.getMyPosts();
      setPosts(myPosts || []);
      setError('');
    } catch (err) {
      console.error('İlanlar yüklenirken hata:', err);
      setError(err.message || 'İlanlarınız yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      setDeleteLoading(postId);
      await postsAPI.deletePost(postId);

      // Silinen ilanı listeden kaldır
      setPosts(posts.filter(post => post.id !== postId));
      setError('');
    } catch (err) {
      console.error('İlan silinirken hata:', err);
      setError(err.message || 'İlan silinirken hata oluştu');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getPostTypeLabel = (postType) =>
    postType === 'team' ? 'Takım Arıyor' : 'Oyuncu Arıyor';

  const getPostTypeColor = (postType) =>
    postType === 'team' ? 'badge-primary' : 'badge-warning';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400">İlanlarınız yükleniyor…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">İlanlarım</h1>
          <p className="text-sm text-slate-400 mt-0.5">Toplam {posts.length} ilan</p>
        </div>
      </div>

      {error && (
        <div className="card mb-6" style={{background:'rgba(239,68,68,0.15)',borderColor:'rgba(239,68,68,0.3)'}}>
          <p className="text-sm text-red-300 mb-3">{error}</p>
          <button onClick={fetchMyPosts} className="btn btn-sm btn-danger">Tekrar Dene</button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm mb-4">Henüz hiç ilan oluşturmadınız.</p>
          <a href="/create-post" className="btn btn-primary btn-sm">Yeni İlan Ver</a>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  {/* Title + badge */}
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-base font-semibold text-white leading-snug">{post.title}</h3>
                    <span className={`badge shrink-0 ${getPostTypeColor(post.post_type)}`}>
                      {getPostTypeLabel(post.post_type)}
                    </span>
                  </div>

                  {post.description && (
                    <p className="text-sm text-white mb-3 line-clamp-2">{post.description}</p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-200 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />{post.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />{formatDate(post.created_at)}
                    </span>
                    {post.match_time && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Clock size={12} />{post.match_time}
                      </span>
                    )}
                    {post.contact_info?.phone && (
                      <a href={`tel:${post.contact_info.phone}`}
                        className="flex items-center gap-1 text-emerald-400 hover:underline font-medium">
                        <Phone size={12} />{formatPhoneNumber(post.contact_info.phone)}
                      </a>
                    )}
                    <span className={`badge ${
                      post.status === 'active' ? 'badge-success' : 'badge-neutral'
                    }`}>
                      {post.status === 'active' ? 'Aktif' : post.status}
                    </span>
                  </div>

                  {post.positions_needed?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.positions_needed.map((pos, i) => (
                        <span key={i} className="badge badge-neutral">{pos}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                    className="btn btn-sm btn-outline flex items-center gap-1.5"
                  >
                    <Edit2 size={13} />Düzenle
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deleteLoading === post.id}
                    className="btn btn-sm btn-danger flex items-center gap-1.5"
                  >
                    {deleteLoading === post.id
                      ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      : <Trash2 size={13} />}
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
