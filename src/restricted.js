import React from 'react';
import { useNavigate, Outlet, Routes, Route } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiCalendar, 
  FiSettings, 
  FiLogOut, 
  FiArrowLeft,
  FiGrid
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import logo from './assets/logo-alto-astral.png';

// Premium Navigation Components
const PremiumBackButton = ({ onClick, label = 'Voltar ao Painel', className = '' }) => (
  <motion.button
    whileHover={{ x: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center text-astral hover:text-astral-dark font-medium transition-colors ${className}`}
  >
    <FiArrowLeft className="mr-2" />
    {label}
  </motion.button>
);

const Breadcrumb = ({ items }) => (
  <nav className="flex mb-6" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && (
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          )}
          {item.href ? (
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                item.onClick();
              }}
              className={`inline-flex items-center text-sm font-medium ${index === items.length - 1 ? 'text-astral' : 'text-gray-700 hover:text-astral'}`}
            >
              {index === 0 && <FiGrid className="mr-2" />}
              {item.label}
            </a>
          ) : (
            <span className="inline-flex items-center text-sm font-medium text-gray-500">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// Layout Component
const RestrictedAreaLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center bg-gradient-to-r from-astral to-astral-dark">
          <img src={logo} alt="Alto Astral" className="h-12" />
          <span className="ml-2 text-xl font-bold text-white">Alto Astral</span>
        </div>
        
        <nav className="p-4 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition group"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-astral/10 group-hover:text-astral transition">
              <FiHome className="text-lg" />
            </div>
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-astral/10 text-astral font-medium group"
          >
            <div className="p-2 rounded-lg bg-astral/20">
              <FiSettings className="text-lg" />
            </div>
            <span>Administração</span>
          </button>
          
          <button
            onClick={() => navigate('/mesas')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition group"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-green-100 group-hover:text-green-600 transition">
              <FiShoppingBag className="text-lg" />
            </div>
            <span>Gerenciar Mesas</span>
          </button>
          
          <button
            onClick={() => navigate('/eventos')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition group"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-purple-100 group-hover:text-purple-600 transition">
              <FiCalendar className="text-lg" />
            </div>
            <span>Eventos</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition group"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 group-hover:text-red-600 transition">
              <FiLogOut className="text-lg" />
            </div>
            <span>Sair</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};

// Dashboard Page
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition">
                <FiSettings className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Administração</h2>
            </div>
            <p className="text-gray-600">
              Gerencie pedidos, cardápio, configurações e informações do restaurante.
            </p>
            <div className="mt-4 text-sm text-blue-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition">
              Acessar <FiArrowLeft className="ml-1 transform rotate-180" />
            </div>
          </motion.div>
          
          {/* Mesas Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/mesas')}
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition">
                <FiShoppingBag className="text-green-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Mesas</h2>
            </div>
            <p className="text-gray-600">
              Controle de reservas, distribuição de mesas e atendimento aos clientes.
            </p>
            <div className="mt-4 text-sm text-green-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition">
              Acessar <FiArrowLeft className="ml-1 transform rotate-180" />
            </div>
          </motion.div>
          
          {/* Eventos Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/eventos')}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Eventos</h2>
            </div>
            <p className="text-gray-600">
              Organize e gerencie eventos especiais no seu estabelecimento.
            </p>
            <div className="mt-4 text-sm text-purple-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition">
              Acessar <FiArrowLeft className="ml-1 transform rotate-180" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Admin Page
const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', onClick: () => navigate('/') },
            { label: 'Administração' }
          ]}
        />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Administração</h1>
            <p className="text-gray-500">Gerencie todos os aspectos do restaurante</p>
          </div>
          <PremiumBackButton onClick={() => navigate('/')} />
        </div>

        {/* Admin Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardSection 
            title="Pedidos" 
            count={24} 
            icon={<FiShoppingBag />} 
            color="blue"
            onClick={() => navigate('/admin/pedidos')}
          />
          <CardSection 
            title="Cardápio" 
            count={42} 
            icon={<FiSettings />} 
            color="green"
            onClick={() => navigate('/admin/cardapio')}
          />
          <CardSection 
            title="Configurações" 
            count={8} 
            icon={<FiSettings />} 
            color="purple"
            onClick={() => navigate('/admin/configuracoes')}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h3>
          {/* Activity items would go here */}
        </div>
      </div>
    </div>
  );
};

// Mesas Page
const MesasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', onClick: () => navigate('/') },
            { label: 'Gerenciar Mesas' }
          ]}
        />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Mesas</h1>
            <p className="text-gray-500">Controle de reservas e distribuição de mesas</p>
          </div>
          <PremiumBackButton onClick={() => navigate('/')} />
        </div>

        {/* Mesas Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardSection 
            title="Mesas Disponíveis" 
            count={12} 
            icon={<FiShoppingBag />} 
            color="green"
          />
          <CardSection 
            title="Reservas Hoje" 
            count={8} 
            icon={<FiCalendar />} 
            color="blue"
          />
          <CardSection 
            title="Ocupadas Agora" 
            count={5} 
            icon={<FiShoppingBag />} 
            color="purple"
          />
        </div>

        {/* Reservations Calendar */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendário de Reservas</h3>
          {/* Calendar component would go here */}
        </div>
      </div>
    </div>
  );
};

// Eventos Page
const EventosPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', onClick: () => navigate('/') },
            { label: 'Gestão de Eventos' }
          ]}
        />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestão de Eventos</h1>
            <p className="text-gray-500">Organize eventos especiais no seu estabelecimento</p>
          </div>
          <PremiumBackButton onClick={() => navigate('/')} />
        </div>

        {/* Eventos Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardSection 
            title="Eventos Ativos" 
            count={3} 
            icon={<FiCalendar />} 
            color="purple"
          />
          <CardSection 
            title="Próximos Eventos" 
            count={5} 
            icon={<FiCalendar />} 
            color="blue"
          />
          <CardSection 
            title="Eventos Passados" 
            count={12} 
            icon={<FiCalendar />} 
            color="green"
          />
        </div>

        {/* Event Planning */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Planejamento de Eventos</h3>
          {/* Event planning component would go here */}
        </div>
      </div>
    </div>
  );
};

// Reusable Card Section Component
const CardSection = ({ title, count, icon, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${onClick ? 'hover:border-astral' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{count}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {React.cloneElement(icon, { className: 'text-lg' })}
        </div>
      </div>
      {onClick && (
        <div className="mt-4 text-sm text-astral font-medium flex items-center">
          Ver detalhes <FiArrowLeft className="ml-1 transform rotate-180" />
        </div>
      )}
    </motion.div>
  );
};

// Main App Component
const RestrictedArea = () => {
  return (
    <RestrictedAreaLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mesas" element={<MesasPage />} />
        <Route path="/eventos" element={<EventosPage />} />
      </Routes>
    </RestrictedAreaLayout>
  );
};

export default RestrictedArea;