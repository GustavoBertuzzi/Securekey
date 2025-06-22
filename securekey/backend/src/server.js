const dotenv = require("dotenv");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./database/db");

const app = express();

// Verifica se as variáveis obrigatórias existem
["DB_USER", "DB_PASSWORD", "DB_NAME", "DB_SECRET_KEY"].forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Variável de ambiente faltando: ${varName}`);
    process.exit(1);
  }
});

// Configura CORS
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Body parser
app.use(bodyParser.json({ limit: "10kb" }));

// Middleware de sanitização de entrada
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj) return obj;
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "string" ? value.replace(/[;'"\\]/g, "") : value,
      ])
    );
  };
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  next();
};
app.use(sanitizeInput);

// Rotas
const cadastroUserRoutes = require("./routes/cadastroUser");
const loginUserRoutes = require("./routes/loginUser");
const passwordsRoutes = require("./routes/addApps");

app.use("/api/usuarios", cadastroUserRoutes);
app.use("/api/login", loginUserRoutes);
app.use("/api/passwords", passwordsRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "healthy",
      db: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res
      .status(503)
      .json({ status: "unhealthy", error: "DB connection failed" });
  }
});

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno no servidor" });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🛡️ Servidor rodando em http://localhost:${PORT}`);
});

// Fechamento seguro do pool
process.on("SIGTERM", () => {
  pool
    .end()
    .then(() => {
      console.log("✅ Pool de conexões encerrado com sucesso.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Erro ao encerrar pool:", err);
      process.exit(1);
    });
});
