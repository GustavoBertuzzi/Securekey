import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import InputLabel from '../components/InputLabel'
import Button from '../components/Button';
import '../index.css';

export default function Cadastro() {
    useEffect(() => {
        document.title = 'Cadastro | SecureKey';
      }, []);
      
      const [email, setEmail] = useState('');
      const [senha, setSenha] = useState('');
      const [senhaCopia, setSenhaCopia] = useState('');

    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-azure-web">
        
                <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                    <h1 className="text-3xl font-bold text-center text-black mb-6">SecureKey</h1>
                    <h2 className="text-xl text-center text-black mb-4">Cadastre-se</h2>
                    <form className="flex flex-col space-y-4">
                    
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
                        id='nova-senha'
                        autoComplete='senha'
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required={true}
                        placeholder="Digite sua senha aqui"
                    />

                    <InputLabel
                        labelText='Senha'
                        name='senha'
                        id='confirmar-nova-senha'
                        autoComplete='senha'
                        value={senhaCopia}
                        onChange={e => setSenhaCopia(e.target.value)}
                        required={true}
                        placeholder="Repita sua senha aqui"
                    />
                    
                    <Button 
                        type='submit'
                        text='Cadastrar'
                    />
                    
                    <p>Já tem uma conta? <Link to="/" className="text-sm text-medium-slate-blue hover:underline text-center" >Faça login aqui!</Link></p>

                    </form>
                </div>
                </div>
            </main>
    )
}