CREATE DATABASE IF NOT EXISTS jamur_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jamur_db;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','pengelola') NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- MUSHROOM RECORDS
CREATE TABLE IF NOT EXISTS mushroom_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jenis_jamur VARCHAR(80) NOT NULL,
  batch VARCHAR(80) NOT NULL,
  suhu DECIMAL(5,2) NOT NULL,
  kelembaban DECIMAL(5,2) NULL,
  tahap_perkembangan VARCHAR(80) NOT NULL,
  catatan TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (created_at),
  CONSTRAINT fk_records_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_user_id INT NOT NULL,
  action VARCHAR(40) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (actor_user_id),
  INDEX (created_at),
  CONSTRAINT fk_logs_user FOREIGN KEY (actor_user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- DEFAULT ADMIN (password: admin123)
-- Hash dibuat dengan PHP password_hash, tapi biar langsung jalan kita isi pakai hash yang umum.
-- SARAN: setelah login pertama, ganti password admin lewat phpMyAdmin (atau bikin fitur change password).
INSERT INTO users (name, username, password_hash, role, status)
VALUES (
  'Administrator',
  'admin',
  '$2y$10$z0lH7k1v5mD3x3WQFJxYlO6xqB6m1m7yQeG7N8Vb1gX0yCzK8oJ9C',  -- admin123 (placeholder)
  'admin',
  'active'
);
