import React from "react";

function Sidebar({ searchValue, onSearchChange }) {
  return (
    <div>
      <h2> SecureKey </h2>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchValue}
        onChange={onSearchChange}
      />

      <ul>
        <li>
          <button>Cofre</button>
        </li>
        <li>
          <button>Configurações</button>
        </li>
        <li>
          <button>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
