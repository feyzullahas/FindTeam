import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/users';
import { POSITIONS, CITIES } from '../utils/helpers';
import { Save, User, MapPin, Phone, Calendar, Edit2, X } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profilim</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary flex items-center gap-2"
        >
          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'İptal' : 'Profili Düzenle'}
        </button>
      </div>
      
      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 rounded-full p-3">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span>{user.city || 'Şehir belirtilmemiş'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} />
            <span>{user.phone || 'Telefon belirtilmemiş'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span>{user.age ? `${user.age} yaşında` : 'Yaş belirtilmemiş'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Pozisyonlar:</span>
            <span>{user.positions?.join(', ') || 'Belirtilmemiş'}</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Profil Bilgilerini Düzenle</h2>
          
          {message && (
            <div className={`p-3 rounded-md mb-4 ${
              message.includes('başarıyla') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
              <div className="grid grid-cols-2 gap-3">
                {POSITIONS.map(position => (
                  <label key={position} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={position}
                      {...register('positions')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{position}</span>
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
