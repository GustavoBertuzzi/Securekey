const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const jwt = require("jsonwebtoken");

const SECRET = "seuSegredoAqui"; // ideal colocar no .env

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const usuario = rows[0];

    // Atenção: comparando senha em texto puro. Ideal usar bcrypt.
    if (senha !== usuario.senha) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // Gerar token JWT com id e email do usuário
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ mensagem: "Login bem-sucedido", token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
