import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Layout } from "../components/Layout";

const PasswordVault = () => {
  const [formData, setFormData] = useState({
    app_name: "",
    username: "",
    password: "",
  });

  const [passwords, setPasswords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);

  const fetchPasswords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/passwords");
      setPasswords(res.data.data || []);
    } catch (err) {
      alert("Erro ao carregar senhas: " + (err.message || err));
    }
  };

  useEffect(() => {
    document.title = "Cofre | SecureKey";
    fetchPasswords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/passwords", formData);
      setFormData({ app_name: "", username: "", password: "" });
      setShowModal(false);
      fetchPasswords();
    } catch (error) {
      alert(
        "Erro ao salvar: " + (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <Layout onLogout={() => localStorage.removeItem("token")}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowModal(true)}
          >
            Nova Senha
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Senhas Salvas
          </Typography>
          <Grid container spacing={2}>
            {passwords.length > 0 ? (
              passwords.map((p, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => setSelectedPassword(p)}
                  >
                    <Typography variant="subtitle1">{p.app_name}</Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography sx={{ m: 2 }}>Nenhuma senha encontrada.</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal para adicionar nova senha */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Nova Senha
          <IconButton
            onClick={() => setShowModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nome do App/Site"
              value={formData.app_name}
              onChange={(e) =>
                setFormData({ ...formData, app_name: e.target.value })
              }
              required
            />
            <TextField
              label="Usuário"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
            <TextField
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Salvar
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de exibição da senha */}
      <Dialog
        open={!!selectedPassword}
        onClose={() => setSelectedPassword(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Detalhes da Senha
          <IconButton
            onClick={() => setSelectedPassword(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {selectedPassword && (
          <DialogContent dividers>
            <Typography variant="subtitle1">
              Nome: {selectedPassword.app_name}
            </Typography>
            <Typography variant="body1">
              Usuário: {selectedPassword.username}
            </Typography>
            <Typography variant="body1">
              Senha: {selectedPassword.password}
            </Typography>
          </DialogContent>
        )}
      </Dialog>
    </Layout>
  );
};

export default PasswordVault;