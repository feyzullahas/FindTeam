"""
Admin User Creator Script
Bu scripti çalıştırarak kendini admin yapabilirsin.
"""
import sys
import os

# Backend dizinini Python path'e ekle
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.db import SessionLocal
from app.users.user_model import User

def make_admin(email: str):
    """Kullanıcıyı admin yap"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ Kullanıcı bulunamadı: {email}")
            print("💡 Önce bu email ile giriş yapmalısın!")
            return False
        
        if user.is_admin:
            print(f"ℹ️  {email} zaten admin")
            return True
        
        user.is_admin = True
        db.commit()
        
        print(f"✅ {email} başarıyla admin yapıldı!")
        print(f"👤 Kullanıcı: {user.name} ({user.email})")
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("🔐 Admin User Creator")
    print("=" * 50)
    
    email = input("\nAdmin yapmak istediğin email adresini gir: ").strip()
    
    if not email:
        print("❌ Email adresi boş olamaz!")
        sys.exit(1)
    
    print(f"\n⏳ {email} admin yapılıyor...")
    
    if make_admin(email):
        print("\n✨ İşlem tamamlandı!")
        print("🌐 Artık admin dashboard'a erişebilirsin: http://localhost:3000/admin")
    else:
        print("\n❌ İşlem başarısız!")
        sys.exit(1)
