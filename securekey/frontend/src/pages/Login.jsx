import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import InputLabel from '../components/InputLabel'
import Button from '../components/Button';
import '../index.css';

export default function Login() {
  useEffect(() => {
    document.title = 'Login | SecureKey';
  }, []);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Hook para redirecionar
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // espaço para lógica de validação de formulário
    
    if (email === 'admin@gmail.com' && senha === '123456') {
      //  Dados corretos
      navigate('/configuracoes');
    } else {
      // Dados incorretos 
      alert('Email ou senha inválidos');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-azure-web">

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-black mb-6">SecureKey</h1>
          <h2 className="text-xl text-center text-black mb-4">Login</h2>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            
            <InputLabel 
                labelText='Email'
                name='email'
                id='input-email'
                autoComplete='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required={true}
                placeholder='Digite seu email aqui'
            />

            <InputLabel
                labelText='Senha'
                name='senha'
                id='input-senha'
                autoComplete='senha'
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required={true}
                placeholder="Digite sua senha aqui"
            />
            
            <Button 
                type='submit'
                text='Entrar'
            />
            
            <p>Não tem uma conta? <Link to="/cadastro" className="text-sm text-medium-slate-blue hover:underline text-center" >Crie sua conta aqui!</Link></p>

            <Link to="#" className="text-sm text-medium-slate-blue hover:underline text-center">
              Esqueceu a senha?
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}
