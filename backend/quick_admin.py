"""
Quick Admin Maker - Çalışan Backend Üzerinden
Bu script çalışan backend sunucusunun veritabanı bağlantısını kullanır
"""
import sys
import os

# Backend dizinini Python path'e ekle
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

def make_admin_via_running_backend(email: str):
    """Çalışan backend'in database session'ını kullanarak admin yap"""
    try:
        # İlk dene: direkt database connection
        try:
            from app.database.db import SessionLocal
            from app.users.user_model import User
            
            db = SessionLocal()
            user = db.query(User).filter(User.email == email).first()
            
            if not user:
                print(f"❌ Kullanıcı bulunamadı: {email}")
                print("💡 Önce bu email ile giriş yapmalısın!")
                db.close()
                return False
            
            if user.is_admin:
                print(f"ℹ️  {email} zaten admin")
                db.close()
                return True
            
            user.is_admin = True
            db.commit()
            
            print(f"✅ {email} başarıyla admin yapıldı!")
            print(f"👤 Kullanıcı: {user.name} ({user.email})")
            db.close()
            return True
            
        except Exception as db_error:
            print(f"⚠️  Direkt veritabanı bağlantısı başarısız: {db_error}")
            print("\n💡 ÇÖZÜM: Backend production veritabanına bağlı.")
            print("Production'da (Render.com) admin olmak için:")
            print("1. Render.com dashboard'una git")
            print("2. findteam projesini aç")
            print("3. Shell'i aç")
            print(f"4. Şu komutu çalıştır:")
            print(f"   python -c \"from app.database.db import SessionLocal; from app.users.user_model import User; db = SessionLocal(); user = db.query(User).filter(User.email == '{email}').first(); user.is_admin = True if user else None; db.commit(); print('Admin yapıldı!' if user else 'Kullanıcı bulunamadı')\"")
            print("\n🏠 LOCAL DEVELOPMENT için:")
            print("Local bir veritabanı kullanmak ister misin? (Evet için Y, Hayır için N)")
            return False
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        import traceback
        print(traceback.format_exc())
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🔐 Quick Admin Maker")
    print("=" * 60)
    
    email = input("\nAdmin yapmak istediğin email adresini gir: ").strip()
    
    if not email:
        print("❌ Email adresi boş olamaz!")
        sys.exit(1)
    
    print(f"\n⏳ {email} admin yapılıyor...")
    print("(Çalışan backend'in veritabanı bağlantısı kullanılıyor...)\n")
    
    if make_admin_via_running_backend(email):
        print("\n✨ İşlem tamamlandı!")
        print("🌐 Tarayıcını yenile ve admin dashboard'a git:")
        print("   http://localhost:3000/admin")
    else:
        print("\n" + "=" * 60)
        print("⚠️  Alternatif Çözümler:")
        print("=" * 60)
        print("\n1️⃣ RENDER.COM (PRODUCTION) ÜZERİNDEN:")
        print("   - Render.com'a git")
        print("   - Shell aç ve yukarıdaki komutu çalıştır")
        print("\n2️⃣ LOCAL SQLite Veritabanı Kullan:")
        print("   - .env dosyasını düzenle")
        print("   - DATABASE_URL'i sqlite olarak değiştir")
        print("   - Backend'i yeniden başlat")
        print("\n3️⃣ API Üzerinden (Geliştirilecek):")
        print("   - Frontend'den profil sayfasına git")
        print("   - Console'da: localStorage.getItem('user_data')")
        print("   - Admin alanını manuel düzenle")
