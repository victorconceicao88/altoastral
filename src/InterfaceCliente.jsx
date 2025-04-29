import React, { useState, useEffect, createContext } from 'react';
import { ref, push, onValue, update } from 'firebase/database';
import { database } from './firebase';
import { 
  FiShoppingCart, 
  FiX, 
  FiCheck, 
  FiClock, 
  FiTruck, 
  FiHome, 
  FiCalendar, 
  FiCoffee, 
  FiMeh,
  FiPlus,
  FiMinus,
  FiInfo,
  FiStar,
  FiHeart,
  FiShare2,
  FiUser,
  FiMapPin,
  FiPhone,
  FiEdit2,
  FiCreditCard,
  FiLock,
  FiLogIn
} from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from './assets/logo-alto-astral.png';
import logoBackground from './assets/logo-alto-astral.png';

const logoWhite = logo;

// Mock images
const foodImages = {
  frangoCremoso: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  picanhaPremium: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  costelaRaiz: 'https://images.unsplash.com/photo-1598515214211-89d3c41ae87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  feijoada: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  hamburguer: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  batataFrita: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  pastel: 'https://images.unsplash.com/photo-1631853551243-ca3d3b769de3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  cafe: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  bebida: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  salgado: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  sobremesa: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  background: logoBackground 
};

// Componentes personalizados

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeArea, setActiveArea] = useState('all'); // 'internal', 'external', 'all'

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const ordersList = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setOrders(ordersList);
    });
  }, []);

  const filteredOrders = orders.filter(order => {
    // Filtro por tipo de pedido
    if (activeTab === 'all' && activeArea === 'all') return true;
    if (activeTab !== 'all' && activeArea === 'all') {
      return order.orderType === activeTab;
    }
    if (activeTab === 'all' && activeArea !== 'all') {
      if (order.orderType !== 'dine-in') return false;
      const tableNum = parseInt(order.tableNumber);
      return activeArea === 'internal' ? tableNum <= 8 : tableNum > 8;
    }
    if (order.orderType !== activeTab) return false;
    if (order.orderType !== 'dine-in') return true;
    
    const tableNum = parseInt(order.tableNumber);
    return activeArea === 'internal' ? tableNum <= 8 : tableNum > 8;
  });

  const updateOrderStatus = (orderId, status) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { status })
      .then(() => setSelectedOrder(null))
      .catch(error => console.error("Error updating order:", error));
  };

  const updateOrderItems = (orderId, newItems) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { items: newItems })
      .then(() => {
        const updatedOrder = {...selectedOrder, items: newItems};
        setSelectedOrder(updatedOrder);
      })
      .catch(error => console.error("Error updating order items:", error));
  };

  const deleteOrder = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, null)
      .then(() => setSelectedOrder(null))
      .catch(error => console.error("Error deleting order:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-astral to-astral-dark text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel de Pedidos</h1>
          <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg">
            Voltar ao Cardápio
          </Link>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'all' ? 'bg-astral text-white' : 'bg-gray-100'}`}
              >
                Todos os Pedidos
              </button>
              <button
                onClick={() => setActiveTab('dine-in')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'dine-in' ? 'bg-astral text-white' : 'bg-gray-100'}`}
              >
                No Restaurante
              </button>
              <button
                onClick={() => setActiveTab('takeaway')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'takeaway' ? 'bg-astral text-white' : 'bg-gray-100'}`}
              >
                Retirada
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'delivery' ? 'bg-astral text-white' : 'bg-gray-100'}`}
              >
                Entrega
              </button>
            </div>
            
            {activeTab === 'dine-in' && (
              <div className="flex overflow-x-auto space-x-2 pb-2">
                <button
                  onClick={() => setActiveArea('all')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeArea === 'all' ? 'bg-astral text-white' : 'bg-gray-100'}`}
                >
                  Todas as Mesas
                </button>
                <button
                  onClick={() => setActiveArea('internal')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeArea === 'internal' ? 'bg-astral text-white' : 'bg-gray-100'}`}
                >
                  Sala Interna (1-8)
                </button>
                <button
                  onClick={() => setActiveArea('external')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeArea === 'external' ? 'bg-astral text-white' : 'bg-gray-100'}`}
                >
                  Esplanada (9-16)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de Mesas/Áreas */}
          {activeTab === 'dine-in' && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">
                {activeArea === 'all' ? 'Todas as Mesas' : 
                 activeArea === 'internal' ? 'Sala Interna (1-8)' : 'Esplanada (9-16)'}
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(16)].map((_, i) => {
                  const tableNum = i + 1;
                  // Filtra apenas mesas da área ativa
                  if (activeArea === 'internal' && tableNum > 8) return null;
                  if (activeArea === 'external' && tableNum <= 8) return null;
                  
                  const tableOrders = orders.filter(
                    o => o.orderType === 'dine-in' && o.tableNumber == tableNum && o.status !== 'completed'
                  );
                  
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (tableOrders.length > 0) {
                          setSelectedOrder(tableOrders[0]);
                        }
                      }}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 ${
                        tableOrders.length > 0 ? 
                          (tableOrders[0].status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : 
                           tableOrders[0].status === 'ready' ? 'bg-green-100 text-green-800' : 
                           'bg-red-100 text-red-800') : 
                          'bg-gray-100'
                      }`}
                    >
                      <span className="font-bold">{tableNum}</span>
                      <span className="text-xs">
                        {tableOrders.length > 0 ? 
                          (tableOrders[0].status === 'preparing' ? 'Preparando' : 
                           tableOrders[0].status === 'ready' ? 'Pronto' : 
                           'Pendente') : 
                          'Livre'}
                      </span>
                      {tableOrders.length > 0 && (
                        <span className="text-xs mt-1 bg-black/10 px-1 rounded">
                          {tableOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)} itens
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lista de Pedidos */}
          <div className={`bg-white rounded-xl shadow-md p-4 ${activeTab === 'dine-in' ? 'md:col-span-1' : 'md:col-span-2'}`}>
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'dine-in' ? 'Pedidos no Restaurante' : 
               activeTab === 'takeaway' ? 'Pedidos para Retirada' : 
               activeTab === 'delivery' ? 'Pedidos para Entrega' : 
               'Todos os Pedidos'}
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredOrders
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(order => (
                  <motion.div 
                    key={order.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      order.status === 'preparing' ? 'border-yellow-300 bg-yellow-50' : 
                      order.status === 'ready' ? 'border-green-300 bg-green-50' : 
                      order.status === 'completed' ? 'border-gray-300 bg-gray-50' : 
                      'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">
                          {order.orderType === 'dine-in' ? `Mesa ${order.tableNumber}` : 
                           order.orderType === 'takeaway' ? 'Retirada' : 'Entrega'}
                        </h3>
                        <p className="text-sm">
                          {new Date(order.timestamp).toLocaleTimeString()} - {order.customer.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">€{order.total.toFixed(2)}</span>
                        <div className="text-xs capitalize">
                          {order.status === 'pending' ? 'pendente' : 
                           order.status === 'preparing' ? 'preparando' : 
                           order.status === 'ready' ? 'pronto' : 'concluído'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {order.items.length} itens
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Detalhes do Pedido */}
          <div className="bg-white rounded-xl shadow-md p-4">
            {selectedOrder ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {selectedOrder.orderType === 'dine-in' ? `Mesa ${selectedOrder.tableNumber}` : 
                     selectedOrder.orderType === 'takeaway' ? 'Retirada' : 'Entrega'}
                  </h2>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold">Cliente</h3>
                  <p>{selectedOrder.customer.name}</p>
                  <p>{selectedOrder.customer.phone}</p>
                  {selectedOrder.orderType === 'delivery' && (
                    <p>{selectedOrder.customer.address}</p>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold">Itens</h3>
                  <div className="space-y-2 mt-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          {item.notes && (
                            <p className="text-xs text-gray-500">Obs: {item.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-4">€{(item.price * item.quantity).toFixed(2)}</span>
                          {selectedOrder.status === 'pending' && selectedOrder.orderType === 'dine-in' && (
                            <button 
                              onClick={() => {
                                const newItems = selectedOrder.items.filter((_, idx) => idx !== i);
                                updateOrderItems(selectedOrder.id, newItems);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>€{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedOrder.customer.notes && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold">Observações</h3>
                    <p>{selectedOrder.customer.notes}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                        className={`py-2 rounded-lg ${
                          selectedOrder.status === 'pending' ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Pendente
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                        className={`py-2 rounded-lg ${
                          selectedOrder.status === 'preparing' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Preparando
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                        className={`py-2 rounded-lg ${
                          selectedOrder.status === 'ready' ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Pronto
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="flex-1 py-2 bg-gray-800 text-white rounded-lg"
                    >
                      Marcar como Concluído
                    </button>
                    
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
                            deleteOrder(selectedOrder.id);
                          }
                        }}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Selecione um pedido para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const Typography = {
  H1: ({ children, className = '' }) => (
    <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${className}`}>
      {children}
    </h1>
  ),
  H2: ({ children, className = '' }) => (
    <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${className}`}>
      {children}
    </h2>
  ),
  H3: ({ children, className = '' }) => (
    <h3 className={`text-2xl md:text-3xl font-semibold ${className}`}>
      {children}
    </h3>
  ),
  Subtitle: ({ children, className = '' }) => (
    <p className={`text-lg text-opacity-80 ${className}`}>
      {children}
    </p>
  ),
  Body: ({ children, className = '' }) => (
    <p className={`text-base ${className}`}>
      {children}
    </p>
  ),
  Caption: ({ children, className = '' }) => (
    <p className={`text-sm opacity-75 ${className}`}>
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
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    outline: 'border border-astral text-astral hover:bg-astral/10',
    ghost: 'hover:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
  };

  const sizes = {
    small: 'py-1.5 px-3 text-sm',
    medium: 'py-2.5 px-5',
    large: 'py-3.5 px-7 text-lg'
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -2, scale: 1.02 } : {}}
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

const Card = ({ children, className = '', hoverEffect = true }) => {
  return (
    <motion.div 
      whileHover={hoverEffect ? { y: -5 } : {}}
      className={`
        bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 
        hover:shadow-md transition-all duration-300 ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-astral/10 text-astral',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Rating = ({ value, max = 5, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(max)].map((_, i) => (
        <FiStar 
          key={i} 
          className={`w-4 h-4 ${i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

const Notification = ({ message, type = 'info', onClose }) => {
  const bgColors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <FiX />
      </button>
    </motion.div>
  );
};

const Footer = ({ showAdminButton = true }) => {
  return (
    <footer className="relative bg-[#F5F0E6] text-[#5C4B3A] pt-20 pb-12">
      {/* Container da onda com duas "montanhas" grandes */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
        <svg 
          viewBox="0 0 1200 200" 
          preserveAspectRatio="none" 
          className="absolute top-0 left-0 w-full h-full"
        >
          {/* Onda com duas montanhas pronunciadas - SEM preenchimento acima */}
          <path 
            d="M0,120 
               C300,-40 500,200 600,80 
               C700,-40 900,200 1200,80
               L1200,200 L0,200 Z" 
            fill="none" 
            stroke="#8B7252" 
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Conteúdo principal - COMEÇA ABAIXO DA ONDA */}
      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Bloco de contato */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">Alto Astral</h3>
            <p className="text-[#8B7D6B] italic mb-6">Snack Bar & Restaurante</p>
            
            <div className="space-y-3">
              <p className="flex items-center justify-center md:justify-start">
                <FiMapPin className="mr-3 text-[#8B7252]"/>
                Rua Agostinho da Silva, loja 2
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <FiPhone className="mr-3 text-[#8B7252]"/>
                (+351) 282 038 830
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <FiClock className="mr-3 text-[#8B7252]"/>
                8:30 - 20h • Seg-Sáb
              </p>
            </div>
          </div>

          {/* Destaque de horário */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-[#F8F4EC] border border-[#D9C7B8] rounded-lg p-6 text-center max-w-xs">
              <FiClock className="mx-auto text-[#8B7252]"/>
              <h4 className="text-xl font-semibold mt-3 mb-2">Horário</h4>
              <p className="font-medium">8:30 - 20:00</p>
              <p className="text-sm text-[#8B7D6B] mt-2">Encomendas até 19:30</p>
            </div>
          </div>

          {/* Redes sociais */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-5">Siga-nos</h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#" className="p-3 border border-[#D9C7B8] rounded-full hover:border-[#8B7252] transition-colors">
                <svg className="w-5 h-5 text-[#5C4B3A]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="p-3 border border-[#D9C7B8] rounded-full hover:border-[#8B7252] transition-colors">
                <svg className="w-5 h-5 text-[#5C4B3A]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
            </div>

            {showAdminButton && (
              <div className="mt-8">
                <Link to="/login" className="inline-flex items-center text-[#5C4B3A] hover:text-[#8B7252] transition-colors">
                  <FiLock className="mr-2"/> Área Restrita
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-[#D9C7B8] mt-12 pt-6 text-center text-sm text-[#8B7D6B]">
          © {new Date().getFullYear()} Alto Astral • Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
};
const InterfaceCliente = () => {
  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState('semana');
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('menu');
  const [deliveryOption, setDeliveryOption] = useState('takeaway');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const controls = useAnimation();
  const [tableNumber, setTableNumber] = useState(null);
  const [orderType, setOrderType] = useState(null); // 'dine-in', 'takeaway', 'delivery'
  
  // Verificar parâmetros da URL para mesa
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const table = queryParams.get('table');
    if (table) {
      setTableNumber(table);
      setOrderType('dine-in');
    }
  }, []);

  // Verificar se o admin está logado ao carregar a página
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAdminLoggedIn(loggedIn);
  }, []);
  // Menu Data
  const menu = {
    semana: [
      { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: foodImages.frangoCremoso, rating: 4.5 },
      { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: foodImages.picanhaPremium, rating: 4.8 },
      { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: foodImages.costelaRaiz, rating: 4.7 },
      { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: foodImages.frangoCremoso, rating: 4.3 },
      { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: foodImages.feijoada, rating: 4.9 },
      { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: foodImages.frangoCremoso, rating: 4.2 }
    ],
    lanches: [
      { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: foodImages.hamburguer, rating: 4.4 },
      { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: foodImages.hamburguer, rating: 4.7 },
      { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: foodImages.hamburguer, rating: 4.9 },
      { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: foodImages.hamburguer, rating: 4.1 },
      { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.hamburguer, rating: 4.0 },
      { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: foodImages.hamburguer, rating: 3.9 }
    ],
    porcoes: [
      { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: foodImages.batataFrita, rating: 4.2 },
      { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: foodImages.batataFrita, rating: 4.6 },
      { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.batataFrita, rating: 4.5 },
      { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.4 },
      { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.7 },
      { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: foodImages.batataFrita, rating: 4.8 },
      { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: foodImages.batataFrita, rating: 4.3 }
    ],
    pasteis: [
      { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: foodImages.pastel, rating: 4.3 },
      { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: foodImages.pastel, rating: 4.5 },
      { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: foodImages.pastel, rating: 4.7 },
      { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: foodImages.pastel, rating: 4.4 },
      { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: foodImages.pastel, rating: 4.6 },
      { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: foodImages.pastel, rating: 4.2 },
      { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: foodImages.pastel, rating: 4.1 },
      { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: foodImages.pastel, rating: 4.0 },
      { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: foodImages.pastel, rating: 4.8 },
      { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: foodImages.pastel, rating: 4.7 },
      { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: foodImages.pastel, rating: 4.9 }
    ],
    cafe: [
      { id: 31, name: 'Café Expresso', price: 1.00, image: foodImages.cafe, rating: 4.5 },
      { id: 32, name: 'Café Descafeinado', price: 1.00, image: foodImages.cafe, rating: 4.3 },
      { id: 33, name: 'Café Duplo', price: 2.00, image: foodImages.cafe, rating: 4.6 },
      { id: 34, name: 'Garoto', price: 1.00, image: foodImages.cafe, rating: 4.2 },
      { id: 35, name: 'Abatanado', price: 1.10, image: foodImages.cafe, rating: 4.1 },
      { id: 36, name: 'Meia de Leite', price: 1.50, image: foodImages.cafe, rating: 4.4 },
      { id: 37, name: 'Galão', price: 1.60, image: foodImages.cafe, rating: 4.5 },
      { id: 38, name: 'Chá', price: 1.60, image: foodImages.cafe, rating: 4.0 },
      { id: 39, name: 'Cappuccino', price: 3.00, image: foodImages.cafe, rating: 4.7 },
      { id: 40, name: 'Caricoa de Limão', price: 1.00, image: foodImages.cafe, rating: 3.9 },
      { id: 41, name: 'Chocolate Quente', price: 3.00, image: foodImages.cafe, rating: 4.8 },
      { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: foodImages.cafe, rating: 4.3 },
      { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: foodImages.cafe, rating: 4.1 },
      { id: 44, name: 'Meia Torrada', price: 1.00, image: foodImages.cafe, rating: 4.0 },
      { id: 45, name: 'Croissant Misto', price: 3.00, image: foodImages.cafe, rating: 4.6 },
      { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: foodImages.cafe, rating: 4.7 },
      { id: 47, name: 'Tosta Mista', price: 3.20, image: foodImages.cafe, rating: 4.5 },
      { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: foodImages.cafe, rating: 4.4 },
      { id: 49, name: 'Sandes Mista', price: 2.20, image: foodImages.cafe, rating: 4.2 },
      { id: 50, name: 'Pão com Ovo', price: 2.20, image: foodImages.cafe, rating: 4.1 },
      { id: 51, name: 'Ovos com Bacon', price: 4.00, image: foodImages.cafe, rating: 4.7 }
    ],
    bebidas: [
      { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: foodImages.bebida, rating: 4.8 },
      { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: foodImages.bebida, rating: 4.9 },
      { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: foodImages.bebida, rating: 4.7 },
      { id: 55, name: 'Whiskey J&B', price: 3.00, image: foodImages.bebida, rating: 4.5 },
      { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: foodImages.bebida, rating: 4.8 },
      { id: 57, name: 'Whiskey Black Label', price: 4.00, image: foodImages.bebida, rating: 4.9 },
      { id: 58, name: 'Vodka', price: 4.00, image: foodImages.bebida, rating: 4.6 },
      { id: 59, name: 'Somersby', price: 2.50, image: foodImages.bebida, rating: 4.4 },
      { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: foodImages.bebida, rating: 4.5 },
      { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: foodImages.bebida, rating: 4.7 },
      { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: foodImages.bebida, rating: 4.3 },
      { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: foodImages.bebida, rating: 4.2 },
      { id: 64, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: foodImages.bebida, rating: 4.8 },
      { id: 65, name: 'Refrigerante Lata', price: 1.60, image: foodImages.bebida, rating: 4.1 },
      { id: 66, name: 'Água 1.5L', price: 1.50, image: foodImages.bebida, rating: 4.0 },
      { id: 67, name: 'Água 0.5L', price: 1.00, image: foodImages.bebida, rating: 4.0 },
      { id: 68, name: 'Água 0.33L', price: 0.60, image: foodImages.bebida, rating: 4.0 },
      { id: 69, name: 'Água Castelo', price: 1.40, image: foodImages.bebida, rating: 4.2 },
      { id: 70, name: 'Água das Pedras', price: 1.40, image: foodImages.bebida, rating: 4.3 }
    ],
    salgados: [
      { id: 71, name: 'Pão de Queijo', price: 1.60, image: foodImages.salgado, rating: 4.5 },
      { id: 72, name: 'Pastel de Nata', price: 1.30, image: foodImages.salgado, rating: 4.7 },
      { id: 73, name: 'Empada de Frango', price: 2.00, image: foodImages.salgado, rating: 4.4 },
      { id: 74, name: 'Kibe', price: 2.20, image: foodImages.salgado, rating: 4.3 },
      { id: 75, name: 'Fiambre e Queijo', price: 2.20, image: foodImages.salgado, rating: 4.2 },
      { id: 76, name: 'Bauru', price: 2.20, image: foodImages.salgado, rating: 4.1 },
      { id: 77, name: 'Bola de Queijo', price: 2.20, image: foodImages.salgado, rating: 4.3 },
      { id: 78, name: 'Coxinha de Frango', price: 2.20, image: foodImages.salgado, rating: 4.6 },
      { id: 79, name: 'Coxinha com Catupiry', price: 3.00, image: foodImages.salgado, rating: 4.8 },
      { id: 80, name: 'Hamburgão', price: 3.50, image: foodImages.salgado, rating: 4.7 }
    ],
    sobremesas: [
      { id: 81, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 82, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: foodImages.sobremesa, rating: 4.9 },
      { id: 83, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: foodImages.sobremesa, rating: 4.7 },
      { id: 84, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 85, name: 'Cheesecake - Goiabada', price: 3.50, image: foodImages.sobremesa, rating: 4.7 },
      { id: 86, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: foodImages.sobremesa, rating: 4.8 },
      { id: 87, name: 'Brigadeiro Tradicional', price: 1.50, image: foodImages.sobremesa, rating: 4.6 },
      { id: 88, name: 'Brigadeiro Beijinho', price: 1.50, image: foodImages.sobremesa, rating: 4.5 },
      { id: 89, name: 'Brigadeiro Ninho', price: 2.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 90, name: 'Brigadeiro Paçoca', price: 2.00, image: foodImages.sobremesa, rating: 4.7 },
      { id: 91, name: 'Brigadeiro Morango', price: 2.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 92, name: 'Brigadeiro Churros', price: 2.00, image: foodImages.sobremesa, rating: 4.9 },
      { id: 93, name: 'Tarte de Toblerone', price: 2.20, image: foodImages.sobremesa, rating: 4.7 },
      { id: 94, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: foodImages.sobremesa, rating: 4.8 }
    ]
  };
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id));
    }, 5000);
  };

  const addToCart = (item) => {
    const newItem = { 
      ...item, 
      id: Date.now() + item.id,
      quantity: 1
    };
    setCart([...cart, newItem]);
    addNotification(`${item.name} adicionado ao carrinho`, 'success');
    
    // Animação
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 }
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    addNotification('Item removido do carrinho', 'info');
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
    return subtotal + deliveryFee;
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleCheckout = async () => {
    const orderRef = ref(database, 'orders');
    const newOrder = {
      items: cart,
      customer: customerInfo,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : null,
      total: calculateTotal(),
      status: orderType === 'dine-in' ? 'pending' : 'received',
      timestamp: Date.now()
    };
  
    try {
      await push(orderRef, newOrder);
      
      // Enviar para WhatsApp apenas para retirada/entrega
      if (orderType !== 'dine-in') {
        const phoneNumber = '351933737672';
        const message = `*Novo Pedido Alto Astral*%0A%0A` +
          `*Tipo:* ${orderType === 'takeaway' ? 'Retirada' : 'Entrega'}%0A` +
          `*Cliente:* ${customerInfo.name}%0A` +
          `*Telefone:* ${customerInfo.phone}%0A` +
          `*Endereço:* ${orderType === 'delivery' ? customerInfo.address : 'Retirada no local'}%0A` +
          `*Itens:*%0A${cart.map(item => `- ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})`).join('%0A')}%0A` +
          `*Taxa de Entrega:* €${orderType === 'delivery' ? '2.50' : '0.00'}%0A` +
          `*Total:* €${calculateTotal().toFixed(2)}%0A` +
          `*Observações:* ${customerInfo.notes || 'Nenhuma'}`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      }
      
      setCheckoutStep('confirmation');
      setCart([]);
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      addNotification('Erro ao enviar pedido. Tente novamente.', 'error');
    }
  };

  const filteredMenu = (category) => {
    const items = menu[category];
    if (!searchQuery) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const proceedToCheckout = () => {
    if (tableNumber) {
      setOrderType('dine-in');
      setCheckoutStep('customer-info');
    } else {
      setCheckoutStep('order-type');
    }
  };

  if (checkoutStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-astral to-astral-dark flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1 }}
            className="text-green-500 text-6xl mb-4 flex justify-center"
          >
            <FiCheck className="p-2 bg-green-100 rounded-full" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            {orderType === 'dine-in' ? 
              'Seu pedido foi recebido e será atendido em breve.' : 
              'Seu pedido foi recebido e está sendo preparado.'}
          </p>
          {orderType === 'dine-in' ? (
            <div className="mb-6 bg-astral/10 text-astral p-3 rounded-lg">
              <p className="flex items-center justify-center">
                <FiHome className="mr-2" /> Mesa {tableNumber}
              </p>
            </div>
          ) : (
            <div className="mb-6 bg-astral/10 text-astral p-3 rounded-lg">
              <p className="flex items-center justify-center">
                <FiClock className="mr-2" /> Tempo estimado: 30-45 minutos
              </p>
            </div>
          )}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCheckoutStep('menu')}
            className="bg-astral text-white px-6 py-3 rounded-lg hover:bg-astral-dark transition w-full"
          >
            Voltar ao Menu
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (checkoutStep === 'order-type') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCheckoutStep('menu')}
              className="mr-4 text-astral hover:text-astral-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Tipo de Pedido</h2>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-6 text-center">Como deseja receber seu pedido?</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOrderType('dine-in');
                  setCheckoutStep('customer-info');
                }}
                className={`p-6 rounded-xl border-2 transition-all ${orderType === 'dine-in' ? 'border-astral bg-astral/10 text-astral' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FiHome size={32} className={orderType === 'dine-in' ? 'text-astral' : 'text-gray-400'} />
                  <span className="text-lg font-medium">Comer no Restaurante</span>
                  <span className="text-sm text-gray-500">O pedido será enviado diretamente ao garçom</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOrderType('takeaway');
                  setCheckoutStep('customer-info');
                }}
                className={`p-6 rounded-xl border-2 transition-all ${orderType === 'takeaway' ? 'border-astral bg-astral/10 text-astral' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FiShoppingCart size={32} className={orderType === 'takeaway' ? 'text-astral' : 'text-gray-400'} />
                  <span className="text-lg font-medium">Retirar no Balcão</span>
                  <span className="text-sm text-gray-500">Será enviado por WhatsApp e ao painel</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOrderType('delivery');
                  setCheckoutStep('customer-info');
                }}
                className={`p-6 rounded-xl border-2 transition-all ${orderType === 'delivery' ? 'border-astral bg-astral/10 text-astral' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FiTruck size={32} className={orderType === 'delivery' ? 'text-astral' : 'text-gray-400'} />
                  <span className="text-lg font-medium">Entrega (+€2.50)</span>
                  <span className="text-sm text-gray-500">Será enviado por WhatsApp e ao painel</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'customer-info') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCheckoutStep(tableNumber ? 'menu' : 'order-type')}
              className="mr-4 text-astral hover:text-astral-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h2>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiShoppingCart className="mr-2 text-astral" />
              Resumo do Pedido
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0 right-0 bg-astral text-white text-xs px-1 rounded-bl-lg">
                        {item.quantity}x
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-500 hover:text-astral p-1"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="mx-2 w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-astral p-1"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Subtotal:</span>
                <span>€{(calculateTotal() - (orderType === 'delivery' ? 2.50 : 0)).toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Taxa de Entrega:</span>
                  <span>€2.50</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total:</span>
                <span className="text-astral">€{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {orderType === 'dine-in' ? <FiHome className="mr-2 text-astral" /> : 
               orderType === 'takeaway' ? <FiShoppingCart className="mr-2 text-astral" /> : 
               <FiTruck className="mr-2 text-astral" />}
              {orderType === 'dine-in' ? 'Informações da Mesa' : 
               orderType === 'takeaway' ? 'Informações para Retirada' : 
               'Informações para Entrega'}
            </h3>
 
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Nome *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Telefone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                    required
                  />
                </div>
              </div>
              {orderType === 'dine-in' && tableNumber && (
                <div>
                  <label className="block text-gray-700 mb-1">Mesa</label>
                  <input
                    type="text"
                    value={`Mesa ${tableNumber}`}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                </div>
              )}
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-gray-700 mb-1">Endereço *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-gray-700 mb-1">Observações</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <FiEdit2 className="text-gray-400" />
                  </div>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                    rows="3"
                    placeholder="Alguma observação sobre seu pedido?"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between sticky bottom-0 bg-white p-4 -mx-4 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckoutStep(tableNumber ? 'menu' : 'order-type')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Voltar
            </motion.button>
            <Button 
              onClick={handleCheckout}
              disabled={!customerInfo.name || !customerInfo.phone || (orderType === 'delivery' && !customerInfo.address)}
              className="bg-astral text-white px-6 py-3 rounded-lg hover:bg-astral-dark transition w-full"
            >
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification 
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de Especialidades */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img src={logo} alt="Alto Astral" className="h-10 mr-2" />
                  <h2 className="text-2xl font-bold text-astral">Especialidades</h2>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start bg-yellow-50 p-3 rounded-lg border border-yellow-100"
                >
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FiCalendar className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pastel</h3>
                    <p className="text-sm text-yellow-800">Todos os dias a partir das 15h</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start bg-green-50 p-3 rounded-lg border border-green-100"
                >
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FiCalendar className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Feijoada</h3>
                    <p className="text-sm text-green-800">Toda sexta-feira</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FiCoffee className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Café da Manhã na Sua Casa</h3>
                    <p className="text-sm text-blue-800">Encomende até às 22h do dia anterior</p>
                  </div>
                </motion.div>
              </div>
              <div className="mt-6 bg-astral/10 p-3 rounded-lg border border-astral/20">
                <p className="text-sm text-astral flex items-center">
                  <FiInfo className="mr-2" /> Não encontrou o que procura? Consulte nosso cardápio completo abaixo!
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(false)}
                className="mt-4 w-full bg-astral text-white py-3 rounded-lg hover:bg-astral-dark transition"
              >
                Ver Cardápio
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gradient-to-r from-astral to-astral-dark text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logoWhite} alt="Alto Astral" className="h-10 mr-2" />
            <h1 className="text-2xl font-bold hidden sm:block">Alto Astral</h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={proceedToCheckout}
              className="relative bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition backdrop-blur-sm"
              disabled={cart.length === 0}
            >
              <FiShoppingCart className="mr-2" />
              <span className="hidden sm:inline">Carrinho</span>
              {cart.length > 0 && (
                <motion.span 
                  animate={controls}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-20"></div>

        <img 
          src={foodImages.background} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-center z-10"
        />

        <div className="absolute inset-0 z-30 flex flex-col justify-center p-6 md:p-10">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white mb-2"
          >
            Sabor que Eleva seu Astral
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg md:text-xl max-w-lg"
          >
            Experimente nossos pratos especiais preparados com ingredientes frescos e muito amor.
          </motion.p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 z-30 relative">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar pratos, bebidas..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex space-x-1 p-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('semana')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'semana' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiCalendar className="mr-2" />
              Cardápio da Semana
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('lanches')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'lanches' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiCoffee className="mr-2" />
              Lanches
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('porcoes')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'porcoes' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiPlus className="mr-2" />
              Porções
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pasteis')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'pasteis' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiInfo className="mr-2" />
              Pasteis
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('cafe')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'cafe' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiCoffee className="mr-2" />
              Bom Dia
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('bebidas')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'bebidas' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiPlus className="mr-2" />
              Bebidas
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('salgados')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'salgados' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiInfo className="mr-2" />
              Salgados
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('sobremesas')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'sobremesas' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiCoffee className="mr-2" />
              Sobremesas
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="container mx-auto p-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'semana' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiCalendar className="mr-2 text-astral" />
                    Cardápio da Semana
                  </h2>
                  <Badge variant="primary">
                    Pratos principais
                  </Badge>
                </div>
                <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-start">
                  <FiInfo className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">Opção vegetariana sob consulta. Todos os pratos acompanham bebida e café.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('semana').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                        {item.veg && (
                          <Badge className="absolute top-2 left-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Vegetariano
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-xs text-gray-500 flex items-center">
                            <FiInfo className="mr-1" />
                            Adicionais: Feijão carioca, ovo, batata frita (+€1.50)
                          </div>
                          <Button
                            id={`add-${item.id}`}
                            onClick={() => addToCart(item)}
                            size="small"
                            className="flex-shrink-0"
                          >
                            <FiPlus className="mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}


            {activeTab === 'lanches' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiCoffee className="mr-2 text-astral" />
                    Lanches
                  </h2>
                  <Badge variant="primary">
                    Variedade de sanduíches
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('lanches').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'porcoes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiPlus className="mr-2 text-astral" />
                    Porções
                  </h2>
                  <Badge variant="primary">
                    Para compartilhar
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('porcoes').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pasteis' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiInfo className="mr-2 text-astral" />
                    Pasteis
                  </h2>
                  <Badge variant="primary">
                    Especialidade da casa
                  </Badge>
                </div>
                <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-start">
                  <FiInfo className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">Segunda a Sexta a partir das 15h | Sábado o dia todo</p>
                    <p className="text-sm text-blue-800 mt-1 font-semibold">Pasteis fritos na hora - saem quentinhos!</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('pasteis').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        {item.description && <p className="text-gray-600 text-sm mt-2">{item.description}</p>}
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-xs text-gray-500 flex items-center">
                            <FiInfo className="mr-1" />
                            Adicionais: Catupiry, cheddar, bacon ou milho (+€1.00)
                          </div>
                          <Button
                            id={`add-${item.id}`}
                            onClick={() => addToCart(item)}
                            size="small"
                            className="flex-shrink-0"
                          >
                            <FiPlus className="mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cafe' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiCoffee className="mr-2 text-astral" />
                    Bom Dia
                  </h2>
                  <Badge variant="primary">
                    Café da manhã
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('cafe').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        {item.description && <p className="text-gray-600 text-sm mt-2">{item.description}</p>}
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bebidas' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiPlus className="mr-2 text-astral" />
                    Bebidas
                  </h2>
                  <Badge variant="primary">
                    Refresque-se
                  </Badge>
                </div>
                <div className="mb-6 bg-gray-100 p-4 rounded-xl flex items-start">
                  <FiInfo className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">Todos os whiskeys e vodkas podem vir com ou sem gelo</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('bebidas').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        {item.description && <p className="text-gray-600 text-sm mt-2">{item.description}</p>}
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'salgados' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiInfo className="mr-2 text-astral" />
                    Salgados
                  </h2>
                  <Badge variant="primary">
                    Para lanches rápidos
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenu('salgados').map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        {item.description && <p className="text-gray-600 text-sm mt-2">{item.description}</p>}
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sobremesas' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiCoffee className="mr-2 text-astral" />
                    Sobremesas
                  </h2>
                  <Badge variant="primary">
                    Doces deliciosos
                  </Badge>
                </div>
                <div className="mb-6 bg-pink-50 p-4 rounded-xl border border-pink-200 flex items-start">
                  <FiInfo className="text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-pink-800 font-semibold">Doces feitos com amor para adoçar seu dia!</p>
                </div>
                
                <h3 className="font-bold text-xl mb-4 text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-astral" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Bolos no Pote (€4.00)
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {filteredMenu('sobremesas').slice(0, 4).map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{item.name}</h4>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <h3 className="font-bold text-xl mb-4 text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-astral" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Cheesecake
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {filteredMenu('sobremesas').slice(4, 6).map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{item.name}</h4>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <h3 className="font-bold text-xl mb-4 text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-astral" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Brigadeiros
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {filteredMenu('sobremesas').slice(6, 12).map(item => (
                    <Card key={item.id}>
                      <div className="relative h-32 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <span className="font-bold text-astral text-sm">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-3 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <h3 className="font-bold text-xl mb-4 text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-astral" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Outras Sobremesas
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMenu('sobremesas').slice(12).map(item => (
                    <Card key={item.id}>
                      <div className="relative h-48 overflow-hidden group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                        >
                          <FiHeart 
                            className={`w-5 h-5 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{item.name}</h4>
                          <span className="font-bold text-astral bg-astral/10 px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                        </div>
                        <Rating value={Math.round(item.rating)} className="my-1" />
                        <Button
                          id={`add-${item.id}`}
                          onClick={() => addToCart(item)}
                          size="small"
                          className="mt-4 w-full"
                        >
                          <FiPlus className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cart Sidebar (mobile) */}
      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 p-4 z-10"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={proceedToCheckout}
            className="w-full bg-astral text-white py-3 rounded-lg flex items-center justify-center"
          >
            <FiShoppingCart className="mr-2" />
            Ver Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            <span className="ml-2 font-bold">€{calculateTotal().toFixed(2)}</span>
          </motion.button>
        </motion.div>
      )}

      {/* Footer */}
      <Footer showAdminButton={!isAdminLoggedIn} />
    </div>
  );
};

export default InterfaceCliente;