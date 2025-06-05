/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { ref, push, update, database, loginAnonimo } from './firebase';
import { getDatabase, set, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import WelcomeModal from './components/welcomemodal';
import logo from './assets/logo-alto-astral.png';
import cafe from './assets/cafe.jpg';
import mbwayLogo from './assets/images.png';
import bitcoinLogo from './assets/bitcoin-logo.png';
import { foodImages, menu } from './data.js';
import { FiShoppingCart, FiX, FiCheck, FiClock, FiTruck, FiHome, FiCalendar, FiCoffee, FiMeh, FiPlus, FiMinus, FiInfo, FiStar, FiHeart, FiShare2, FiUser, FiMapPin, FiPhone, FiEdit2, FiCreditCard, FiMail} from 'react-icons/fi';
import { FaCalendarAlt, FaCoffee, FaHamburger, FaDrumstickBite, FaCocktail, FaIceCream, FaBitcoin, FaWhatsapp } from 'react-icons/fa';
import { GiMeal, GiSandwich, GiChickenOven, GiPieSlice, GiCoffeeCup, GiWineBottle, GiHotMeal, GiCakeSlice } from 'react-icons/gi';
import QRCode from 'react-qr-code';

const logoWhite = logo;

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    if (window.location.search.includes('force=1')) {
      window.location.reload(true); // Bypass total do cache
    }
  }, []);

  // Adicione no seu App.js para debug
  useEffect(() => {
    console.log('Versão atual:', new URLSearchParams(window.location.search).get('v'));
    if (!window.location.search.includes('v=')) {
      alert('ATENÇÃO: O sistema de cache não está funcionando!');
    }
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.orderType === activeTab;
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
      <header className="bg-gradient-to-r from-[#b0aca6] to-[#918e89] text-black p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel de Pedidos</h1>
          <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-black">
            Voltar ao Cardápio
          </Link>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'all' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
            >
              Todos os Pedidos
            </button>
            <button
              onClick={() => setActiveTab('takeaway')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'takeaway' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
            >
              Retirada
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'delivery' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
            >
              Entrega
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'takeaway' ? 'Pedidos para Retirada' : 
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
                          {order.orderType === 'takeaway' ? 'Retirada' : 'Entrega'}
                        </h3>
                        <p className="text-sm">
                          {new Date(order.timestamp).toLocaleTimeString()} - {order.customer.name || 'Sem nome'}
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

          <div className="bg-white rounded-xl shadow-md p-4">
            {selectedOrder ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {selectedOrder.orderType === 'takeaway' ? 'Retirada' : 'Entrega'}
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
                  <p>{selectedOrder.customer.name || 'Não informado'}</p>
                  {selectedOrder.customer.phone && <p>{selectedOrder.customer.phone}</p>}
                  {selectedOrder.orderType === 'delivery' && (
                    <p>{selectedOrder.customer.address || 'Não informado'}</p>
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

const InterfaceCliente = () => {
  const [activeTab, setActiveTab] = useState('semana');
  const [cart, setCart] = useState(() => {
    // Recupera o carrinho do localStorage se existir
    const savedCart = localStorage.getItem('altoAstralCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [checkoutStep, setCheckoutStep] = useState('menu');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    surname: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    reference: '',
    paymentMethod: '',
    changeFor: '',
    notes: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const controls = useAnimation();
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppLink, setWhatsAppLink] = useState('');
  const [countdown, setCountdown] = useState(40);
  const [orderType, setOrderType] = useState('takeaway');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOrderForWhatsApp, setSelectedOrderForWhatsApp] = useState(null);
  const [showBitcoinModal, setShowBitcoinModal] = useState(false);
  const [bitcoinPaymentLink, setBitcoinPaymentLink] = useState('https://coinos.io/AltoAstralBTC');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const currentHour = new Date().getHours();
  const isMenuClosed = currentHour >= 15;

  // Persistência do carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('altoAstralCart', JSON.stringify(cart));
  }, [cart]);

  // Verificar se admin está logado
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.isAnonymous === false) {
        setAdminLoggedIn(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      quantity: 1,
      notes: ''
    };
    setCart([...cart, newItem]);
    addNotification(`${item.name} pedido adicionado com sucesso`, 'success');
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

  const updateItemNotes = (id, notes) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, notes } : item
    ));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
    return subtotal + deliveryFee;
  };

  const toggleFavorite = (id) => {
    setFavorites(favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id]
    );
  };

  const handleCheckout = async () => {
    try {
      await loginAnonimo();
      
      const orderRef = ref(database, 'orders');
      const newOrder = {
        items: cart,
        customer: {
          name: customerInfo.name,
          surname: customerInfo.surname,
          phone: customerInfo.phone,
          address: orderType === 'delivery' ? customerInfo.address : null,
          postalCode: orderType === 'delivery' ? customerInfo.postalCode : null,
          city: orderType === 'delivery' ? customerInfo.city : null,
          reference: orderType === 'delivery' ? customerInfo.reference : null,
          notes: customerInfo.notes,
          paymentMethod: customerInfo.paymentMethod,
          changeFor: customerInfo.paymentMethod === 'cash' ? customerInfo.changeFor : null
        },
        orderType: orderType,
        total: calculateTotal(),
        status: 'pending',
        timestamp: Date.now()
      };

      if (newOrder.items.length === 0) {
        throw new Error('O carrinho está vazio');
      }
      
      if (orderType === 'delivery' && (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.postalCode || !customerInfo.city)) {
        throw new Error('Informações do cliente incompletas para entrega');
      }
      
      if (orderType === 'takeaway' && (!customerInfo.name || !customerInfo.phone)) {
        throw new Error('Informações do cliente incompletas para retirada');
      }

      const orderPush = await push(orderRef, newOrder);
      const orderId = orderPush.key;
      
      // Create WhatsApp message
      const phoneNumber = '351282038830';
      const message = `*Novo Pedido Alto Astral*%0A%0A` +
        `*Nº Pedido:* ${orderId}%0A` +
        `*Tipo:* ${orderType === 'takeaway' ? 'Retirada' : 'Entrega'}%0A` +
        `*Cliente:* ${customerInfo.name} ${customerInfo.surname}%0A` +
        `*Telefone:* ${customerInfo.phone}%0A` +
        (orderType === 'delivery' ? 
          `*Endereço:* ${customerInfo.address}%0A` +
          `*Código Postal:* ${customerInfo.postalCode}%0A` +
          `*Cidade:* ${customerInfo.city}%0A` +
          `*Referência:* ${customerInfo.reference}%0A` : '') +
        `*Itens:*%0A${cart.map(item => `- ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})${item.notes ? ` - Obs: ${item.notes}` : ''}`).join('%0A')}%0A` +
        `*Taxa de Entrega:* €${orderType === 'delivery' ? '2.50' : '0.00'}%0A` +
        `*Total:* €${calculateTotal().toFixed(2)}%0A` +
        `*Método de Pagamento:* ${customerInfo.paymentMethod || 'Não especificado'}%0A` +
        (customerInfo.paymentMethod === 'cash' && customerInfo.changeFor ? `*Troco para:* €${customerInfo.changeFor}%0A` : '') +
        `*Observações:* ${customerInfo.notes || 'Nenhuma'}`;
      
      setWhatsAppLink(`https://wa.me/${phoneNumber}?text=${message}`);
      
      if (customerInfo.paymentMethod === 'bitcoin') {
        setShowBitcoinModal(true);
        setBitcoinPaymentLink(`https://coinos.io/AltoAstralBTC?amount=${calculateTotal().toFixed(2)}&order=${orderId}`);
      } else {
        setShowWhatsAppModal(true);
        setCountdown(40);
        
        if (isMobile) {
          window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
        }
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      addNotification(error.message || 'Erro ao enviar pedido. Tente novamente.', 'error');
    }
  };

  useEffect(() => {
    let timer;
    if (showWhatsAppModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowWhatsAppModal(false);
      setCheckoutStep('confirmation');
      setCart([]);
      localStorage.removeItem('altoAstralCart');
    }
    return () => clearInterval(timer);
  }, [showWhatsAppModal, countdown]);

  // Adicione este useEffect junto com os outros hooks no início do componente
useEffect(() => {
  if (checkoutStep === 'cart-summary') {
    // Scroll para o topo quando entrar no resumo do carrinho
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [checkoutStep]);

const getWeeklyMenu = () => {
  const today = new Date().getDay(); // 0=Domingo, 1=Segunda, ..., 6=Sábado
  const weeklyMenu = [];
  
  // 1. Adiciona todos os pratos vegetarianos da semana
  const vegetarianDishes = menu.semana.filter(item => item.veg);
  weeklyMenu.push(...vegetarianDishes.map(dish => ({...dish})));
  
  // 2. Adiciona o prato do dia (se não for vegetariano já incluso)
  const dailySpecialName = getDailySpecialName(today);
  if (dailySpecialName) {
    const specialDish = menu.semana.find(item => 
      item.name.includes(dailySpecialName) && 
      !vegetarianDishes.some(vegDish => vegDish.id === item.id)
    );
    
    if (specialDish) {
      weeklyMenu.push({ ...specialDish, isDailySpecial: true });
    }
  }
  
  return weeklyMenu;
};

// Função auxiliar (mantida igual)
const getDailySpecialName = (day) => {
  switch(day) {
    case 1: return 'Frango Cremoso';
    case 2: return 'Maminha Top';
    case 3: return 'Costela Raiz';
    case 4: return 'Frango Supremo';
    case 5: return 'Feijoada Astral';
    case 6: return 'Especial do Chef';
    case 0: return 'Domingo Familiar';
    default: return null;
  }
};

const filteredMenu = (category) => {
  // 1. Obter os itens baseados na categoria
  let items;
  if (category === 'semana') {
    items = getWeeklyMenu();
  } else {
    items = menu[category] || [];
  }
  
  // 2. Aplicar filtro de busca se houver query
  if (!searchQuery) return items;
  
  return items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
};

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      addNotification('Adicione itens ao carrinho antes de prosseguir', 'error');
      return;
    }
    setCheckoutStep('cart-summary');
  };

  if (checkoutStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b0aca6] to-[#918e89] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1 }}
            className="text-[#84a66d] text-6xl mb-4 flex justify-center"
          >
            <FiCheck className="p-2 bg-green-100 rounded-full" />
          </motion.div>
          <h2 className="text-2xl font-bold text-black mb-2">Pedido Confirmado!</h2>
          <p className="text-black mb-6">
            Seu pedido foi recebido e está sendo preparado.
          </p>
          <div className="mb-6 bg-[#b0aca6]/10 text-[#e6be44] p-3 rounded-lg">
            <p className="flex items-center justify-center">
              <FiClock className="mr-2" /> Tempo estimado: {orderType === 'delivery' ? '30-45 minutos' : '15-20 minutos'}
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCheckoutStep('menu');
              navigate('/');
            }}
            className="bg-[#b0aca6] text-[#e6be44] px-6 py-3 rounded-lg hover:bg-[#a09c96] transition w-full"
          >
            Voltar ao Menu
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (checkoutStep === 'cart-summary') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-[#f8f5f0] p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="relative">
            <div className="h-2 bg-[#b0aca6] rounded-t-xl"></div>
            
            <div className="bg-white px-4 md:px-6 py-5 border-x border-gray-100">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCheckoutStep('menu')}
                  className="mr-3 p-2 rounded-lg bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-sans tracking-tight">
                    <span className="relative z-10">Seu Pedido</span>
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#e6be44]/30 z-0"></span>
                  </h2>
                  <div className="absolute -bottom-1 left-0 w-16 h-1 bg-[#e6be44] z-10"></div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="bg-white border-x border-gray-100 px-4 md:px-6 py-1">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-xl mb-6 mt-4"
            >
              <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center mb-4 md:mb-6 pb-4 border-b border-gray-100">
                  <div className="relative">
                    <div className="absolute -left-1 -top-1 w-10 h-10 md:w-12 md:h-12 bg-[#e6be44]/10 rounded-lg"></div>
                    <div className="relative z-10 bg-[#b0aca6] p-2 md:p-3 rounded-lg mr-3 md:mr-4 shadow-md">
                      <FiShoppingCart className="text-lg md:text-xl text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Resumo do Pedido</h3>
                    <p className="text-xs md:text-sm text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between items-start p-3 md:p-4 rounded-xl hover:bg-[#faf8f3] transition-colors border border-gray-100 shadow-xs"
                    >
                      <div className="flex-1 flex items-start">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden mr-3 md:mr-4 flex-shrink-0 border-2 border-[#e6be44]/30">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = cafe }}
                          />
                          <div className="absolute inset-0 bg-black/5"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm md:text-base text-gray-800">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            </div>
                            <span className="font-medium text-sm md:text-base text-gray-800 ml-2 md:ml-4 whitespace-nowrap">
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          
                          {item.notes && (
                            <div className="mt-2 bg-[#f8f5ed] rounded-lg px-2 py-1 md:px-3 md:py-2 border border-[#e6be44]/20">
                              <p className="text-xs text-gray-600 flex items-center">
                                <FiInfo className="mr-1 flex-shrink-0 text-[#e6be44]" /> 
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 md:space-x-2 ml-2 md:ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 md:p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <FiMinus size={12} className="md:size-[14px]" />
                        </motion.button>
                        <span className="text-xs md:text-sm font-medium w-6 md:w-8 text-center bg-white py-1 md:py-2 rounded-lg border border-gray-200">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 md:p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <FiPlus size={12} className="md:size-[14px]" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 md:pt-6">
                  <div className="space-y-3 md:space-y-4">
                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-sm md:text-base text-gray-600">
                        <span>Taxa de entrega</span>
                        <span>€2.50</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base md:text-lg text-gray-800 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-black">€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <div className="bg-white px-4 md:px-6 py-4 md:py-5 border-x border-b border-gray-100 rounded-b-xl">
              <div className="flex justify-between space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCheckoutStep('menu')}
                  className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-[#918e89] text-[#e6be44] font-bold transition-all text-sm md:text-base"
                >
                  Voltar ao Menu
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCheckoutStep('order-type')}
                  disabled={cart.length === 0}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all relative overflow-hidden text-sm md:text-base ${
                    cart.length === 0
                      ? 'bg-[#918e89] text-[#e6be44] cursor-not-allowed'
                      : 'bg-[#918e89] text-[#e6be44] font-bold'
                  }`}
                >
                  <span className="relative z-10 font-bold">Continuar</span>
                </motion.button>
              </div>
            </div>
            
            <div className="h-2 bg-[#b0aca6] rounded-b-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'order-type') {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="h-2 bg-[#b0aca6] rounded-t-xl"></div>
          
          <div className="bg-white border-x border-gray-100 px-4 md:px-6 py-6">
            <div className="flex items-center mb-6 md:mb-8">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCheckoutStep('cart-summary')} 
                className="mr-3 p-2 rounded-lg bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#b0aca6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <div className="relative">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-sans tracking-tight">
                  <span className="relative z-10">Tipo de Pedido</span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#e6be44]/30 z-0"></span>
                </h2>
                <div className="absolute -bottom-1 left-0 w-16 md:w-20 h-1 bg-[#e6be44] z-10"></div>
              </div>
            </div>

            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg lg:text-xl font-medium text-center text-gray-600 mb-6 md:mb-8 px-2 md:px-4"
            >
              Como deseja receber seu pedido?
            </motion.h3>
            
            <div className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: orderType === 'takeaway' ? "0 10px 25px -5px rgba(176, 172, 166, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setOrderType('takeaway');
                    setCheckoutStep('customer-info');
                  }}
                  className={`w-full p-4 md:p-6 rounded-xl transition-all relative overflow-hidden text-left ${
                    orderType === 'takeaway' 
                      ? 'border-2 border-[#b0aca6] bg-[#b0aca6]/10 shadow-md' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className={`p-2 md:p-3 rounded-lg ${orderType === 'takeaway' ? 'bg-[#b0aca6] text-white' : 'bg-gray-100 text-[#b0aca6]'}`}>
                      <FiShoppingCart size={20} className="md:size-6" />
                    </div>
                    <div>
                      <h4 className={`text-base md:text-lg font-semibold mb-1 ${orderType === 'takeaway' ? 'text-gray-800' : 'text-gray-700'}`}>
                        Retirar no Balcão
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">Pronto em 15-20 minutos</p>
                    </div>
                  </div>
                  {orderType === 'takeaway' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-[#b0aca6] text-white rounded-full p-1"
                    >
                      <FiCheck size={14} className="md:size-4" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: orderType === 'delivery' ? "0 10px 25px -5px rgba(176, 172, 166, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setOrderType('delivery');
                    setCheckoutStep('customer-info');
                  }}
                  className={`w-full p-4 md:p-6 rounded-xl transition-all relative overflow-hidden text-left ${
                    orderType === 'delivery' 
                      ? 'border-2 border-[#b0aca6] bg-[#b0aca6]/10 shadow-md' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className={`p-2 md:p-3 rounded-lg ${orderType === 'delivery' ? 'bg-[#b0aca6] text-white' : 'bg-gray-100 text-[#b0aca6]'}`}>
                      <FiTruck size={20} className="md:size-6" />
                    </div>
                    <div>
                      <h4 className={`text-base md:text-lg font-semibold mb-1 ${orderType === 'delivery' ? 'text-gray-800' : 'text-gray-700'}`}>
                        Entrega (+€2.50)
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">Entrega em 30-45 minutos</p>
                    </div>
                  </div>
                  {orderType === 'delivery' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-[#b0aca6] text-white rounded-full p-1"
                    >
                      <FiCheck size={14} className="md:size-4" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>

          <div className="h-2 bg-[#b0aca6] rounded-b-xl"></div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'customer-info') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-[#b0aca6] rounded-t-xl"></div>
          
          <div className="bg-white/90 backdrop-blur-sm border-x border-gray-100 px-4 md:px-6 py-6 md:py-8">
            <div className="flex items-center mb-6 md:mb-8">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#f5f5f5" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCheckoutStep('order-type')}
                className="mr-3 p-2 rounded-lg bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#b0aca6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <div className="relative">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-sans tracking-tight">
                  <span className="relative z-10">Confirmar Pedido</span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#b0aca6]/30 z-0"></span>
                </h2>
                <div className="absolute -bottom-1 left-0 w-20 md:w-24 h-1 bg-[#b0aca6] z-10"></div>
              </div>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#b0aca6]/10 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                    <FiShoppingCart className="text-lg md:text-xl text-[#b0aca6]" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    Resumo do Pedido
                  </h3>
                </div>
                
                <div className="space-y-2 max-h-48 md:max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start p-2 md:p-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm md:text-base text-gray-800">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium text-sm md:text-base text-gray-800">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-500 mt-1 flex items-start">
                            <FiInfo className="mr-1 mt-0.5 flex-shrink-0 text-[#b0aca6]" />
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 md:pt-4 mt-3 md:mt-4">
                  <div className="flex justify-between font-bold text-sm md:text-base text-gray-800">
                    <span>Total</span>
                    <span>€{calculateTotal().toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-xs md:text-sm text-gray-600 mt-1">
                      <span>Taxa de entrega</span>
                      <span>€2.50</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 md:mb-6"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-4 md:mb-6">
                  {orderType === 'takeaway' ? (
                    <div className="bg-[#b0aca6]/10 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                      <FiShoppingCart className="text-lg md:text-xl text-[#b0aca6]" />
                    </div>
                  ) : (
                    <div className="bg-[#b0aca6]/10 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                      <FiTruck className="text-lg md:text-xl text-[#b0aca6]" />
                    </div>
                  )}
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    {orderType === 'takeaway' ? 'Informações para Retirada' : 'Informações para Entrega'}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Nome *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full pl-10 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                          required
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Sobrenome *</label>
                      <input
                        type="text"
                        value={customerInfo.surname}
                        onChange={(e) => setCustomerInfo({...customerInfo, surname: e.target.value})}
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                        required
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Telemóvel *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full pl-10 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                        required
                        placeholder="Seu número de telefone"
                      />
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Código Postal *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMapPin className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={customerInfo.postalCode}
                              onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                              className="w-full pl-10 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                              required
                              placeholder="Ex: 8500-826"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Localidade *</label>
                          <input
                            type="text"
                            value={customerInfo.city}
                            onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                            required
                            placeholder="Sua cidade"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Endereço Completo *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMapPin className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            className="w-full pl-10 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                            required
                            placeholder="Rua, número, bairro, apartamento"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 md:mb-6"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="bg-[#b0aca6]/10 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                    <FiCreditCard className="text-lg md:text-xl text-[#b0aca6]" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">Método de Pagamento *</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'mbway'})}
                    className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                      customerInfo.paymentMethod === 'mbway' 
                        ? 'border-[#b0aca6] bg-[#b0aca6]/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={mbwayLogo} alt="MBWay" className="h-5 md:h-6 mb-1 md:mb-2" />
                    <span className="text-xs font-medium text-gray-700">MBWay</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'card'})}
                    className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                      customerInfo.paymentMethod === 'card' 
                        ? 'border-[#b0aca6] bg-[#b0aca6]/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FiCreditCard className={`text-lg md:text-xl mb-1 md:mb-2 ${
                      customerInfo.paymentMethod === 'card' ? 'text-[#b0aca6]' : 'text-gray-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-700">Cartão</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'cash'})}
                    className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                      customerInfo.paymentMethod === 'cash' 
                        ? 'border-[#b0aca6] bg-[#b0aca6]/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 md:h-5 md:w-5 mb-1 md:mb-2 ${
                        customerInfo.paymentMethod === 'cash' ? 'text-[#b0aca6]' : 'text-gray-500'
                      }`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Dinheiro</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'bitcoin'})}
                    className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                      customerInfo.paymentMethod === 'bitcoin' 
                        ? 'border-[#b0aca6] bg-[#b0aca6]/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FaBitcoin className={`text-lg md:text-xl mb-1 md:mb-2 ${
                      customerInfo.paymentMethod === 'bitcoin' ? 'text-[#F7931A]' : 'text-gray-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-700">Bitcoin</span>
                  </motion.button>
                </div>

                {customerInfo.paymentMethod === 'cash' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 md:mt-4"
                  >
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Troco para quanto? *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">€</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min={calculateTotal()}
                        value={customerInfo.changeFor}
                        onChange={(e) => setCustomerInfo({...customerInfo, changeFor: e.target.value})}
                        className="w-full pl-10 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                        required
                        placeholder="Valor que irá pagar"
                      />
                    </div>
                  </motion.div>
                )}

                {customerInfo.paymentMethod === 'bitcoin' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 md:mt-4 p-3 bg-[#f8f5ed] rounded-lg border border-[#e6be44]/20"
                  >
                    <p className="text-xs text-gray-600 flex items-start">
                      <FiInfo className="mr-2 mt-0.5 flex-shrink-0 text-[#e6be44]" />
                      Ao selecionar Bitcoin, você será redirecionado para nossa página de pagamentos cripto após confirmar o pedido.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 md:mb-6"
            >
              <div className="p-4 md:p-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Observações</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2 md:pt-3 pointer-events-none">
                    <FiEdit2 className="text-gray-400" />
                  </div>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="w-full pl-10 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b0aca6] focus:border-[#b0aca6] text-sm md:text-base"
                    rows="3"
                    placeholder="Alguma observação sobre seu pedido?"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <div className="bg-white px-4 md:px-6 py-4 border-x border-b border-gray-200 rounded-b-xl">
              <div className="flex justify-between space-x-3">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: "#f5f5f5"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCheckoutStep('order-type')}
                  className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-all text-sm md:text-base"
                >
                  Voltar
                </motion.button>
                <button
                  onClick={handleCheckout}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                  (orderType === 'delivery' && (
                    !customerInfo.name || 
                    !customerInfo.phone || 
                    !customerInfo.address || 
                    !customerInfo.postalCode || 
                    !customerInfo.city
                  )) ||
                  (orderType === 'takeaway' && (
                    !customerInfo.name || 
                    !customerInfo.phone
                  )) ||
                  !customerInfo.paymentMethod ||
                  cart.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#b0aca6] hover:bg-[#918e89] text-[#e6be44] cursor-pointer'
                }`}
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
            
            {/* Modal de Bitcoin */}
            {showBitcoinModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                        <FaBitcoin className="text-[#F7931A] mr-2" />
                        Pagamento com Bitcoin
                      </h3>
                      <button 
                        onClick={() => {
                          setShowBitcoinModal(false);
                          setCheckoutStep('confirmation');
                          setCart([]);
                          localStorage.removeItem('altoAstralCart');
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={20} className="md:size-6" />
                      </button>
                    </div>
                    
                    <div className="mb-4 md:mb-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="bg-[#F7931A]/10 p-4 rounded-lg">
                          <QRCode 
                            value={bitcoinPaymentLink}
                            size={160}
                            bgColor="transparent"
                            fgColor="#F7931A"
                            level="H"
                          />
                        </div>
                      </div>
                      
                      <p className="text-base md:text-lg mb-2">Escaneie o QR Code ou clique no link abaixo</p>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Valor: €{calculateTotal().toFixed(2)}</p>
                      
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={bitcoinPaymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#F7931A] hover:bg-[#e68a00] text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-base md:text-lg mb-4"
                      >
                        Pagar com Bitcoin
                      </motion.a>

                      <div className="bg-gray-100 p-3 md:p-4 rounded-lg mb-4">
                        <h4 className="font-medium mb-1 md:mb-2 text-sm md:text-base">Resumo do Pedido:</h4>
                        <ul className="space-y-1 text-xs md:text-sm">
                          {cart.map(item => (
                            <li key={item.id} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>€{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-gray-300 mt-2 pt-2 font-bold flex justify-between text-sm md:text-base">
                          <span>Total:</span>
                          <span>€{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (isMobile) {
                            window.location.href = whatsAppLink;
                          } else {
                            window.open(whatsAppLink, '_blank');
                          }
                          setShowBitcoinModal(false);
                          setCheckoutStep('confirmation');
                          setCart([]);
                          localStorage.removeItem('altoAstralCart');
                        }}
                        className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-base md:text-lg w-full"
                      >
                        <FaWhatsapp className="mr-2" />
                        Enviar Pedido para WhatsApp
                      </motion.button>

                      <p className="mt-3 text-xs text-gray-600">
                        Após realizar o pagamento, envie seu comprovante via WhatsApp.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Modal de WhatsApp (para outros métodos de pagamento) */}
            {showWhatsAppModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">Enviar Pedido via WhatsApp</h3>
                      <button 
                        onClick={() => {
                          setShowWhatsAppModal(false);
                          setCheckoutStep('confirmation');
                          setCart([]);
                          localStorage.removeItem('altoAstralCart');
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={20} className="md:size-6" />
                      </button>
                    </div>
                    
                    <div className="mb-4 md:mb-6 text-center">
                      <div className="text-4xl md:text-5xl mb-3 md:mb-4 flex justify-center">
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                        >
                          👆
                        </motion.div>
                      </div>
                      <p className="text-base md:text-lg mb-2">Clique no botão abaixo para enviar seu pedido</p>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Tempo restante: {countdown} segundos</p>
                      
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-base md:text-lg"
                      >
                        Enviar para WhatsApp
                      </motion.a>

                      <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-700">
                        📲 Ao clicar no botão, o WhatsApp será aberto automaticamente em outra aba. clicar em <strong>“Enviar”</strong> para concluir seu pedido.
                      </p>
                    </div>
                    
                    <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                      <h4 className="font-medium mb-1 md:mb-2 text-sm md:text-base">Resumo do Pedido:</h4>
                      <ul className="space-y-1 text-xs md:text-sm">
                        {cart.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>€{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-300 mt-2 pt-2 font-bold flex justify-between text-sm md:text-base">
                        <span>Total:</span>
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            <div className="h-2 bg-[#b0aca6] rounded-b-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
            
        <div className="notification-container">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`mb-2 px-4 py-3 rounded-lg shadow-md flex justify-between items-center text-sm ${
                  notification.type === 'error' ? 'bg-red-500' :
                  notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                } text-white`}
              >
                <span className="flex-1">{notification.message}</span>
                <button 
                  onClick={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
                  className="ml-3 focus:outline-none"
                >
                  <FiX size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      <header className="bg-white text-black shadow-lg sticky top-0 z-20">
        <div className="container mx-auto px-4 flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src={logo} alt="Alto Astral" className="h-16 md:h-20 lg:h-24 mr-2" />
          </div>
            <div className="flex items-center space-x-2 md:space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={proceedToCheckout}
              className="relative bg-white hover:bg-gray-100 p-2 md:px-4 md:py-2 rounded-lg flex items-center transition"
              disabled={cart.length === 0}
            >
              {/* Ajuste para o tamanho do ícone em dispositivos móveis */}
              <FiShoppingCart className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black" /> 
              <span className="hidden sm:inline text-black ml-1 md:ml-2">Carrinho</span>
              {cart.length > 0 && (
                <motion.span 
                  animate={controls}
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-black text-white text-xs rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center"
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}

                </motion.span>
              )}
            </motion.button>
        </div>
        </div>
      </header>

      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-20"></div>
        <img 
          src={foodImages.background} 
          alt="Background" 
          onError={(e) => { e.target.onerror = null; e.target.src = cafe }}
          className="absolute inset-0 w-full h-full object-cover object-center z-10"
        />
        <div className="absolute inset-0 z-30 flex flex-col justify-center p-4 md:p-6 lg:p-10">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#fffaf1] mb-1 md:mb-2"
          >
            Sabores que Elevam o Seu Astral!
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#fffaf1] text-sm md:text-base lg:text-lg xl:text-xl max-w-md md:max-w-lg"
          >
            "Aqui, cada prato é um convite para ficar mais um pouco."
          </motion.p>
        </div>
      </div>  

      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 p-2 scrollbar-hide">
            {['semana', 'lanches', 'porcoes', 'pasteis', 'cafe', 'bebidas', 'salgados', 'sobremesas'].map((tab) => (
             <motion.button
                    key={tab}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab)}
                    disabled={tab === 'semana' && isMenuClosed}
                    className={`px-3 py-2 rounded-lg whitespace-nowrap flex items-center transition border font-medium md:font-bold text-xs md:text-sm ${
                      activeTab === tab
                        ? 'border-[#e6be44] bg-[#b0aca6] text-black'
                        : 'border-gray-200 bg-[#918e89] text-[#FFFAF1]'
                    } ${
                      tab === 'semana' && isMenuClosed ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                {tab === 'semana' && <FiCalendar className="mr-1 md:mr-2" />}
                {tab === 'lanches' && <FaHamburger className="mr-1 md:mr-2" />}
                {tab === 'porcoes' && <FaDrumstickBite className="mr-1 md:mr-2" />}
                {tab === 'pasteis' && <GiPieSlice className="mr-1 md:mr-2" />}
                {tab === 'cafe' && <FiCoffee className="mr-1 md:mr-2" />}
                {tab === 'bebidas' && <FaCocktail className="mr-1 md:mr-2" />}
                {tab === 'salgados' && <GiSandwich className="mr-1 md:mr-2" />}
                {tab === 'sobremesas' && <FaIceCream className="mr-1 md:mr-2" />}

                {tab === 'semana' && 'Cardápio'}
                {tab === 'lanches' && 'Lanches'}
                {tab === 'porcoes' && 'Porções'}
                {tab === 'pasteis' && 'Pasteis'}
                {tab === 'cafe' && 'Bom Dia'}
                {tab === 'bebidas' && 'Bebidas'}
                {tab === 'salgados' && 'Salgados'}
                {tab === 'sobremesas' && 'Sobremesas'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

<main className="container mx-auto px-4 pb-16 md:pb-20">
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {['semana', 'lanches', 'porcoes', 'pasteis', 'cafe', 'bebidas', 'salgados', 'sobremesas'].map((category) => (
        activeTab === category && (
          <div key={category}>
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center tracking-tight">
                {category === 'semana' && <GiMeal className="mr-3 text-black text-4xl md:text-5xl" />}
                {category === 'lanches' && <GiSandwich className="mr-3  text-black text-4xl md:text-5xl" />}
                {category === 'porcoes' && <GiChickenOven className="mr-3  text-black text-4xl md:text-5xl" />}
                {category === 'pasteis' && <GiPieSlice className="mr-3  text-black text-4xl md:text-5xl" />}
                {category === 'cafe' && <GiCoffeeCup className="mr-3  text-black text-4xl md:text-5xl" />}
                {category === 'bebidas' && <GiWineBottle className="mr-3  text-black text-4xl md:text-5xl" />}
                {category === 'salgados' && <GiHotMeal className="mr-3  text-black text-4xl md:text-5xl" />}
                {category === 'sobremesas' && <GiCakeSlice className="mr-3 text-black text-4xl md:text-5xl" />}

                {category === 'semana' && 'Cardápio da Semana'}
                {category === 'lanches' && 'Lanches Exclusivos'}
                {category === 'porcoes' && 'Porções Generosas'}
                {category === 'pasteis' && 'Pastéis Artesanais'}
                {category === 'cafe' && 'Despertar com Café'}
                {category === 'bebidas' && 'Bebidas'}
                {category === 'salgados' && 'Salgados Frescos'}
                {category === 'sobremesas' && 'Sobremesas Gourmet'}
              </h2>
            </div>

            {category === 'semana' ? (
              // Início do bloco condicional para 'semana'
              (() => {
                const now = new Date();
                const currentHour = now.getHours();
                const isClosed = currentHour >= 15 || currentHour < 10;
                
                return isClosed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center p-12 bg-gray-50 rounded-3xl shadow-xl border-t-4 border-yellow-500 flex flex-col items-center justify-center min-h-[200px]"
                  >
                    <FiClock className="mx-auto text-5xl text-gray-500 mb-5 animate-pulse" />
                    <p className="font-bold text-xl text-gray-800 leading-relaxed">
                      {currentHour >= 15
                        ? "Prezado cliente, o cardápio da semana estará disponível apenas amanhã, a partir das 10h." 
                        : "Aguarde! Nosso cardápio da semana abre pontualmente às 10h da manhã."
                      }
                    </p>
                    <p className="text-md text-gray-600 mt-3 max-w-lg">
                      {currentHour >= 16
                        ? "Enquanto isso, delicie-se com as opções do nosso cardápio regular, sempre recheado de sabor!" 
                        : "Prepare-se para uma experiência gastronômica! Volte em breve para descobrir as novidades!"
                      }
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredMenu(category).map(item => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                        whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", scale: 1.01 }}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-yellow-200 flex flex-col transform transition-all duration-300 ease-in-out group hover:border-[#e6be44]"
                      >
                        <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                          <img 
                            src={item.image || cafe} 
                            alt={item.name} 
                            onError={(e) => { e.target.onerror = null; e.target.src = cafe }}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                          <button 
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-4 right-4 p-2.5 bg-white/85 rounded-full backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-yellow-500 focus:ring-opacity-70"
                            aria-label={favorites.includes(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                          >
                            <FiHeart className={`w-6 h-6 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                          </button>
                          {item.veg && (
                            <span className="absolute top-4 left-4 text-sm font-bold px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 flex items-center shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Vegetariano
                            </span>
                          )}
                          {item.isDailySpecial && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-[#e6be44] to-[#d4a72c] text-white shadow-lg">
                            <FiStar className="mr-1.5" />
                            Prato do Dia
                          </span>
                        </div>
                      )}
                        </div>
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-tight pr-3 min-w-0">{item.name}</h3>
                            <span className="font-extrabold text-xl md:text-2xl text-black px-3 py-1.5 rounded-xl shadow-sm tracking-tight">€{item.price.toFixed(2)}</span>
                          </div>
                          {item.description && <p className="text-gray-700 text-sm md:text-base mt-2 flex-grow line-clamp-3">{item.description}</p>}
                          <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "#827f7a", boxShadow: "0 8px 15px rgba(0,0,0,0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addToCart(item)}
                            className="mt-6 w-full bg-[#918e89] text-[#e6be44] font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-lg md:text-xl shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#e6be44] focus:ring-opacity-50"
                          >
                            <FiPlus className="mr-2 text-2xl" />
                            Adicionar
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })() // Fim do bloco condicional para 'semana'
            ) : category === 'pasteis' ? (
              // Seção especial para Pastéis
              <div className="space-y-12">
                {/* Hero Section para Pastéis */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b0aca6]/90 to-[#918e89]/90 z-10"></div>
                  <img 
                    src={foodImages.pasteldestaque || cafe} 
                    alt="Pastéis Artesanais"
                    className="w-full h-64 md:h-96 object-cover object-center"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6 md:p-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-4 md:mb-6"
                    >
                      <GiPieSlice className="text-5xl md:text-6xl text-[#e6be44]" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4"
                    >
                      Pastéis de Feira 
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-lg md:text-xl text-white max-w-2xl"
                    >
                      Feitos na hora, crocantes por fora e recheados com os melhores ingredientes
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="mt-6 flex flex-wrap justify-center gap-3"
                    >
                      <span className="bg-[#e6be44] text-black px-4 py-2 rounded-full font-medium flex items-center">
                        <FiClock className="mr-2" /> Fritos na hora
                      </span>
                      <span className="bg-white/20 text-white px-4 py-2 rounded-full font-medium flex items-center">
                        <FiHeart className="mr-2" /> Feito com amor
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Destaque Especial */}
                <div className="bg-gradient-to-r from-[#f8f5ed] to-[#f0ede5] p-6 md:p-8 rounded-3xl shadow-lg border-2 border-[#e6be44]/30">
                  <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          <span className="text-[#e6be44]">Destaque da Casa:</span> Pastel Alto Astral
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Nosso pastel Alto Astral é recheado com queijo, bacon, tomate, azeitona, cheddar e orégano, tudo isso envolto em uma massa fina e crocante, frita no ponto perfeito.
                        </p>
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <span className="bg-[#e6be44] text-white px-3 py-1 rounded-lg mr-3">€6.50</span>
                          <span className="flex items-center">
                            <FiStar className="text-yellow-500 mr-1" />
                            4.9 (128 avaliações)
                          </span>
                        </div>
                      </div>
                    <div className="md:w-1/2 relative">
                      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src={foodImages.pasteldestaque || cafe} 
                          alt="Pastel de Carne"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                          <span className="text-white font-medium">Experimente nosso carro-chefe!</span>
                        </div>
                      </div>
                      <div className="absolute -top-4 -right-4 bg-[#e6be44] text-black px-4 py-2 rounded-full font-bold shadow-lg">
                        Mais Vendido
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processo de Preparo */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                    Como preparamos nossos pastéis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: <GiPieSlice className="text-4xl text-[#e6be44]" />,
                        title: "Massa Artesanal",
                        description: "Nossa massa é preparada diariamente com ingredientes selecionados, resultando em uma textura perfeita"
                      },
                      {
                        icon: <FaDrumstickBite className="text-4xl text-[#e6be44]" />,
                        title: "Recheio Especial",
                        description: "Utilizamos apenas carnes e ingredientes frescos, temperados com especiarias especiais"
                      },
                      {
                        icon: <FiClock className="text-4xl text-[#e6be44]" />,
                        title: "Fritos na Hora",
                        description: "Cada pastel é frito na hora, garantindo aquela crocância inigualável e temperatura ideal"
                      }
                    ].map((step, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-[#f8f5ed]/50 p-6 rounded-xl border border-[#e6be44]/20 flex flex-col items-center text-center"
                      >
                        <div className="mb-4">{step.icon}</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h4>
                        <p className="text-gray-600">{step.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Cardápio de Pastéis */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <GiPieSlice className="mr-3 text-[#e6be44]" />
                    Nossa Seleção de Pastéis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredMenu(category).map(item => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", scale: 1.01 }}
                          className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-yellow-200 flex flex-col transform transition-all duration-300 ease-in-out group hover:border-[#e6be44]"
                        >
                          <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                            <img 
                              src={item.image || cafe} 
                              alt={item.name} 
                              onError={(e) => { e.target.onerror = null; e.target.src = cafe }}
                              className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                            />
                            <button 
                              onClick={() => toggleFavorite(item.id)}
                              className="absolute top-4 right-4 p-2.5 bg-white/85 rounded-full backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-yellow-500 focus:ring-opacity-70"
                              aria-label={favorites.includes(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                              <FiHeart className={`w-6 h-6 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                            </button>
                            {item.veg && (
                              <span className="absolute top-4 left-4 text-sm font-bold px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 flex items-center shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Vegetariano
                              </span>
                            )}

                          </div>
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-tight pr-3 min-w-0">{item.name}</h3>
                            <span className="font-extrabold text-xl md:text-2xl text-black px-3 py-1.5 rounded-xl shadow-sm tracking-tight">€{item.price.toFixed(2)}</span>
                          </div>
                          {item.description && <p className="text-gray-700 text-sm md:text-base mt-2 flex-grow line-clamp-3">{item.description}</p>}
                          <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "#827f7a", boxShadow: "0 8px 15px rgba(0,0,0,0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addToCart(item)}
                            className="mt-6 w-full bg-[#918e89] text-[#e6be44] font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-lg md:text-xl shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#e6be44] focus:ring-opacity-50"
                          >
                            <FiPlus className="mr-2 text-2xl" />
                            Adicionar
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Início do bloco para outras categorias
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredMenu(category).map(item => (
                  <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                        whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", scale: 1.01 }}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-[#e6be44] flex flex-col transform transition-all duration-300 ease-in-out group hover:border-[#e6be44]"
                      >
                    <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                      <img 
                        src={item.image || cafe} 
                        alt={item.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = cafe }}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-4 right-4 p-2.5 bg-white/85 rounded-full backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-yellow-500 focus:ring-opacity-70"
                        aria-label={favorites.includes(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <FiHeart className={`w-6 h-6 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      </button>
                      {item.veg && (
                        <span className="absolute top-4 left-4 text-sm font-bold px-3.5 py-1.5 rounded-full bg-green-100 text-green-800 flex items-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Vegetariano
                        </span>
                      )}
                  </div>
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-tight pr-3 min-w-0">{item.name}</h3>
                        <span className="font-extrabold text-xl md:text-2xl text-black px-3 py-1.5 rounded-xl shadow-sm tracking-tight">€{item.price.toFixed(2)}</span>
                      </div>
                      {item.description && <p className="text-gray-700 text-sm md:text-base mt-2 flex-grow line-clamp-3">{item.description}</p>}
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#827f7a", boxShadow: "0 8px 15px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(item)}
                        className="mt-6 w-full bg-[#918e89] text-[#e6be44] font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-lg md:text-xl shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#e6be44] focus:ring-opacity-50"
                      >
                        <FiPlus className="mr-2 text-2xl" />
                        Adicionar
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )
      ))}
    </motion.div>
  </AnimatePresence>
</main>

      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 p-3 z-10"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {     
              window.scrollTo({ top: 0, behavior: 'smooth' });
              proceedToCheckout();
            }}                    
            className="w-full bg-[#b0aca6] text-[#e6be44] py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base"
          >
            <FiShoppingCart className="mr-2" />
            Ver Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            <span className="ml-2 font-bold">€{calculateTotal().toFixed(2)}</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default InterfaceCliente;