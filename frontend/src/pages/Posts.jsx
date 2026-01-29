import React, { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts';
import { POST_TYPES, CITIES, POSITIONS, formatDate, formatPhoneNumber } from '../utils/helpers';
import { Search, Filter, Phone, MapPin, Users, Calendar } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    post_type: '',
    position: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getPosts(filters);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', post_type: '', position: '' });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">İlanlar</h1>
      
      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-xl font-semibold">Filtreler</h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Şehir</label>
            <select 
              className="form-input"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">Tüm Şehirler</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">İlan Türü</label>
            <select 
              className="form-input"
              value={filters.post_type}
              onChange={(e) => handleFilterChange('post_type', e.target.value)}
            >
              <option value="">Tüm Türler</option>
              {POST_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Pozisyon</label>
            <select 
              className="form-input"
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
            >
              <option value="">Tüm Pozisyonlar</option>
              {POSITIONS.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn btn-secondary w-full"
            >
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-xl">Yükleniyor...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-xl text-gray-600">
              {filters.city || filters.post_type || filters.position 
                ? 'Kriterlere uygun ilan bulunamadı.' 
                : 'Henüz ilan bulunmuyor.'}
            </div>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.post_type === 'team' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {post.post_type === 'team' ? 'Takım Arıyor' : 'Oyuncu Arıyor'}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {post.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              {post.description && (
                <p className="text-gray-700 mb-4">{post.description}</p>
              )}

              {post.positions_needed && post.positions_needed.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} />
                    <span className="font-medium">Pozisyonlar:</span>
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

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {post.user_name && `İlan veren: ${post.user_name}`}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-green-600" />
                  <span className="font-medium text-green-600">
                    {post.contact_info?.phone ? formatPhoneNumber(post.contact_info.phone) : 'Telefon belirtilmemiş'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
