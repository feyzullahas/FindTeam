"""
Tüm ilanları listele ve incele
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

print("📋 Tüm ilanlar listeleniyor...\n")

try:
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Tüm ilanları getir
        result = conn.execute(text("""
            SELECT p.id, p.title, p.description, p.status, p.created_at, u.name as user_name, u.email
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        """))
        
        posts = result.fetchall()
        
        if not posts:
            print("❌ Hiç ilan bulunamadı!")
        else:
            print(f"📊 Toplam {len(posts)} ilan bulundu:\n")
            print("=" * 100)
            
            for i, post in enumerate(posts, 1):
                post_id, title, desc, status, created_at, user_name, email = post
                
                print(f"\n{i}. İLAN")
                print(f"ID: {post_id}")
                print(f"Başlık: {title}")
                print(f"Açıklama: {desc[:100] if desc else 'Yok'}{'...' if desc and len(desc) > 100 else ''}")
                print(f"Durum: {status}")
                print(f"Oluşturan: {user_name} ({email})")
                print(f"Tarih: {created_at}")
                print("-" * 100)
            
            print(f"\n📊 Özet:")
            print(f"Toplam ilan: {len(posts)}")
            
            # Status bazında sayım
            status_counts = {}
            for post in posts:
                status = post[3]
                status_counts[status] = status_counts.get(status, 0) + 1
            
            print(f"Durum dağılımı:")
            for status, count in status_counts.items():
                print(f"  - {status}: {count}")
            
            print("\n💡 İpucu:")
            print("Şüpheli görünen ilanları temizlemek için:")
            print("python cleanup_malicious_posts.py")

except Exception as e:
    print(f"❌ Hata: {e}")
    import traceback
    traceback.print_exc()
