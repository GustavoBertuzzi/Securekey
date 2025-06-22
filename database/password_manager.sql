-- 4. Usar o banco de dados
USE password_manager;

-- 5. Criar tabela apps com a coluna folder
CREATE TABLE IF NOT EXISTS apps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_name VARCHAR(100) NOT NULL,
    username VARCHAR(100),
    encrypted_password VARCHAR(255) NOT NULL,
    owner_password VARCHAR(255) NOT NULL,  -- Nome mais descritivo
    folder ENUM('Trabalho', 'Pessoal', 'Outros') DEFAULT 'Outros',  -- Adicionando a coluna folder com ENUM
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Criar tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255)
);
