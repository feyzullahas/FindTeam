import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import { POSITIONS, CITIES, POST_TYPES } from '../utils/helpers';
import { Plus, Send } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const postType = watch('post_type');

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      // Backend'in beklediği formata dönüştür
      const postData = {
        title: data.title,
        description: data.description,
        city: data.city,
        post_type: data.post_type,
        positions_needed: data.positions_needed || [],
        match_time: data.match_time || null,
        contact_info: {
          phone: data.contact_phone,
          email: data.contact_email || ''
        }
      };

      console.log('📤 Sending post data:', postData);

      await postsAPI.createPost(postData);
      setMessage('İlan başarıyla oluşturuldu!');
      setTimeout(() => navigate('/posts'), 2000);
    } catch (error) {
      console.error('❌ Create post error:', error);
      setMessage(error.message || 'İlan oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Yeni İlan Ver</h1>

      <div className="card">
        {message && (
          <div className={`p-3 rounded-md mb-4 ${message.includes('başarıyla') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="form-label">İlan Türü</label>
            <select className="form-input" {...register('post_type', { required: true })}>
              <option value="">İlan türünü seçin</option>
              {POST_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.post_type && <span className="text-red-500 text-sm">Bu alan zorunludur</span>}
          </div>

          <div>
            <label className="form-label">Başlık</label>
            <input
              type="text"
              className="form-input"
              {...register('title', { required: true })}
              placeholder={postType === 'team' ? 'Takım arkadaşları arıyoruz' : 'Takım arıyorum'}
            />
            {errors.title && <span className="text-red-500 text-sm">Bu alan zorunludur</span>}
          </div>

          <div>
            <label className="form-label">Açıklama</label>
            <textarea
              className="form-input"
              rows="4"
              {...register('description')}
              placeholder="Detaylı bilgi verin..."
            />
          </div>

          <div>
            <label className="form-label">Şehir</label>
            <select className="form-input" {...register('city', { required: true })}>
              <option value="">Şehir seçin</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <span className="text-red-500 text-sm">Bu alan zorunludur</span>}
          </div>

          {postType === 'player' && (
            <div>
              <label className="form-label">Aradığınız Pozisyonlar</label>
              <div className="grid grid-cols-2 gap-3">
                {POSITIONS.map(position => (
                  <label key={position} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={position}
                      {...register('positions_needed')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{position}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Maç Saati</label>
            <input
              type="text"
              className="form-input"
              {...register('match_time')}
              placeholder="Örn: 18:00-20:00 veya 19:00"
            />
            <p className="text-sm text-gray-500 mt-1">Maçın hangi saatlerde oynanacağını belirtin</p>
          </div>

          <div>
            <label className="form-label">İletişim Telefonu</label>
            <input
              type="tel"
              className="form-input"
              {...register('contact_phone', { required: true })}
              placeholder="05XX XXX XX XX"
            />
            {errors.contact_phone && <span className="text-red-500 text-sm">Bu alan zorunludur</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {loading ? 'Gönderiliyor...' : 'İlanı Yayınla'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
