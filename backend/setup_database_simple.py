"""
FindTeam Veritabanı Kurulumu - Basit ve Güvenli
"""

import pymysql
from sqlalchemy import create_engine, text
from app.core.config import settings

print("🏗️  Setting up FindTeam Database...")

def setup_database():
    try:
        # Direct MySQL connection
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='database9876',
            database='findteam',
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        print("📋 Creating tables...")
        
        # 1. Positions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS positions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 2. Users table  
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                google_id VARCHAR(255) UNIQUE,
                phone VARCHAR(20),
                age INT,
                city VARCHAR(100),
                bio TEXT,
                profile_picture VARCHAR(500),
                is_verified BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # 3. Posts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                post_type ENUM('team', 'player') NOT NULL,
                city VARCHAR(100) NOT NULL,
                positions_needed TEXT,
                contact_info JSON NOT NULL,
                user_id INT NOT NULL,
                status ENUM('active', 'closed', 'expired') DEFAULT 'active',
                views_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # 4. Applications table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                applicant_id INT NOT NULL,
                message TEXT,
                status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_application (post_id, applicant_id)
            )
        """)
        
        # Insert sample positions
        positions = [
            ('Kaleci', 'Kaleci pozisyonu'),
            ('Defans', 'Defans oyuncusu'),
            ('Orta Saha', 'Orta saha oyuncusu'),
            ('Forvet', 'Forvet oyuncusu'),
            ('Kanat', 'Kanat oyuncusu'),
            ('Stopper', 'Stoper pozisyonu'),
            ('Sol Bek', 'Sol bek'),
            ('Sağ Bek', 'Sağ bek'),
            ('Santrafor', 'Santrafor'),
            ('Yedek', 'Yedek oyuncu')
        ]
        
        cursor.executemany("""
            INSERT IGNORE INTO positions (name, description) 
            VALUES (%s, %s)
        """, positions)
        
        connection.commit()
        
        # Verify setup
        print("\n📊 Database tables created:")
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        for table in tables:
            print(f"  ✅ {table[0]}")
        
        print("\n⚽ Sample positions:")
        cursor.execute("SELECT name FROM positions LIMIT 5")
        positions_data = cursor.fetchall()
        for position in positions_data:
            print(f"  ⚽ {position[0]}")
        
        print("\n🎉 Database setup completed successfully!")
        
        cursor.close()
        connection.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Database setup error: {e}")
        return False

if __name__ == "__main__":
    setup_database()
