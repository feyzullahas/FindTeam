"""
Lineup (Kadro Dizilişi) tablosu oluşturma scripti
"""
import os
import sys

# Python path'e app klasörünü ekle
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

print("📋 Lineup tablosu oluşturuluyor...")

try:
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Önce tablo var mı kontrol et
        result = conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'lineups'
            )
        """))
        table_exists = result.scalar()
        
        if table_exists:
            print("⚠️  Lineup tablosu zaten mevcut. Siliniyor ve yeniden oluşturuluyor...")
            conn.execute(text("DROP TABLE IF EXISTS lineups CASCADE"))
            conn.commit()
        
        # Lineup tablosunu oluştur (PostgreSQL için)
        conn.execute(text("""
            CREATE TABLE lineups (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                formation VARCHAR(20) DEFAULT '3-3-1',
                home_team JSONB NOT NULL,
                away_team JSONB,
                notes TEXT,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE,
                CONSTRAINT fk_lineup_user FOREIGN KEY (user_id) 
                    REFERENCES users(id) ON DELETE CASCADE
            )
        """))
        
        # Index oluştur
        conn.execute(text("""
            CREATE INDEX idx_lineups_user_id ON lineups(user_id)
        """))
        
        conn.commit()
        
        print("✅ Lineup tablosu başarıyla oluşturuldu!")
        
        # Tablo yapısını göster
        result = conn.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'lineups'
            ORDER BY ordinal_position
        """))
        
        print("\n📊 Tablo yapısı:")
        for row in result:
            nullable = "NULL" if row[2] == "YES" else "NOT NULL"
            print(f"  - {row[0]}: {row[1]} ({nullable})")
        
        # Foreign key kontrolü
        result = conn.execute(text("""
            SELECT 
                tc.constraint_name, 
                kcu.column_name,
                ccu.table_name AS foreign_table_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE tc.table_name = 'lineups' AND tc.constraint_type = 'FOREIGN KEY'
        """))
        
        print("\n🔗 Foreign Key'ler:")
        for row in result:
            print(f"  - {row[0]}: {row[1]} -> {row[2]}")

except Exception as e:
    print(f"❌ Hata: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n✅ Script tamamlandı!")
print("\nŞimdi yapman gerekenler:")
print("1. Backend'i çalıştır: python -m uvicorn app.main:app --reload")
print("2. Frontend'i çalıştır: cd frontend && npm run dev")
print("3. Tarayıcıda test et: http://localhost:5173/lineup")

