import React, { useState, useEffect } from 'react';
import { 
  FiShoppingCart, FiClock, FiCheck, FiTruck, 
  FiHome, FiPieChart, FiSettings, FiPlus, FiEdit, FiTrash2,
  FiFilter, FiSearch, FiPrinter, FiDownload, FiRefreshCw, FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from './firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';
import logo from './assets/logo-alto-astral.png';

// Componentes UI Premium
const Typography = {
  H1: ({ children, className = '' }) => (
    <h1 className={`text-3xl md:text-4xl font-bold text-gray-800 ${className}`}>
      {children}
    </h1>
  ),
  H2: ({ children, className = '' }) => (
    <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 ${className}`}>
      {children}
    </h2>
  ),
  H3: ({ children, className = '' }) => (
    <h3 className={`text-xl md:text-2xl font-semibold text-gray-700 ${className}`}>
      {children}
    </h3>
  ),
  Subtitle: ({ children, className = '' }) => (
    <p className={`text-lg text-gray-500 ${className}`}>
      {children}
    </p>
  )
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-astral to-astral-dark text-white shadow-lg hover:shadow-astral/30',
    secondary: 'bg-gray-800 hover:bg-gray-900 text-white',
    outline: 'border border-astral text-astral hover:bg-astral/10',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white'
  };

  const sizes = {
    small: 'py-1.5 px-3 text-sm',
    medium: 'py-2.5 px-5',
    large: 'py-3.5 px-7 text-lg'
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="flex-shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="flex-shrink-0" />}
    </motion.button>
  );
};

const Card = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`
      bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 
      ${hoverEffect ? 'hover:shadow-md transition-all duration-300' : ''} ${className}
    `}>
      {children}
    </div>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-astral/10 text-astral',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    dark: 'bg-gray-800 text-white'
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    'recebido': { color: 'warning', text: 'Recebido' },
    'preparando': { color: 'info', text: 'Em Preparo' },
    'pronto': { color: 'success', text: 'Pronto' },
    'entregue': { color: 'dark', text: 'Entregue' },
    'cancelado': { color: 'danger', text: 'Cancelado' }
  };

  return <Badge variant={statusMap[status]?.color || 'default'}>{statusMap[status]?.text || status}</Badge>;
};

const Input = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400" />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent`}
          {...props}
        />
      </div>
    </div>
  );
};

const Select = ({ label, options, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-gray-700 mb-1">{label}</label>}
      <select
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent bg-white"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {children}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" form="modal-form">
                Confirmar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BackButton = ({ onClick, className = '' }) => (
  <Button 
    variant="ghost" 
    icon={FiArrowLeft} 
    onClick={onClick}
    className={`mb-4 ${className}`}
  >
    Voltar
  </Button>
);

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'semana',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  });

  // Função para enviar notificação via WhatsApp
  const sendWhatsAppNotification = (order, newStatus) => {
    const phone = order.customer?.phone;
    if (!phone) return;

    const cleanedPhone = phone.replace(/\D/g, '');
    
    let message = '';
    if (newStatus === 'preparando') {
      message = `Olá ${order.customer?.name || 'cliente'}! Seu pedido #${order.id.slice(0, 6)} está sendo preparado. Agradecemos pela preferência!`;
    } else if (newStatus === 'pronto') {
      message = `Olá ${order.customer?.name || 'cliente'}! Seu pedido #${order.id.slice(0, 6)} está pronto para ${order.delivery === 'entrega' ? 'entrega' : 'retirada'}.`;
    }

    if (message) {
      const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Função para imprimir pedido na impressora Bluetooth
  const printToBluetoothPrinter = async (order) => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    setPrintError(null);

    try {
      if (!navigator.bluetooth) {
        throw new Error('Seu navegador não suporta Bluetooth ou a página não está em HTTPS');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "BlueTooth Printer" }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      const printContent = `
      \x1B\x40\x1B\x61\x01\x1B\x21\x30ALTO ASTRAL\x1B\x21\x00\x1B\x61\x00
      \x1B\x61\x01\x1B\x21\x10PEDIDO #${order.id.slice(0, 6)}\x1B\x21\x00\x1B\x61\x00
      \x1B\x21\x08Data: ${new Date(order.timestamp).toLocaleString()}\x1B\x21\x00
      ${'-'.repeat(32)}
      \x1B\x21\x08Cliente: ${order.customer?.name || 'Não informado'}\x1B\x21\x00
      Telefone: ${order.customer?.phone || 'Não informado'}
      Tipo: ${order.delivery === 'entrega' ? 'ENTREGA' : 'RETIRADA'}
      ${'-'.repeat(32)}
      \x1B\x45\x01ITENS DO PEDIDO\x1B\x45\x00
      ${order.items.map(item => `
      ${item.quantity}x ${item.name}
      €${(item.price * item.quantity).toFixed(2)}
      `).join('')}
      ${'-'.repeat(32)}
      Subtotal: €${(order.total - (order.delivery === 'entrega' ? 2.5 : 0)).toFixed(2)}
      Taxa Entrega: €${order.delivery === 'entrega' ? '2.50' : '0.00'}
      \x1B\x45\x01TOTAL: €${order.total.toFixed(2)}\x1B\x45\x00
      ${'-'.repeat(32)}
      \x1B\x21\x08Observações:\x1B\x21\x00
      ${order.customer?.notes || 'Nenhuma observação'}
      ${'-'.repeat(32)}
      \x1B\x61\x01\x1B\x21\x10STATUS: ${order.status.toUpperCase()}\x1B\x21\x00\x1B\x61\x00
      \x1B\x61\x01Obrigado pela preferência!\x1B\x61\x00
      \x1B\x69\x1B\x4A\xC0
      `;

      const encoder = new TextEncoder();
      const maxChunkSize = 512;
      
      for (let i = 0; i < printContent.length; i += maxChunkSize) {
        const chunk = printContent.slice(i, i + maxChunkSize);
        await characteristic.writeValue(encoder.encode(chunk));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setIsPrinting(false);
      alert(`✅ Pedido #${order.id.slice(0, 6)} impresso com sucesso!`);

    } catch (error) {
      setIsPrinting(false);
      setPrintError(error.message);
      
      console.error('Erro detalhado na impressão:', error);
      
      alert(`❌ Falha na impressão:\n${error.message}\n\nSoluções possíveis:
      1. Certifique-se que a impressora está ligada e visível
      2. Verifique o pareamento Bluetooth
      3. Conecte-se via HTTPS (obrigatório)
      4. Tente novamente após fechar este alerta`);
    }
  };

  const PrintButton = ({ order }) => (
    <Button
      variant="outline"
      icon={FiPrinter}
      onClick={(e) => {
        e.stopPropagation();
        printToBluetoothPrinter(order);
      }}
      disabled={isPrinting}
      className="mr-2"
    >
      {isPrinting ? 'Imprimindo...' : 'Imprimir'}
    </Button>
  );

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = ref(database, `orders/${orderId}`);
    
    try {
      await update(orderRef, { status: newStatus });

      const order = orders.find(o => o.id === orderId);

      if (order) {
        if (newStatus === 'preparando' || newStatus === 'pronto') {
          await sendWhatsAppNotification(order, newStatus);
        }
        
        if (newStatus === 'preparando') {
          await printToBluetoothPrinter(order);
        }
      } else {
        console.error("Pedido não encontrado");
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Fetch data
  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    const menuRef = ref(database, 'menu');

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          customer: data[key].customer || { name: 'Cliente não informado', phone: '' }
        }));
        setOrders(ordersArray.reverse());
      } else {
        setOrders([]);
      }
    });

    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const menuArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMenuItems(menuArray);
      } else {
        setMenuItems([]);
      }
    });
  }, []);

  // Delete order
  const deleteOrder = (orderId) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      const orderRef = ref(database, `orders/${orderId}`);
      remove(orderRef);
    }
  };

  // Add new menu item
  const addMenuItem = () => {
    const menuRef = ref(database, 'menu');
    push(menuRef, newMenuItem);
    setIsAddItemModalOpen(false);
    setNewMenuItem({
      name: '',
      description: '',
      price: '',
      category: 'semana',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchQuery === '' || 
      (order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'recebido').length,
    preparingOrders: orders.filter(o => o.status === 'preparando').length,
    readyOrders: orders.filter(o => o.status === 'pronto').length,
    todayRevenue: orders
      .filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
      .reduce((sum, order) => sum + (order.total || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <img src={logo} alt="Alto Astral" className="h-10" />
            <span className="ml-2 text-xl font-bold text-gray-800">Alto Astral</span>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-4 py-3 rounded-lg w-full transition ${activeTab === 'dashboard' ? 'bg-astral/10 text-astral font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiPieChart className="mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center px-4 py-3 rounded-lg w-full transition ${activeTab === 'orders' ? 'bg-astral/10 text-astral font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiShoppingCart className="mr-3" />
                Pedidos
                {orders.filter(o => o.status === 'recebido').length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {orders.filter(o => o.status === 'recebido').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center px-4 py-3 rounded-lg w-full transition ${activeTab === 'menu' ? 'bg-astral/10 text-astral font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiSettings className="mr-3" />
                Cardápio
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button className="md:hidden mr-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'orders' && 'Gerenciar Pedidos'}
                {activeTab === 'menu' && 'Gerenciar Cardápio'}
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <Typography.H2>Visão Geral</Typography.H2>
                  <div className="flex space-x-2">
                    <Button variant="outline" icon={FiRefreshCw}>
                      Atualizar
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500 font-medium">Total Pedidos</h3>
                        <FiShoppingCart className="text-gray-400" />
                      </div>
                      <Typography.H1 className="mt-2">{stats.totalOrders}</Typography.H1>
                      <p className="text-sm text-gray-500 mt-2">Desde o início</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500 font-medium">Pedidos Pendentes</h3>
                        <FiClock className="text-yellow-500" />
                      </div>
                      <Typography.H1 className="mt-2">{stats.pendingOrders}</Typography.H1>
                      <p className="text-sm text-gray-500 mt-2">Aguardando preparo</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500 font-medium">Em Preparo</h3>
                        <FiAlertCircle className="text-blue-500" />
                      </div>
                      <Typography.H1 className="mt-2">{stats.preparingOrders}</Typography.H1>
                      <p className="text-sm text-gray-500 mt-2">Na cozinha</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500 font-medium">Faturamento Hoje</h3>
                        <FiCheck className="text-green-500" />
                      </div>
                      <Typography.H1 className="mt-2">€{stats.todayRevenue.toFixed(2)}</Typography.H1>
                      <p className="text-sm text-gray-500 mt-2">Total do dia</p>
                    </div>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card className="mb-8">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Typography.H3>Pedidos Recentes</Typography.H3>
                      <Button variant="ghost" icon={FiPrinter}>
                        Imprimir
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrega</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.slice(0, 5).map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order.id?.slice(0, 6) || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.customer?.name || 'Cliente não informado'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.delivery === 'entrega' ? (
                                  <span className="flex items-center">
                                    <FiTruck className="mr-1" /> Entrega
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <FiHome className="mr-1" /> Retirada
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                €{(order.total || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status || 'recebido'} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  {order.status === 'recebido' && (
                                    <Button 
                                      size="small" 
                                      variant="success" 
                                      onClick={() => updateOrderStatus(order.id, 'preparando')}
                                    >
                                      <FiClock /> Preparar
                                    </Button>
                                  )}
                                  {order.status === 'preparando' && (
                                    <Button 
                                      size="small" 
                                      variant="success" 
                                      onClick={() => updateOrderStatus(order.id, 'pronto')}
                                    >
                                      <FiCheck /> Pronto
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <BackButton onClick={() => setActiveTab('dashboard')} />
                <div className="flex justify-between items-center mb-6">
                  <Typography.H2>Todos os Pedidos</Typography.H2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar pedidos..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'recebido', label: 'Recebidos' },
                        { value: 'preparando', label: 'Em Preparo' },
                        { value: 'pronto', label: 'Prontos' },
                        { value: 'entregue', label: 'Entregues' },
                        { value: 'cancelado', label: 'Cancelados' }
                      ]}
                      className="w-40"
                    />
                    <Button variant="outline" icon={FiDownload}>
                      Exportar
                    </Button>
                  </div>
                </div>

                <Card>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrega</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order.id?.slice(0, 6) || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.timestamp)?.toLocaleString() || 'Data inválida'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.customer?.name || 'Cliente não informado'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.customer?.phone || '--'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.delivery === 'entrega' ? (
                                  <span className="flex items-center">
                                    <FiTruck className="mr-1" /> Entrega
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <FiHome className="mr-1" /> Retirada
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                €{(order.total || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status || 'recebido'} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  {order.status === 'recebido' && (
                                    <Button 
                                      size="small" 
                                      variant="success" 
                                      onClick={() => updateOrderStatus(order.id, 'preparando')}
                                    >
                                      <FiClock /> Preparar
                                    </Button>
                                  )}
                                  {order.status === 'preparando' && (
                                    <Button 
                                      size="small" 
                                      variant="success" 
                                      onClick={() => updateOrderStatus(order.id, 'pronto')}
                                    >
                                      <FiCheck /> Pronto
                                    </Button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      setCurrentOrder(order);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="text-astral hover:text-astral-dark"
                                  >
                                    <FiEdit />
                                  </button>
                                  <button 
                                    onClick={() => deleteOrder(order.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                              Nenhum pedido encontrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div>
                <BackButton onClick={() => setActiveTab('dashboard')} />
                <div className="flex justify-between items-center mb-6">
                  <Typography.H2>Gerenciar Cardápio</Typography.H2>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setIsAddItemModalOpen(true)}
                      icon={FiPlus}
                    >
                      Adicionar Item
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map(item => (
                    <Card key={item.id} hoverEffect>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral">€{item.price}</span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                        )}
                        <div className="mt-4 flex justify-between items-center">
                          <Badge variant="primary">{item.category}</Badge>
                          <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-astral">
                              <FiEdit />
                            </button>
                            <button className="text-gray-500 hover:text-red-500">
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        </main>
      </div>

      {/* Edit Order Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title={`Pedido #${currentOrder?.id?.slice(0, 6) || ''}`}
        size="lg"
      >
        {currentOrder && (
          <form id="modal-form" onSubmit={(e) => {
            e.preventDefault();
            setIsEditModalOpen(false);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography.H3 className="mb-4">Informações do Cliente</Typography.H3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <p className="bg-gray-50 p-3 rounded-lg">{currentOrder.customer?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <p className="bg-gray-50 p-3 rounded-lg">{currentOrder.customer?.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <p className="bg-gray-50 p-3 rounded-lg">
                      {currentOrder.delivery === 'entrega' ? (currentOrder.customer?.address || 'Não informado') : 'Retirada no local'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <p className="bg-gray-50 p-3 rounded-lg">
                      {currentOrder.customer?.notes || 'Nenhuma observação'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Typography.H3 className="mb-4">Detalhes do Pedido</Typography.H3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select
                    value={currentOrder.status || 'recebido'}
                    onChange={(e) => {
                      setCurrentOrder({...currentOrder, status: e.target.value});
                      updateOrderStatus(currentOrder.id, e.target.value);
                    }}
                    options={[
                      { value: 'recebido', label: 'Recebido' },
                      { value: 'preparando', label: 'Em Preparo' },
                      { value: 'pronto', label: 'Pronto' },
                      { value: 'entregue', label: 'Entregue' },
                      { value: 'cancelado', label: 'Cancelado' }
                    ]}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Itens</label>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {(currentOrder.items || []).map((item, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity}x €{(item.price || 0).toFixed(2)}</p>
                        </div>
                        <p className="font-medium">€{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      €{((currentOrder.total || 0) - (currentOrder.delivery === 'entrega' ? 2.5 : 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Entrega:</span>
                    <span className="font-medium">
                      {currentOrder.delivery === 'entrega' ? '€2.50' : '€0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-astral">€{(currentOrder.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Menu Item Modal */}
      <Modal 
        isOpen={isAddItemModalOpen} 
        onClose={() => setIsAddItemModalOpen(false)}
        title="Adicionar Novo Item ao Cardápio"
      >
        <form id="modal-form" onSubmit={(e) => {
          e.preventDefault();
          addMenuItem();
        }}>
          <Input 
            label="Nome do Item" 
            value={newMenuItem.name}
            onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
            required
          />
          <Input 
            label="Descrição" 
            value={newMenuItem.description}
            onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
          />
          <Input 
            label="Preço" 
            type="number"
            step="0.01"
            value={newMenuItem.price}
            onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
            required
          />
          <Select
            label="Categoria"
            value={newMenuItem.category}
            onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
            options={[
              { value: 'semana', label: 'Cardápio da Semana' },
              { value: 'lanches', label: 'Lanches' },
              { value: 'porcoes', label: 'Porções' },
              { value: 'pasteis', label: 'Pasteis' },
              { value: 'cafe', label: 'Café da Manhã' },
              { value: 'bebidas', label: 'Bebidas' },
              { value: 'salgados', label: 'Salgados' },
              { value: 'sobremesas', label: 'Sobremesas' }
            ]}
          />
          <Input 
            label="URL da Imagem" 
            value={newMenuItem.image}
            onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;