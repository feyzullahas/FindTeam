# Admin Dashboard Kullanım Kılavuzu

## 🎯 Admin Dashboard Nedir?

Admin Dashboard, sistem yöneticilerinin (admin) tüm kullanıcıları ve ilanları görüntüleyip yönetebileceği bir paneldir.

## 🔐 Admin Olma Adımları

### 1. Önce Normal Kullanıcı Olarak Giriş Yapın
- http://localhost:3000 adresine gidin
- Google ile giriş yapın veya email/şifre ile kayıt olun

### 2. Kendinizi Admin Yapın

Backend dizininde şu komutu çalıştırın:

```bash
cd backend
python make_admin.py
```

Email adresinizi girin ve onaylayın.

### 3. Sayfayı Yenileyin

Tarayıcıyı yenileyin (F5) veya çıkış yapıp tekrar giriş yapın.

### 4. Admin Dashboard'a Erişin

Navbar'da yeni bir **"Admin"** linki göreceksiniz (🛡️ simgesi ile). Tıklayın!

## 📊 Admin Dashboard Özellikleri

### İstatistikler Sekmesi
- Toplam kullanıcı sayısı
- Aktif kullanıcı sayısı
- Toplam ilan sayısı
- Toplam kadro sayısı

### Kullanıcılar Sekmesi
- Tüm kullanıcıları listeler
- Kullanıcı detaylarını gösterir (email, isim, şehir, kayıt tarihi)
- Admin ve aktif durumlarını gösterir
- Kullanıcıları silme yetkisi (kendi hesabınızı silemezsiniz)

### İlanlar Sekmesi
- Tüm ilanları listeler
- İlan detaylarını gösterir (başlık, açıklama, konum, tarih, pozisyon)
- İlanları silme yetkisi

## ⚠️ Güvenlik Notları

1. **Admin yetkisi sadece güvendiğiniz kişilere verilmelidir**
2. Admin silinen verileri geri getirilemez
3. Admin işlemleri backend'de loglanır

## 🚀 API Endpoints

Admin için özel API endpoint'leri:
- `GET /admin/stats` - İstatistikler
- `GET /admin/users` - Tüm kullanıcılar
- `DELETE /admin/users/{user_id}` - Kullanıcı sil
- `GET /admin/posts` - Tüm ilanlar
- `DELETE /admin/posts/{post_id}` - İlan sil

## 🛠️ Teknik Detaylar

- Backend: FastAPI admin route'ları (`app/admin/admin_routes.py`)
- Frontend: Admin Dashboard sayfası (`frontend/src/pages/AdminDashboard.jsx`)
- Admin middleware: `get_admin_user()` fonksiyonu yetkisiz erişimi engeller
- Database: `users` tablosuna `is_admin` boolean kolonu eklendi

## 💡 İpuçları

- Admin dashboard'a sadece `is_admin=True` olan kullanıcılar erişebilir
- Admin kontrolü hem backend hem frontend'de yapılır
- Backend loglarında admin işlemleri detaylı şekilde kaydedilir
