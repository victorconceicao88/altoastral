import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiCalendar, 
  FiSettings, 
  FiLogOut, 
  FiArrowLeft,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo-alto-astral.png';

// 1. Componente do Botão Voltar Premium
const PremiumBackButton = ({ onClick }) => (
  <motion.button
    whileHover={{ x: -3 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200"
  >
    <FiArrowLeft className="text-lg" />
    <span className="font-medium">Voltar ao Painel</span>
  </motion.button>
);

// 2. Layout Principal Premium
const PremiumAdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-30 md:hidden"
          >
            <div className="p-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 mr-3" />
                <span className="text-xl font-bold">Alto Astral</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                <FiX className="text-xl" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <MobileSidebarButton icon={<FiSettings />} onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }} active>Admin</MobileSidebarButton>
              <MobileSidebarButton icon={<FiCalendar />} onClick={() => { navigate('/eventos'); setMobileMenuOpen(false); }}>Eventos</MobileSidebarButton>
              <MobileSidebarButton icon={<FiLogOut />} onClick={handleLogout}>Sair</MobileSidebarButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72 border-r border-gray-200 bg-white">
          <div className="p-5 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <img src={logo} alt="Logo" className="h-9 mr-3" />
            <span className="text-xl font-bold">Alto Astral</span>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

            <DesktopSidebarButton icon={<FiSettings />} onClick={() => navigate('/admin')} active>Admin</DesktopSidebarButton>
            <DesktopSidebarButton icon={<FiCalendar />} onClick={() => navigate('/eventos')}>Eventos</DesktopSidebarButton>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <DesktopSidebarButton icon={<FiLogOut />} onClick={handleLogout}>Sair</DesktopSidebarButton>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <FiMenu className="text-xl" />
            </button>
            <img src={logo} alt="Logo" className="h-8" />
            <div className="w-8"></div> {/* Spacer para alinhamento */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

const MobileSidebarButton = ({ icon, children, onClick, active = false }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
      active ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <span className={`text-xl ${active ? 'text-blue-500' : 'text-gray-500'}`}>{icon}</span>
    <span>{children}</span>
  </motion.button>
);

const DesktopSidebarButton = ({ icon, children, onClick, active = false }) => (
  <motion.button
    whileHover={{ x: 3 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
      active ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <span className={`text-lg ${active ? 'text-blue-500' : 'text-gray-500'}`}>{icon}</span>
    <span>{children}</span>
  </motion.button>
);

// 3. Páginas Premium
const PremiumDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">Visão geral do sistema</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PremiumDashboardCard 
            title="Administração" 
            description="Gerencie pedidos e configurações"
            icon={<FiSettings />}
            color="blue"
            onClick={() => navigate('/admin')}
          />
          <PremiumDashboardCard 
            title="Eventos" 
            description="Organize eventos especiais"
            icon={<FiCalendar />}
            color="purple"
            onClick={() => navigate('/eventos')}
          />
        </div>
      </div>
    </div>
  );
};

const PremiumDashboardCard = ({ title, description, icon, color, onClick }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    green: 'from-green-50 to-green-100 border-green-200 text-green-600',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 cursor-pointer hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`p-3 rounded-lg bg-white ${colorClasses[color].split(' ')[0].replace('from-', 'bg-')}`}>
          {React.cloneElement(icon, { className: 'text-xl' })}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-sm font-medium">
        <span>Acessar</span>
        <FiArrowLeft className="ml-1 transform rotate-180" />
      </div>
    </motion.div>
  );
};

const PremiumAdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administração</h1>
          <p className="text-gray-500">Gerencie todos os aspectos do restaurante</p>
        </div>
        <div className="flex justify-end">
          <PremiumBackButton onClick={() => navigate('/')} />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        {/* Conteúdo do AdminPanel aqui */}
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Interface de administração será renderizada aqui</p>
        </div>
      </div>
    </div>
  );
};



const PremiumEventosPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestão de Eventos</h1>
          <p className="text-gray-500">Organize eventos especiais</p>
        </div>
        <div className="flex justify-end">
          <PremiumBackButton onClick={() => navigate('/')} />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        {/* Conteúdo do InterfaceEventos aqui */}
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Interface de eventos será renderizada aqui</p>
        </div>
      </div>
    </div>
  );
};

// 4. Componente Principal Premium
const PremiumRestrictedArea = () => {
  return (
    <Routes>
      <Route element={<PremiumAdminLayout><Outlet /></PremiumAdminLayout>}>
        <Route index element={<PremiumDashboardPage />} />
        <Route path="admin" element={<PremiumAdminPage />} />
        <Route path="eventos" element={<PremiumEventosPage />} />
      </Route>
    </Routes>
  );
};

export default PremiumRestrictedArea;