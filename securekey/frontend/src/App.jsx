import { useState } from "react";
import "./App.css";
import Vault from "./pages/Cofre";
import Sidebar from "./pages/Sidebar";
import PasswordForm from "./pages/Cofre";
import PasswordList from "./pages/Listadesenhas";

function App() {
  return (
    <div>
      <Vault></Vault>
      <Sidebar></Sidebar>
      <PasswordForm />
      <PasswordList />
    </div>
  );
}

export default App;
