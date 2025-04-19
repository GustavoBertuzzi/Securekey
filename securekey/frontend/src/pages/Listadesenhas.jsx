import React, { useState, useEffect } from "react";
import axios from "axios";

const PasswordList = () => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/passwords");
        // Verificando se a resposta contém o campo 'data' como array
        if (Array.isArray(response.data.data)) {
          setPasswords(response.data.data);
        } else {
          console.error(
            "A resposta não contém um array em 'data'",
            response.data
          );
          setPasswords([]); // Definindo um array vazio se não for um array
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchPasswords();
  }, []);

  return (
    <div>
      <h2>Senhas Salvas</h2>
      <ul>
        {passwords.length > 0 ? (
          passwords.map((item) => (
            <li key={item.id}>
              <strong>{item.app_name}</strong> | Usuário: {item.username} |
              Senha: {item.password} | Dono: {item.owner_password}
            </li>
          ))
        ) : (
          <li>Não há senhas disponíveis</li> // Caso o array esteja vazio ou não haja senhas
        )}
      </ul>
    </div>
  );
};

export default PasswordList;
