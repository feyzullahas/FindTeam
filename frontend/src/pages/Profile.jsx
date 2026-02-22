import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/users';
import { POSITIONS, CITIES } from '../utils/helpers';
import { Save, User, MapPin, Phone, Calendar, Edit2, X, Users } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        age: user.age || '',
        positions: user.positions || []
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      // Checkbox değerlerini doğru şekilde al - array olarak dönüştür
      const formData = {
        ...data,
        positions: Array.isArray(data.positions) ? data.positions : []
      };

      console.log('Form data being sent:', formData);

      const updatedUser = await usersAPI.updateProfile(formData);

      // Context'in setUser fonksiyonunu kullan (otomatik localStorage'a yazar)
      setUser(updatedUser);

      setMessage('Profil başarıyla güncellendi!');
      console.log('Profile updated successfully:', updatedUser);

      // Başarılı güncelleme sonrası düzenleme modunu kapat
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error.message || 'Profil güncellenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Profilim</h1>
          <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-outline'} flex items-center gap-1.5`}
        >
          {isEditing ? <X size={14} /> : <Edit2 size={14} />}
          {isEditing ? 'İptal' : 'Düzenle'}
        </button>
      </div>

      {/* Info card */}
      <div className="card mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <User className="text-emerald-600" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user.name || user.email}</h2>
            {user.name && <p className="text-sm text-slate-200">{user.email}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-white rounded-xl px-4 py-3" style={{background:'rgba(255,255,255,0.08)'}}>
            <MapPin size={15} className="text-emerald-400 shrink-0" />
            <span>{user.city || 'Şehir belirtilmemiş'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white rounded-xl px-4 py-3" style={{background:'rgba(255,255,255,0.08)'}}>
            <Phone size={15} className="text-emerald-400 shrink-0" />
            <span>{user.phone || 'Telefon belirtilmemiş'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white rounded-xl px-4 py-3" style={{background:'rgba(255,255,255,0.08)'}}>
            <Calendar size={15} className="text-emerald-400 shrink-0" />
            <span>{user.age ? `${user.age} yaşında` : 'Yaş belirtilmemiş'}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-white rounded-xl px-4 py-3" style={{background:'rgba(255,255,255,0.08)'}}>
            <Users size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">
              {user.positions?.length ? user.positions.join(', ') : 'Pozisyon belirtilmemiş'}
            </span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-5">Bilgileri Düzenle</h2>

          {message && (
            <div className={`p-3 rounded-xl text-sm mb-4 ${
              message.includes('başarıyla')
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-300 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="form-label">Ad Soyad</label>
              <input
                type="text"
                className="form-input"
                {...register('name')}
                placeholder="Adınızı soyadınızı girin"
              />
            </div>

            <div>
              <label className="form-label">Telefon Numarası</label>
              <input
                type="tel"
                className="form-input"
                {...register('phone')}
                placeholder="05XX XXX XX XX"
              />
            </div>

            <div>
              <label className="form-label">Şehir</label>
              <select className="form-input" {...register('city')}>
                <option value="">Şehir seçin</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Yaş</label>
              <input
                type="number"
                className="form-input"
                {...register('age', { valueAsNumber: true })}
                placeholder="Yaşınızı girin"
                min="16"
                max="60"
              />
            </div>

            <div>
              <label className="form-label">Oynayabileceğiniz Pozisyonlar</label>
                          <div className="grid grid-cols-2 gap-2">
                {POSITIONS.map(position => (
                  <label key={position}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      value={position}
                      {...register('positions')}
                      className="w-4 h-4 rounded border-white/30 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-white">{position}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
