const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Criar o banco de dados se não existir
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(
      `Banco de dados "${process.env.DB_NAME}" criado/verificado com sucesso!`
    );

    // Usar o banco de dados
    await connection.changeUser({ database: process.env.DB_NAME });

    // Criar tabela usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      )
    `);

    // Criar tabela cofre
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cofre (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        plataforma VARCHAR(50) NOT NULL,
        login VARCHAR(100) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        proprietario VARCHAR(50),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);

    // Criar tabela apps (passo 5 com folder incluso)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS apps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        app_name VARCHAR(100) NOT NULL,
        username VARCHAR(100),
        encrypted_password VARCHAR(255) NOT NULL,
        owner_password VARCHAR(255) NOT NULL,
        folder ENUM('Trabalho', 'Pessoal', 'Outros') DEFAULT 'Outros',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao configurar o banco:", error);
  } finally {
    await connection.end(); // Fecha a conexão
  }
}

setupDatabase();
