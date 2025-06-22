import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cadastro | SecureKey";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !senha || !confirmarSenha) {
      setError("Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/usuarios/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Cadastro realizado com sucesso!");
        setTimeout(() => {
          navigate("/"); // Redireciona para a tela de login após sucesso
        }, 1500);
      } else {
        setError(data.erro || "Erro ao cadastrar usuário");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro no cadastro:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            mb={2}
            color="primary"
          >
            SecureKey
          </Typography>

          <Typography variant="h6" align="center" gutterBottom>
            Cadastro
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Senha"
              variant="outlined"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              label="Confirmar Senha"
              variant="outlined"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: 3 }}
            >
              Cadastrar
            </Button>

            <Typography variant="body2" align="center" mt={2}>
              Já tem uma conta?{" "}
              <Link
                component={RouterLink}
                to="/"
                underline="hover"
                color="secondary"
              >
                Faça login aqui!
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
