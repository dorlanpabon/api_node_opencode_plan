-- # descripción breve (max 30 chars), ficha: full description at README.md
CREATE DATABASE IF NOT EXISTS api_auth_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE api_auth_db;

-- Tabla de usuarios para authn
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB CHARACTER SET utf8mb4;
