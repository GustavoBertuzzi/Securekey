-- 1. Criar o banco de dados (nome corrigido)
CREATE DATABASE IF NOT EXISTS password_manager;

-- 2. Criar usuário com sintaxe correta e senha mais segura
CREATE USER 'user_manager'@'localhost' IDENTIFIED BY 'SenhaSegura123@';

-- 3. Conceder privilégios específicos
GRANT ALL PRIVILEGES ON password_manager.* TO 'user_manager'@'localhost';
FLUSH PRIVILEGES;

-- 4. Usar o banco de dados
USE password_manager;

-- 5. Criar tabela com estrutura melhorada
CREATE TABLE IF NOT EXISTS apps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_name VARCHAR(100) NOT NULL,
    username VARCHAR(100),
    encrypted_password VARCHAR(255) NOT NULL,
    master_password VARCHAR(255) NOT NULL,  -- Nome mais descritivo
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;