const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// Rota de cadastro
router.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "email e senha são obrigatórios" });
  }

  try {
    // Verifica se o usuário já existe
    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      return res
        .status(409)
        .json({ erro: "Usuário já cadastrado com esse email" });
    }

    // Insere novo usuário
    await pool.query("INSERT INTO usuarios (email, senha) VALUES (?, ?)", [
      email,
      senha,
    ]);

    return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const [users] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (users.length === 0) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    // Aqui você pode gerar um token JWT real, se quiser
    return res.json({ token: "token-fake" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
