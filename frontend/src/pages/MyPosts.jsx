import React, { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts';
import { formatDate, formatPhoneNumber } from '../utils/helpers';
import { Trash2, Edit2, Calendar, MapPin, Users, Phone, Clock, Eye } from 'lucide-react';

const MyPosts = () => {
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

  const getPostTypeLabel = (postType) => {
    return postType === 'team' ? 'Takım Arıyorum' : 'Oyuncu Arıyorum';
  };

  const getPostTypeColor = (postType) => {
    return postType === 'team' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-white drop-shadow">İlanlarınız yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">İlanlarım</h1>
        <div className="text-sm text-white/80 drop-shadow">
          Toplam {posts.length} ilanınız bulunuyor
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz ilanınız yok</h3>
          <p className="text-gray-600 mb-6">Hemen yeni bir ilan yayınlayarak futbolcularla tanışın!</p>
          <a
            href="/create-post"
            className="btn btn-primary"
          >
            Yeni İlan Ver
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header with title and badge */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getPostTypeColor(post.post_type)}`}>
                      {getPostTypeLabel(post.post_type)}
                    </span>
                  </div>

                  {/* Description */}
                  {post.description && (
                    <p className="text-gray-700 mb-4">{post.description}</p>
                  )}

                  {/* Details Grid */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{post.city}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    {post.match_time && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        <span>{post.match_time}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Eye size={16} className="text-slate-400" />
                      <span>{post.views_count || 0} görüntülenme</span>
                    </div>

                    {post.contact_info?.phone ? (
                      <a
                        href={`tel:${post.contact_info.phone}`}
                        className="flex items-center gap-1.5 text-green-600 hover:text-green-700 hover:underline transition-colors font-medium"
                        title="Aramak için tıklayın"
                      >
                        <Phone size={16} />
                        <span>{formatPhoneNumber(post.contact_info.phone)}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Phone size={16} />
                        <span>Telefon belirtilmemiş</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${post.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {post.status === 'active' ? 'Aktif' : post.status}
                      </span>
                    </div>
                  </div>

                  {/* Positions */}
                  {post.positions_needed && post.positions_needed.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={16} />
                        <span className="font-medium text-gray-700">İstenen Pozisyonlar:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.positions_needed.map((position, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                          >
                            {position}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deleteLoading === post.id}
                    className="btn btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50"
                    title="İlanı Sil"
                  >
                    {deleteLoading === post.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
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
