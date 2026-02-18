"""
Kötü amaçlı metinlerle değiştirilmiş ilanları temizleme scripti
"""
from sqlalchemy import create_engine, text
from app.core.config import settings
import sys

print("🧹 Kötü amaçlı ilanları temizleme scripti başlatılıyor...")

try:
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Önce kaç ilan var bakalım
        result = conn.execute(text("SELECT COUNT(*) FROM posts"))
        total_posts = result.scalar()
        print(f"📊 Toplam ilan sayısı: {total_posts}")
        
        # Şüpheli ilanları göster
        print("\n🔍 Şüpheli ilanlar aranıyor...")
        
        # Burada kötü amaçlı metni aramak için birkaç anahtar kelime kullanabiliriz
        # Kendi durumuna göre bu kelimeleri değiştir!
        suspicious_keywords = [
            "HACK",
            "COMPROMISED", 
            "MALICIOUS",
            "RANSOM",
            "VULNERABILITY",
            "ANANI",
            "ARIYORUM",
            "SEX",
            "GAY",
            "PİÇ",
            "AMK",
            "SİK",
            "YAVŞAK",
            "OROSPU",
            "KÖPEK",
            "HACKER",
            "AM",
            "YARRAK"
        ]
        
        # Her anahtar kelime için kontrol et
        suspicious_posts = []
        for keyword in suspicious_keywords:
            result = conn.execute(text(
                f"""
                SELECT id, title, description, created_at 
                FROM posts 
                WHERE title LIKE :keyword OR description LIKE :keyword
                LIMIT 10
                """
            ), {"keyword": f"%{keyword}%"})
            
            posts = result.fetchall()
            suspicious_posts.extend(posts)
        
        if not suspicious_posts:
            print("✅ Şüpheli ilan bulunamadı!")
            print("\nEğer ilanlar hala kötü görünüyorsa, aşağıdaki seçenekleri dene:")
            print("1. Kötü amaçlı metindeki bir kelimeyi suspicious_keywords listesine ekle")
            print("2. Veya tüm ilanları listelemek için 'python cleanup_malicious_posts.py --list-all' çalıştır")
            sys.exit(0)
        
        # Bulunan ilanları göster
        print(f"\n⚠️  {len(suspicious_posts)} şüpheli ilan bulundu:\n")
        for post in suspicious_posts[:10]:  # İlk 10'u göster
            print(f"ID: {post[0]}")
            print(f"Başlık: {post[1][:60]}...")
            print(f"Açıklama: {post[2][:60] if post[2] else 'Yok'}...")
            print(f"Oluşturulma: {post[3]}")
            print("-" * 60)
        
        # Kullanıcıdan onay al
        print(f"\n⚠️  {len(set([p[0] for p in suspicious_posts]))} ilan silinecek.")
        response = input("Bu ilanları silmek istediğine emin misin? (EVET/hayır): ")
        
        if response.upper() == "EVET":
            # İlanları sil
            post_ids = [post[0] for post in suspicious_posts]
            placeholders = ','.join([':id' + str(i) for i in range(len(post_ids))])
            params = {f'id{i}': post_id for i, post_id in enumerate(post_ids)}
            
            # Dikkat: Bu posts'ları kalıcı olarak siler!
            result = conn.execute(
                text(f"DELETE FROM posts WHERE id IN ({','.join([str(p) for p in post_ids])})")
            )
            conn.commit()
            
            print(f"✅ {result.rowcount} ilan başarıyla silindi!")
            
            # Yeni toplam
            result = conn.execute(text("SELECT COUNT(*) FROM posts"))
            remaining_posts = result.scalar()
            print(f"📊 Kalan ilan sayısı: {remaining_posts}")
            
        else:
            print("❌ İşlem iptal edildi.")
            print("\nAlternatif seçenekler:")
            print("1. İlanları silmek yerine pasif yap:")
            print("   UPDATE posts SET status='closed' WHERE id IN (...)")
            print("2. Neon.tech'te point-in-time recovery kullan")
            print("3. Manuel olarak her ilanı kontrol et")

except Exception as e:
    print(f"❌ Hata oluştu: {e}")
    import traceback
    traceback.print_exc()

print("\n🎯 Script tamamlandı!")
