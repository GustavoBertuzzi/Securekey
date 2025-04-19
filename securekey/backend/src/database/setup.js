const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(
      `Banco de dados "${process.env.DB_NAME}" criado/com verificado!`
    );

    await connection.changeUser({ database: process.env.DB_NAME });

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      )
    `);

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

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao configurar o banco:", error);
  } finally {
    await connection.end(); // Fecha a conexão
  }
}

setupDatabase();
