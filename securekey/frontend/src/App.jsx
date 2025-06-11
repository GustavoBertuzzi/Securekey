import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' ;
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Cofre from './pages/Cofre'
import Geradordesenhas from  './pages/GeradorDeSenhas'
import Config from './pages/Config'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/cadastro' element={<Cadastro />} />
          <Route path="/cofre" element={<Cofre />} />
          <Route path="/senhas" element={<Geradordesenhas />} />
          <Route path="/configuracoes" element={<Config />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
