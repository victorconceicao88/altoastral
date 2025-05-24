import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import logo from './assets/logo-alto-astral.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Credenciais simples (em produção, use autenticação segura)
    if (username === 'admin' && password === '2320') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin', { replace: true }); // Redireciona forçadamente para /admin
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gradient-to-r from-astral to-astral-dark p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Alto Astral" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold">Área Restrita</h1>
          <p className="text-white/90">Acesso exclusivo para administradores</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            >
              <p>{error}</p>
            </motion.div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <FiArrowLeft className="mr-1" />
              Voltar ao site
            </button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-gradient-to-r from-astral to-astral-dark text-white px-6 py-2 rounded-lg flex items-center"
            >
              <FiLogIn className="mr-2" />
              Entrar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;