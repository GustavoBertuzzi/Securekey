import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { TextField, FormControlLabel, Checkbox, Button, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function GerarSenhaPage() {
  const [quantidadeCaracteres, setQuantidadeCaracteres] = useState(12);
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(2);
  const [quantidadeEspeciais, setQuantidadeEspeciais] = useState(2);
  const [incluirMaiusculas, setIncluirMaiusculas] = useState(true);
  const [senhaGerada, setSenhaGerada] = useState('');

  const gerarSenha = () => {
    // sugestão para conectar o back-end
    
  };

  const copiarSenha = () => {
    navigator.clipboard.writeText(senhaGerada);
  };

  return (
    <Layout onLogout={() => {}}>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        <Typography variant="h5" className="mb-4 font-bold text-gray-800">Gerador de Senhas</Typography>

        <div className="grid gap-8">
          <TextField
            label="Quantidade total de caracteres"
            type="number"
            fullWidth
            value={quantidadeCaracteres}
            onChange={(e) => setQuantidadeCaracteres(Number(e.target.value))}
          />

          <TextField
            label="Quantidade de números"
            type="number"
            fullWidth
            value={quantidadeNumeros}
            onChange={(e) => setQuantidadeNumeros(Number(e.target.value))}
          />

          <TextField
            label="Quantidade de caracteres especiais"
            type="number"
            fullWidth
            value={quantidadeEspeciais}
            onChange={(e) => setQuantidadeEspeciais(Number(e.target.value))}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={incluirMaiusculas}
                onChange={(e) => setIncluirMaiusculas(e.target.checked)}
              />
            }
            label="Incluir letras maiúsculas"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={gerarSenha}
            className="w-full mt-2"
          >
            Gerar Senha
          </Button>

          {senhaGerada && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <Typography className="text-gray-800 font-mono break-all">
                {senhaGerada}
              </Typography>
              <Button onClick={copiarSenha} variant="outlined" size="small" className="ml-4">
                <ContentCopyIcon fontSize="small" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}