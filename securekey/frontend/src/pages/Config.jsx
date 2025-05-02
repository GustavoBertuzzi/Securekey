import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider
} from '@mui/material';
import { Settings } from '@mui/icons-material';

export default function Config() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError("As senhas não coincidem!");
    }

    // Simulação de integração com backend
    setTimeout(() => {
      setSuccess("Configurações atualizadas com sucesso!");
      setEmail('');
      setEmailPassword('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <Layout onLogout={handleLogout}>
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" mb={4} display="flex" alignItems="center">
          <Settings sx={{ mr: 1 }} />
          Configurações da Conta
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Alterar Email */}
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>Alterar E-mail</Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Novo E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, borderRadius: 3 }}
          />
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="Senha Atual"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            sx={{ mb: 2, borderRadius: 3 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mb: 4, borderRadius: 3 }}>
            Confirmar E-mail
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* Alterar Senha */}
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>Alterar Senha</Typography>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="Senha Atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2, borderRadius: 3 }}
          />
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2, borderRadius: 3 }}
          />
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2, borderRadius: 3 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 3 }}>
            Salvar Nova Senha
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
