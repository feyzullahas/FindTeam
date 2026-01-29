"""
FindTeam İlişkisel Veritabanı Tasarımı
Users, Posts, Applications, Positions tabloları
"""

import pymysql
from sqlalchemy import create_engine, text
from app.core.config import settings

print("🏗️  Creating FindTeam Relational Database...")

# SQL script for complete database setup
SQL_SCRIPT = """
-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS post_positions;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS user_positions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS positions;

-- Positions table (standalone positions like "forvet", "kaleci")
CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
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
);

-- User-Positions relationship (many-to-many)
CREATE TABLE user_positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    position_id INT NOT NULL,
    skill_level ENUM('beginner', 'intermediate', 'advanced', 'professional') DEFAULT 'intermediate',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_position (user_id, position_id)
);

-- Posts table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    post_type ENUM('team', 'player') NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_info JSON NOT NULL,
    user_id INT NOT NULL,
    status ENUM('active', 'closed', 'expired') DEFAULT 'active',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Post-Positions relationship (many-to-many)
CREATE TABLE post_positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    position_id INT NOT NULL,
    count_needed INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_position (post_id, position_id)
);

-- Applications table (users applying to posts)
CREATE TABLE applications (
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
);

-- Insert sample positions
INSERT INTO positions (name, description) VALUES 
('Kaleci', 'Kaleci pozisyonu'),
('Defans', 'Defans oyuncusu'),
('Orta Saha', 'Orta saha oyuncusu'),
('Forvet', 'Forvet oyuncusu'),
('Kanat', 'Kanat oyuncusu'),
('Stopper', 'Stoper pozisyonu'),
('Libero', 'Libero pozisyonu'),
('Sol Bek', 'Sol bek'),
('Sağ Bek', 'Sağ bek'),
('Defansif Orta Saha', 'Defansif orta saha'),
('Ofansif Orta Saha', 'Ofansif orta saha'),
('Santrafor', 'Santrafor'),
('Yedek', 'Yedek oyuncu');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_posts_city ON posts(city);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_applications_post_id ON applications(post_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
"""

try:
    # Connect to database
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("📋 Executing database creation script...")
        
        # Split and execute SQL statements
        statements = SQL_SCRIPT.split(';')
        
        for statement in statements:
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    conn.execute(text(statement))
                    print(f"✅ Executed: {statement[:50]}...")
                except Exception as e:
                    if "already exists" not in str(e) and "Duplicate" not in str(e):
                        print(f"❌ Error in statement: {statement[:50]}...")
                        print(f"   Error: {e}")
        
        conn.commit()
        
        # Verify tables
        print("\n📊 Verifying created tables:")
        result = conn.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result.fetchall()]
        for table in tables:
            print(f"  ✅ {table}")
        
        # Check sample data
        print("\n⚽ Sample positions:")
        result = conn.execute(text("SELECT name FROM positions LIMIT 5"))
        positions = [row[0] for row in result.fetchall()]
        for position in positions:
            print(f"  ⚽ {position}")
        
        print("\n🎉 Relational database created successfully!")
        print("📋 Tables: users, positions, user_positions, posts, post_positions, applications")

except Exception as e:
    print(f"❌ Database creation error: {e}")
    import traceback
    traceback.print_exc()

print("\n🎯 Database setup completed!")
