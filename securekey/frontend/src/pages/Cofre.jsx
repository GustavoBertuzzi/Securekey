import React, { useState } from "react";
import axios from "axios";

const PasswordForm = () => {
  const [formData, setFormData] = useState({
    app_name: "",
    username: "",
    password: "",
    owner_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/passwords", formData);
      alert("Dados salvos com sucesso!");
      setFormData({
        app_name: "",
        username: "",
        password: "",
        owner_password: "",
      });
    } catch (error) {
      alert("Erro ao salvar: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do App"
        value={formData.app_name}
        onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Usuário"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Dono"
        value={formData.owner_password}
        onChange={(e) =>
          setFormData({ ...formData, owner_password: e.target.value })
        }
        required
      />
      <button type="submit">Salvar</button>
    </form>
  );
};

export default PasswordForm;
