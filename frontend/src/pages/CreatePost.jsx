import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import { POSITIONS, CITIES, POST_TYPES } from '../utils/helpers';
import { Plus, Send, Edit2 } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [message, setMessage] = useState('');
  const isEditMode = !!postId;

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const postType = watch('post_type');

  // Load post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadPostData();
    }
  }, [postId]);

  const loadPostData = async () => {
    try {
      setLoadingPost(true);
      const post = await postsAPI.getPostById(postId);
      
      // Set form values
      setValue('title', post.title);
      setValue('description', post.description || '');
      setValue('city', post.city);
      setValue('post_type', post.post_type);
      setValue('positions_needed', post.positions_needed || []);
      setValue('match_time', post.match_time || '');
      setValue('venue', post.venue || '');
      setValue('location_link', post.location_link || '');
      setValue('contact_phone', post.contact_info?.phone || '');
      setValue('contact_email', post.contact_info?.email || '');
    } catch (error) {
      console.error('❌ Load post error:', error);
      setMessage(error.message || 'İlan yüklenirken hata oluştu.');
    } finally {
      setLoadingPost(false);
    }
  };

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
        venue: data.venue || null,
        location_link: data.location_link || null,
        contact_info: {
          phone: data.contact_phone,
          email: data.contact_email || ''
        }
      };

      console.log(`📤 ${isEditMode ? 'Updating' : 'Sending'} post data:`, postData);

      if (isEditMode) {
        await postsAPI.updatePost(postId, postData);
        setMessage('İlan başarıyla güncellendi!');
      } else {
        await postsAPI.createPost(postData);
        setMessage('İlan başarıyla oluşturuldu!');
      }
      
      setTimeout(() => navigate('/my-posts'), 2000);
    } catch (error) {
      console.error(`❌ ${isEditMode ? 'Update' : 'Create'} post error:`, error);
      setMessage(error.message || `İlan ${isEditMode ? 'güncellenirken' : 'oluşturulurken'} hata oluştu. Lütfen tekrar deneyin.`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400">İlan yükleniyor…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {isEditMode ? 'İlanı Düzenle' : 'Yeni İlan Ver'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {isEditMode ? 'İlan bilgilerini güncelleyin.' : 'Yeni bir ilan oluşturun.'}
        </p>
      </div>

      <div className="card">
        {message && (
          <div className={`p-3 rounded-xl text-sm mb-5 ${
            message.includes('başarıyla')
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/15 text-red-300 border border-red-500/30'
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
                            <div className="grid grid-cols-2 gap-2">
                {POSITIONS.map(position => (
                  <label key={position}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      value={position}
                      {...register('positions_needed')}
                      className="w-4 h-4 rounded border-white/30 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-white">{position}</span>
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
            <p className="form-helper">Maçın hangi saatlerde oynanacağını belirtin</p>
          </div>

          <div>
            <label className="form-label">Saha</label>
            <input
              type="text"
              className="form-input"
              {...register('venue')}
              placeholder="Örn: Atatürk Spor Kompleksi, Merkez Halı Saha"
            />
            <p className="form-helper">Maçın oynanacağı saha/yer</p>
          </div>

          <div>
            <label className="form-label">📍 Konum Linki <span className="text-slate-400 font-normal">(Opsiyonel)</span></label>
            <input
              type="url"
              className="form-input"
              {...register('location_link')}
              placeholder="https://maps.google.com/..."
            />
            <p className="form-helper">Google Haritalar'dan kopyaladığınız konum linkini yapıştırın</p>
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
            {isEditMode ? <Edit2 size={16} /> : <Send size={16} />}
            {loading ? (isEditMode ? 'Güncelleniyor...' : 'Gönderiliyor...') : (isEditMode ? 'İlanı Güncelle' : 'İlanı Yayınla')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
