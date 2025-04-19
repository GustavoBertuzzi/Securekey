const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config({ path: ".env" }); // Força o caminho exato
console.log("Variáveis carregadas:", {
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
}); // Debug

// Configuração inicial
const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"]; // Permite ambos os domínios

// Middlewares seguros
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json({ limit: "10kb" })); // Limita tamanho do payload

// Pool de conexões otimizado
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4", // Garanta que a conexão use utf8mb4
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
  ssl:
    process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : null,
});

// Validação de variáveis de ambiente
const requiredEnvVars = ["DB_USER", "DB_PASSWORD", "DB_NAME", "DB_SECRET_KEY"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Variável de ambiente faltando: ${varName}`);
    process.exit(1);
  }
});

// Middleware de sanitização
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj) return obj;
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "string" ? value.replace(/[;\'"\\]/g, "") : value,
      ])
    );
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  next();
};

// Rota para salvar senhas (com validação)
app.post("/api/passwords", sanitizeInput, async (req, res) => {
  const { app_name, username, password, owner_password } = req.body;

  // Validação robusta
  if (!app_name || !username || !password || !owner_password) {
    return res.status(400).json({
      error:
        "Campos obrigatórios faltando: app_name, username, password, owner_password",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO apps (app_name, username, encrypted_password, owner_password) 
       VALUES (?, ?, AES_ENCRYPT(?, ?), ?)`,
      [app_name, username, password, process.env.DB_SECRET_KEY, owner_password]
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

// Rota para listar senhas (com paginação)
app.get("/api/passwords", sanitizeInput, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
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

    // Se não houver resultados, retornar um array vazio
    if (!Array.isArray(rows)) {
      return res.status(500).json({
        error:
          "Erro ao recuperar senhas, resposta inesperada do banco de dados.",
      });
    }

    // Remove senhas em caso de resposta vazia
    const safeRows = rows.map((row) => ({
      ...row,
      password: row.password ? "••••••••" : null,
    }));

    res.json({
      data: safeRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await getTotalCount(),
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

// Helper para contagem total
async function getTotalCount() {
  const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM apps");
  return count;
}

// Health Check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "healthy",
      db: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: "Database connection failed",
    });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({
    error: "Erro interno do servidor",
    requestId: req.id,
  });
});

// Inicialização segura
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🛡️ Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || "development"}`);
});

// Encerramento gracioso
process.on("SIGTERM", () => {
  pool
    .end()
    .then(() => {
      console.log("Pool de conexões encerrado");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Erro ao encerrar pool:", err);
      process.exit(1);
    });
});
