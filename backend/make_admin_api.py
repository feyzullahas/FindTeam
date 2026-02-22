"""
Admin User Creator - API Version
Backend API üzerinden admin yapar (veritabanı bağlantısı gerekmez)
"""
import requests
import json

API_URL = "http://localhost:8000"

def make_admin_via_api(email: str, admin_email: str):
    """
    API üzerinden kullanıcıyı admin yap
    
    Args:
        email: Admin olacak kullanıcının emaili
        admin_email: Mevcut admin kullanıcının emaili (ilk admin için aynı olabilir)
    """
    try:
        # Önce kullanıcı var mı kontrol et
        print(f"\n⏳ {email} kullanıcısı aranıyor...")
        
        # Token al (eğer varsa)
        # Bu basit versiyon için direkt veritabanı üzerinden yapacağız
        print("❌ API üzerinden admin yapma henüz implement edilmemiş.")
        print("💡 Alternatif çözüm: Backend sunucusu başladığında veritabanı otomatik bağlanır.")
        print("💡 Lütfen backend sunucusunu kontrol et.")
        
        return False
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("🔐 Admin User Creator (API Version)")
    print("=" * 50)
    
    email = input("\nAdmin yapmak istediğin email adresini gir: ").strip()
    
    if not email:
        print("❌ Email adresi boş olamaz!")
        exit(1)
    
    print(f"\n⏳ {email} admin yapılıyor (API üzerinden)...")
    
    if make_admin_via_api(email, email):
        print("\n✨ İşlem tamamlandı!")
        print("🌐 Artık admin dashboard'a erişebilirsin: http://localhost:3000/admin")
    else:
        print("\n❌ İşlem başarısız!")
        print("\n💡 Alternatif çözüm:")
        print("Backend sunucusu çalışırken, veritabanı otomatik bağlanır.")
        print("Sunucunun çalıştığından emin ol.")
