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
  Select,
  MenuItem,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Layout } from "../components/Layout";

const PasswordVault = () => {
  const [formData, setFormData] = useState({
    app_name: "",
    username: "",
    password: "",
    owner_password: "",
    folder: "", // Adicionado o campo folder
  });

  const [passwords, setPasswords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folders, setFolders] = useState(["Trabalho", "Pessoal", "Outros"]);

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
      setFormData({
        app_name: "",
        username: "",
        password: "",
        owner_password: "",
        folder: "",
      });
      setShowModal(false);
      fetchPasswords();
    } catch (error) {
      alert(
        "Erro ao salvar: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const filteredPasswords = selectedFolder
    ? passwords.filter((p) => p.folder === selectedFolder)
    : passwords;

  return (
    <Layout onLogout={() => localStorage.removeItem("token")}>
      <Grid
        container
        spacing={4}
        flexDirection={{ xs: "column", md: "row-reverse" }}
      >
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => setShowModal(true)}
            sx={{ mb: 2 }}
          >
            Nova Senha
          </Button>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtros por Pasta
            </Typography>
            <List dense>
              {folders.map((folder, i) => (
                <ListItem
                  key={i}
                  selected={folder === selectedFolder}
                  onClick={() =>
                    setSelectedFolder(folder === selectedFolder ? "" : folder)
                  }
                  button
                >
                  <ListItemText primary={folder} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                const newFolder = prompt("Nome da nova pasta:");
                if (newFolder && !folders.includes(newFolder)) {
                  setFolders([...folders, newFolder]);
                }
              }}
            >
              Nova Pasta
            </Button>
          </Paper>
        </Grid>

        {/* Lista de senhas */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" gutterBottom>
            Senhas Salvas
          </Typography>
          <Grid container spacing={2}>
            {filteredPasswords.length > 0 ? (
              filteredPasswords.map((p, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => alert(JSON.stringify(p, null, 2))}
                  >
                    <Typography variant="subtitle1">{p.app_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dono: {p.owner_password}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pasta: {p.folder || "Nenhuma"}
                    </Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography sx={{ m: 2 }}>Nenhuma senha encontrada.</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal para nova senha */}
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
              label="Nome do App"
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
            <TextField
              label="Dono"
              value={formData.owner_password}
              onChange={(e) =>
                setFormData({ ...formData, owner_password: e.target.value })
              }
              required
            />
            <Select
              value={formData.folder}
              onChange={(e) =>
                setFormData({ ...formData, folder: e.target.value })
              }
              displayEmpty
            >
              <MenuItem value="">Selecionar pasta</MenuItem>
              {folders.map((folder, i) => (
                <MenuItem key={i} value={folder}>
                  {folder}
                </MenuItem>
              ))}
            </Select>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Salvar
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PasswordVault;
