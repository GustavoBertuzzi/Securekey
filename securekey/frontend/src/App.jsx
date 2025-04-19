import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Cofre from './pages/Cofre'
import GeradorSenha from  './pages/GeradorSenha'
import Config from './pages/Config'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/Cadastro' element={<Cadastro />} />
          <Route path="/home" element={<Cofre />} />
          <Route path="/cadastrar" element={<GeradorSenha />} />
          <Route path="/configuracoes" element={<Config />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
