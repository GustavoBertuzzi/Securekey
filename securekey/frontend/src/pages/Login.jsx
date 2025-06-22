import React, { useState, useEffect } from "react";
import axios from "axios";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | SecureKey";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        senha,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/cofre");
      }
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.erro) {
        setError(err.response.data.erro);
      } else {
        setError("Erro na conexão com o servidor");
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

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
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: 3 }}
            >
              Entrar
            </Button>

            <Typography variant="body2" align="center" mt={2}>
              Não tem uma conta?{" "}
              <Link
                component={RouterLink}
                to="/cadastro"
                underline="hover"
                color="secondary"
              >
                Crie sua conta aqui!
              </Link>
            </Typography>

            <Typography variant="body2" align="center" mt={1}>
              <Link
                component={RouterLink}
                to="#"
                underline="hover"
                color="secondary"
              >
                Esqueceu a senha?
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
