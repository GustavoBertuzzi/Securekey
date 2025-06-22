const express = require("express");
const router = express.Router();
const pool = require("../database/db");

router.post("/", async (req, res) => {
  const { app_name, username, password, owner_password, folder } = req.body;

  if (!app_name || !password || !owner_password) {
    return res.status(400).json({
      error: "Campos obrigatórios faltando: app_name, password, owner_password",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO apps (app_name, username, encrypted_password, owner_password, folder) 
       VALUES (?, ?, AES_ENCRYPT(?, ?), ?, ?)`,
      [
        app_name,
        username || "",
        password,
        process.env.DB_SECRET_KEY,
        owner_password,
        folder || "",
      ]
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Registro criado com sucesso",
    });
  } catch (error) {
    console.error("Erro no POST /api/passwords:", error);
    res.status(500).json({
      error: "Falha ao salvar dados",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 1000 } = req.query; // limit maior para pegar tudo

  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        app_name, 
        username, 
        AES_DECRYPT(encrypted_password, ?) AS password,
        owner_password,
        created_at
       FROM apps
       LIMIT ? OFFSET ?`,
      [process.env.DB_SECRET_KEY, parseInt(limit), parseInt(offset)]
    );

    // Não enviar senha real para frontend, só máscara
    const safeRows = rows.map((row) => ({
      ...row,
      password: row.password ? "••••••••" : null,
    }));

    const [[{ count }]] = await pool.query(
      "SELECT COUNT(*) as count FROM apps"
    );

    res.json({
      data: safeRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
    });
  } catch (error) {
    console.error("Erro no GET /api/passwords:", error);
    res.status(500).json({
      error: "Falha ao recuperar dados",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
