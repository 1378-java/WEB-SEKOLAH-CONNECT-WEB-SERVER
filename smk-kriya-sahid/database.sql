-- Jalankan di phpMyAdmin atau: mysql -u root < database.sql
CREATE DATABASE IF NOT EXISTS smk_kriya_sahid CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smk_kriya_sahid;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  isi TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Admin default (password: admin123) — ganti setelah login pertama!
INSERT INTO users (nama, email, password, role) VALUES
('Admin Sekolah', 'admin@smkkriyasahid.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- password hash di atas = "password" (contoh). Buat admin baru lewat register lebih aman.
