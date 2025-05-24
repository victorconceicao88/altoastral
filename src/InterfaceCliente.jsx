import React, { useState, useEffect, createContext, useCallback } from 'react';
import { ref, push, update, database, loginAnonimo } from './firebase';
import { getDatabase, set, onValue } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { 
  FiShoppingCart, FiX, FiCheck, FiClock, FiTruck, FiHome, 
  FiCalendar, FiCoffee, FiMeh, FiPlus, FiMinus, FiInfo, 
  FiStar, FiHeart, FiShare2, FiUser, FiMapPin, FiPhone, 
  FiEdit2, FiCreditCard, FiLock, FiLogIn
} from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from './assets/logo-alto-astral.png';
import logoBackground from './assets/fotodecapa.jpeg';
import mbwayLogo from './assets/images.png';
import frangoCremoso from './assets/frango-cremoso.jpg';
import picanha from './assets/picanha.jpg';
import costelaRaiz from './assets/costela-raiz.jpg';
import frangoSupremo from './assets/frangosupremo.jpg';
import feijoadaAstral from './assets/feijoada.jpg';
import hamburguer from './assets/hamburguer.jpg';
import chorica from './assets/choriça.jpg';
import Asinha from './assets/Asinha.jpg';
import Picanhacomfritas from './assets/picanha-com-fritas.jpg';
import Filetilapia from './assets/filetilapia.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const logoWhite = logo;

// Mock images
const foodImages = {
  frangoCremoso: frangoCremoso,
  picanhaPremium: picanha,
  costelaRaiz: costelaRaiz,
  frangosupremo: frangoSupremo,
  feijoadaAstral: feijoadaAstral,
  hamburguer: hamburguer,
  chorica: chorica,
  Asinha: Asinha,
  Picanhacomfritas: Picanhacomfritas,
  Filetilapia: Filetilapia,
  batataFrita: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  pastel: 'https://images.unsplash.com/photo-1631853551243-ca3d3b769de3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  cafe: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  bebida: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  salgado: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  sobremesa: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  background: logoBackground 
};

const menu = {
  semana: [
    { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: foodImages.frangoCremoso, rating: 4.5 },
    { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: foodImages.picanhaPremium, rating: 4.8 },
    { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: foodImages.costelaRaiz, rating: 4.7 },
    { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: foodImages.frangosupremo, rating: 4.3 },
    { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: foodImages.feijoadaAstral, rating: 4.9 },
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
    { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.chorica, rating: 4.5 },
    { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: foodImages.Asinha, rating: 4.4 },
    { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.7 },
    { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: foodImages.Picanhacomfritas, rating: 4.8 },
    { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: foodImages.Filetilapia, rating: 4.3 }
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

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeArea, setActiveArea] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const controls = useAnimation();


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

  

  useEffect(() => {
    loginAnonimo()
      .then(() => {
        console.log('Usuário anônimo autenticado');
      })
      .catch((error) => {
        console.error('Erro ao autenticar usuário anônimo:', error);
      });
  }, []);

  const db = database;
  const pedidoRef = push(ref(db, 'orders'));

  set(pedidoRef, {
    mesa: 5,
    itens: [{ produto: "Pizza", quantidade: 2 }],
    criadoEm: Date.now()
  });

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all' && activeArea === 'all') return true;
    if (activeTab !== 'all' && activeArea === 'all') {
      return order.orderType === activeTab;
    }
    if (activeTab === 'all' && activeArea !== 'all') {
      if (order.orderType !== 'dine-in') return false;
      const tableNum = parseInt(order.tableNumber || 0);
      return activeArea === 'internal' ? tableNum <= 8 : tableNum > 8;
    }
    if (order.orderType !== activeTab) return false;
    if (order.orderType !== 'dine-in') return true;
    
    const tableNum = parseInt(order.tableNumber || 0);
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
          <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              <button
                onClick={() => { setActiveTab('all'); setActiveArea('all'); }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'all' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
              >
                Todos os Pedidos
              </button>
              <button
                onClick={() => { setActiveTab('dine-in'); setActiveArea('all'); }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'dine-in' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
              >
                No Restaurante
              </button>
              <button
                onClick={() => { setActiveTab('takeaway'); setActiveArea('all'); }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'takeaway' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
              >
                Retirada
              </button>
              <button
                onClick={() => { setActiveTab('delivery'); setActiveArea('all'); }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'delivery' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
              >
                Entrega
              </button>
            </div>
            
            {activeTab === 'dine-in' && (
              <div className="flex overflow-x-auto space-x-2 pb-2">
                <button
                  onClick={() => setActiveArea('all')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeArea === 'all' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
                >
                  Todas as Mesas
                </button>
                <button
                  onClick={() => setActiveArea('internal')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeArea === 'internal' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
                >
                  Sala Interna (1-8)
                </button>
                <button
                  onClick={() => setActiveArea('external')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeArea === 'external' ? 'bg-[#b0aca6] text-[#e6be44]' : 'bg-gray-100'}`}
                >
                  Esplanada (9-16)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'dine-in' && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">
                {activeArea === 'all' ? 'Todas as Mesas' : 
                 activeArea === 'internal' ? 'Sala Interna (1-8)' : 'Esplanada (9-16)'}
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(16)].map((_, i) => {
                  const tableNum = i + 1;
                  if (activeArea === 'internal' && tableNum > 8) return null;
                  if (activeArea === 'external' && tableNum <= 8) return null;
                  
                  const tableOrders = orders.filter(
                    o => o.orderType === 'dine-in' && 
                         o.tableNumber == tableNum && 
                         o.status !== 'completed'
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
    primary: 'bg-[#b0aca6] text-[#e6be44] shadow-lg hover:shadow-[#b0aca6]/30',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    outline: 'border border-[#b0aca6] text-[#e6be44] hover:bg-[#b0aca6]/10',
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
        bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-[#e6be44]
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
    primary: 'bg-[#b0aca6]/10 text-[#e6be44]',
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
          className={`w-4 h-4 ${i < value ? 'text-[#e6be44] fill-[#e6be44]' : 'text-gray-300'}`} 
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

const WelcomeModal = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-[#e6be44] p-6 text-center">
          <h2 className="text-2xl font-bold text-black">Bem-vindo ao Alto Astral</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center text-[#e6be44]">
              <FiCalendar className="mr-2" size={24} />
              <span className="font-semibold text-black">Pastéis servidos diariamente a partir das 15h</span>
            </div>
            
            <div className="flex items-center justify-center text-[#e6be44]">
              <FiCoffee className="mr-2" size={24} />
              <span className="font-semibold text-black">Pastéis disponíveis o dia inteiro aos sábados</span>
            </div>
            
            <div className="flex items-center justify-center text-[#e6be44]">
              <FiMeh className="mr-2" size={24} />
              <span className="font-semibold text-black">Feijoada servida exclusivamente aos sábados</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={onClose}
              className="w-full bg-[#b0aca6] text-[#e6be44] hover:bg-[#a09c96]"
            >
              Explorar Cardápio
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};



const InterfaceCliente = () => {
  const [activeTab, setActiveTab] = useState('semana');
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('menu');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    surname: '',
    phone: '',
    address: '',
    reference: '',
    notes: '',
    paymentMethod: '',
    changeFor: '',
    tableNumber: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const controls = useAnimation();
  const location = useLocation();
  const navigate = useNavigate();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppLink, setWhatsAppLink] = useState('');
  const [countdown, setCountdown] = useState(40);

  
  const queryParams = new URLSearchParams(location.search);
  const tableNumberFromQR = queryParams.get('table') || '';

  const [orderType, setOrderType] = useState('dine-in');
  
  const handleSuccessfulLogin = () => {
    setUserIsLoggedIn(true);
  };

  useEffect(() => {
    if (tableNumberFromQR) {
      setOrderType('dine-in');
      setCustomerInfo(prev => ({ ...prev, tableNumber: tableNumberFromQR }));
    }
  }, [tableNumberFromQR]);

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
    
    // Notificação corrigida
    addNotification(`${item.name} adicionado ao carrinho com sucesso`, 'success');
    
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
          name: customerInfo.name || (customerInfo.tableNumber ? `Mesa ${customerInfo.tableNumber}` : 'Cliente não identificado'),
          phone: customerInfo.phone || '',
          address: customerInfo.address || '',
          notes: customerInfo.notes || ''
        },
        orderType: orderType,
        tableNumber: customerInfo.tableNumber || '',
        total: calculateTotal(),
        status: 'pending',
        timestamp: Date.now(),
        paymentMethod: customerInfo.paymentMethod || ''
      };

      if (newOrder.items.length === 0) {
        throw new Error('O carrinho está vazio');
      }
      
      if (orderType === 'delivery' && (!customerInfo.name || !customerInfo.phone || !customerInfo.address)) {
        throw new Error('Informações do cliente incompletas para entrega');
      }
      
      if (orderType === 'takeaway' && (!customerInfo.name || !customerInfo.phone)) {
        throw new Error('Informações do cliente incompletas para retirada');
      }

      if (orderType === 'dine-in' && !customerInfo.tableNumber) {
        throw new Error('Número da mesa não informado');
      }

      await push(orderRef, newOrder);
      
      if (orderType === 'dine-in') {
        setCheckoutStep('confirmation');
        setCart([]);
      } else {
        const phoneNumber = '351933737672';
        const message = `*Novo Pedido Alto Astral*%0A%0A` +
          `*Tipo:* ${orderType === 'takeaway' ? 'Retirada' : 'Entrega'}%0A` +
          `*Cliente:* ${customerInfo.name} ${customerInfo.surname}%0A` +
          `*Telefone:* ${customerInfo.phone}%0A` +
          (orderType === 'delivery' ? `*Endereço:* ${customerInfo.address}%0A*Referência:* ${customerInfo.reference || 'Nenhuma'}%0A` : '') +
          `*Itens:*%0A${cart.map(item => `- ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})${item.notes ? ` - Obs: ${item.notes}` : ''}`).join('%0A')}%0A` +
          `*Taxa de Entrega:* €${orderType === 'delivery' ? '2.50' : '0.00'}%0A` +
          `*Total:* €${calculateTotal().toFixed(2)}%0A` +
          `*Método de Pagamento:* ${customerInfo.paymentMethod || 'Não especificado'}%0A` +
          (customerInfo.paymentMethod === 'cash' && customerInfo.changeFor ? `*Troco para:* €${customerInfo.changeFor}%0A` : '') +
          `*Observações:* ${customerInfo.notes || 'Nenhuma'}`;
        
        setWhatsAppLink(`https://wa.me/${phoneNumber}?text=${message}`);
        setShowWhatsAppModal(true);
        setCountdown(40); // Reinicia o contador
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      addNotification(error.message || 'Erro ao enviar pedido. Tente novamente.', 'error');
    }
  };

  // Adicione este useEffect para o contador:
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
    }
    return () => clearInterval(timer);
  }, [showWhatsAppModal, countdown]);

  const filteredMenu = (category) => {
    const items = menu[category];
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
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
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
            {orderType === 'dine-in' ? 
              'Seu pedido foi recebido e será atendido em breve.' : 
              'Seu pedido foi recebido e está sendo preparado.'}
          </p>
          {orderType === 'dine-in' ? (
            <div className="mb-6 bg-[#b0aca6]/10 text-[#e6be44] p-3 rounded-lg">
              <p className="flex items-center justify-center">
                <FiHome className="mr-2" /> Mesa {customerInfo.tableNumber}
              </p>
            </div>
          ) : (
            <div className="mb-6 bg-[#b0aca6]/10 text-[#e6be44] p-3 rounded-lg">
              <p className="flex items-center justify-center">
                <FiClock className="mr-2" /> Tempo estimado: {orderType === 'delivery' ? '30-45 minutos' : '15-20 minutos'}
              </p>
            </div>
          )}
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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCheckoutStep('menu')}
            className="mr-4 text-[#e6be44] hover:text-[#d8b23d]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-black">Seu Pedido</h2>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
            <FiShoppingCart className="mr-2 text-[#e6be44]" />
            Resumo do Pedido
          </h3>
          
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-black">{item.quantity}x {item.name}</span>
                    <span className="font-medium text-black">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.notes && <p className="text-xs text-gray-500 mt-1">Obs: {item.notes}</p>}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between font-bold text-black">
              <span>Total:</span>
              <span>€{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between sticky bottom-0 bg-white p-4 -mx-4 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCheckoutStep('menu')}
            className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Voltar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCheckoutStep('order-type')}
            disabled={cart.length === 0}
            className={`px-6 py-3 rounded-lg transition ${
              cart.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#b0aca6] text-[#e6be44] hover:bg-[#a09c96]'
            }`}
          >
            Continuar
          </motion.button>
        </div>
      </div>
    </div>
  );
}

  if (checkoutStep === 'order-type') {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCheckoutStep('menu')}
              className="mr-4 text-[#e6be44] hover:text-[#d8b23d]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-black">Tipo de Pedido</h2>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-6 text-center text-black">Como deseja receber seu pedido?</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOrderType('dine-in');
                  setCheckoutStep('table-number');
                }}
                className={`p-6 rounded-xl border-2 transition-all ${orderType === 'dine-in' ? 'border-[#e6be44] bg-[#e6be44]/10 text-black' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FiHome size={32} className={orderType === 'dine-in' ? 'text-[#e6be44]' : 'text-gray-400'} />
                  <span className="text-lg font-medium text-black">Comer no Restaurante</span>
                  <span className="text-sm text-gray-500">Servido diretamente na sua mesa</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOrderType('takeaway');
                  setCheckoutStep('customer-info');
                }}
                className={`p-6 rounded-xl border-2 transition-all ${orderType === 'takeaway' ? 'border-[#e6be44] bg-[#e6be44]/10 text-black' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FiShoppingCart size={32} className={orderType === 'takeaway' ? 'text-[#e6be44]' : 'text-gray-400'} />
                  <span className="text-lg font-medium text-black">Retirar no Balcão</span>
                  <span className="text-sm text-gray-500">Pronto em 15-20 minutos</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOrderType('delivery');
                  setCheckoutStep('customer-info');
                }}
                className={`p-6 rounded-xl border-2 transition-all ${orderType === 'delivery' ? 'border-[#e6be44] bg-[#e6be44]/10 text-black' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FiTruck size={32} className={orderType === 'delivery' ? 'text-[#e6be44]' : 'text-gray-400'} />
                  <span className="text-lg font-medium text-black">Entrega (+€2.50)</span>
                  <span className="text-sm text-gray-500">Entrega em 30-45 minutos</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'table-number') {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCheckoutStep('order-type')}
              className="mr-4 text-[#e6be44] hover:text-[#d8b23d]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-black">Número da Mesa</h2>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
              <FiHome className="mr-2 text-[#e6be44]" />
              Informe o número da sua mesa
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-black mb-1">Número da Mesa *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, tableNumber: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                    required
                    placeholder="Ex: 5"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Verifique o número no QR Code da sua mesa</p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between sticky bottom-0 bg-white p-4 -mx-4 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckoutStep('order-type')}
              className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Voltar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckoutStep('customer-info')}
              disabled={!customerInfo.tableNumber}
              className={`px-6 py-3 rounded-lg transition ${
                !customerInfo.tableNumber
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#b0aca6] text-[#e6be44] hover:bg-[#a09c96]'
              }`}
            >
              Continuar
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'customer-info') {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => orderType === 'dine-in' ? setCheckoutStep('table-number') : setCheckoutStep('order-type')}
              className="mr-4 text-[#e6be44] hover:text-[#d8b23d]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-black">Confirmar Pedido</h2>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
              <FiShoppingCart className="mr-2 text-[#e6be44]" />
              Resumo do Pedido {orderType === 'dine-in' && `- Mesa ${customerInfo.tableNumber}`}
            </h3>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-black">{item.quantity}x {item.name}</span>
                      <span className="font-medium text-black">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.notes && <p className="text-xs text-gray-500 mt-1">Obs: {item.notes}</p>}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between font-bold text-black">
                <span>Total:</span>
                <span>€{calculateTotal().toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Taxa de entrega:</span>
                  <span>€2.50</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
              {orderType === 'dine-in' ? <FiHome className="mr-2 text-[#e6be44]" /> : 
               orderType === 'takeaway' ? <FiShoppingCart className="mr-2 text-[#e6be44]" /> : 
               <FiTruck className="mr-2 text-[#e6be44]" />}
              {orderType === 'dine-in' ? 'Informações da Mesa' : 
               orderType === 'takeaway' ? 'Informações para Retirada' : 
               'Informações para Entrega'}
            </h3>
 
            <div className="space-y-4">
              {orderType === 'dine-in' ? (
                <div>
                  <label className="block text-black mb-1">Mesa</label>
                  <input
                    type="text"
                    value={`Mesa ${customerInfo.tableNumber}`}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black mb-1">Nome *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                          required
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-black mb-1">Sobrenome *</label>
                      <input
                        type="text"
                        value={customerInfo.surname}
                        onChange={(e) => setCustomerInfo({...customerInfo, surname: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-black mb-1">Telemóvel *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                        required
                        placeholder="Seu número de telefone"
                      />
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <>
                      <div>
                        <label className="block text-black mb-1">Endereço Completo *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMapPin className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                            required
                            placeholder="Rua, número, bairro, apartamento"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-black mb-1">Ponto de Referência</label>
                        <input
                          type="text"
                          value={customerInfo.reference}
                          onChange={(e) => setCustomerInfo({...customerInfo, reference: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Ex: Próximo ao mercado X, prédio com cor Y"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {orderType !== 'dine-in' && (
                <>
                  <div>
                    <label className="block text-black mb-1">Método de Pagamento *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'mbway'})}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center ${customerInfo.paymentMethod === 'mbway' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                      >
                        <img src={mbwayLogo} alt="MBWay" className="h-6 mb-1" />
                        <span className="text-xs text-black">MBWay</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'card'})}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center ${customerInfo.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <FiCreditCard className="text-blue-500 text-xl mb-1" />
                        <span className="text-xs text-black">Cartão</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'cash'})}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center ${customerInfo.paymentMethod === 'cash' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mb-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-black">Dinheiro</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  {customerInfo.paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-black mb-1">Troco para quanto?</label>
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
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                          placeholder="Valor que irá pagar"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-black mb-1">Observações</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <FiEdit2 className="text-gray-400" />
                  </div>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
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
              onClick={() => orderType === 'dine-in' ? setCheckoutStep('table-number') : setCheckoutStep('order-type')}
              className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Voltar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={
                (orderType === 'delivery' && (
                  !customerInfo.name || 
                  !customerInfo.surname || 
                  !customerInfo.phone || 
                  !customerInfo.address
                )) ||
                (orderType === 'takeaway' && (
                  !customerInfo.name || 
                  !customerInfo.surname || 
                  !customerInfo.phone
                )) ||
                (orderType === 'dine-in' && !customerInfo.tableNumber) ||
                cart.length === 0
              }
              className={`px-6 py-3 rounded-lg transition ${
                ((orderType === 'delivery' && (
                  !customerInfo.name || 
                  !customerInfo.surname || 
                  !customerInfo.phone || 
                  !customerInfo.address
                )) ||
                (orderType === 'takeaway' && (
                  !customerInfo.name || 
                  !customerInfo.surname || 
                  !customerInfo.phone
                )) ||
                (orderType === 'dine-in' && !customerInfo.tableNumber) ||
                cart.length === 0)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#b0aca6] text-[#e6be44] hover:bg-[#a09c96]'
              }`}
            >
              Finalizar Pedido
            </motion.button>
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

    {showWhatsAppModal && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        >
          <div className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Pedido Confirmado!</h3>
              <p className="text-gray-600 mt-2">Agora é só enviar pelo WhatsApp para confirmar</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Tempo restante:</span>
                <span>{countdown}s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#e6be44] h-2 rounded-full" 
                  style={{ width: `${(countdown/40)*100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open(whatsAppLink, '_blank');
                  setShowWhatsAppModal(false);
                  setCheckoutStep('confirmation');
                  setCart([]);
                }}
                className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar pelo WhatsApp
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowWhatsAppModal(false);
                  setCheckoutStep('confirmation');
                  setCart([]);
                }}
                className="w-full border border-gray-300 py-3 rounded-lg text-gray-700"
              >
                Cancelar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )}

      {/* Notificações */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-3 rounded-lg shadow-lg flex justify-between items-center ${
                notification.type === 'error' ? 'bg-red-500' :
                notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              } text-white`}
            >
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
                className="ml-4"
              >
                <FiX />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="bg-white text-black p-4 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Alto Astral" className="h-20 mr-2" />
            <h1 className="text-2xl font-bold hidden sm:block">Alto Astral</h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={proceedToCheckout}
              className="relative bg-white hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center transition"
              disabled={cart.length === 0}
            >
              <FiShoppingCart className="mr-2 text-2xl text-black" />
              <span className="hidden sm:inline text-black">Carrinho</span>
              {cart.length > 0 && (
                <motion.span 
                  animate={controls}
                  className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

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
              className="text-3xl md:text-5xl font-bold mb-2"
              style={{ color: '#FFFAF1' }}
            >
              Sabores que Elevam o Seu Astral.
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl max-w-lg"
              style={{ color: '#FFFAF1' }}
            >
              "Aqui, cada prato é um convite para ficar mais um pouco."
            </motion.p>
          </div>

      </div>

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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e6be44] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex space-x-1 p-2">
            {['semana', 'lanches', 'porcoes', 'pasteis', 'cafe', 'bebidas', 'salgados', 'sobremesas'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition border ${
                  activeTab === tab ? 'border-[#e6be44] bg-[#b0aca6] text-[#e6be44]' : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {tab === 'semana' && <FiCalendar className="mr-2" />}
                {tab === 'lanches' && <FiCoffee className="mr-2" />}
                {tab === 'porcoes' && <FiPlus className="mr-2" />}
                {tab === 'pasteis' && <FiInfo className="mr-2" />}
                {tab === 'cafe' && <FiCoffee className="mr-2" />}
                {tab === 'bebidas' && <FiPlus className="mr-2" />}
                {tab === 'salgados' && <FiInfo className="mr-2" />}
                {tab === 'sobremesas' && <FiCoffee className="mr-2" />}
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

      <main className="container mx-auto p-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {['semana', 'lanches', 'porcoes', 'pasteis', 'cafe', 'bebidas', 'salgados', 'sobremesas'].map((category) => (
              activeTab === category && (
                <div key={category}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black flex items-center">
                      {category === 'semana' && <FiCalendar className="mr-2 text-[#e6be44]" />}
                      {category === 'lanches' && <FiCoffee className="mr-2 text-[#e6be44]" />}
                      {category === 'porcoes' && <FiPlus className="mr-2 text-[#e6be44]" />}
                      {category === 'pasteis' && <FiInfo className="mr-2 text-[#e6be44]" />}
                      {category === 'cafe' && <FiCoffee className="mr-2 text-[#e6be44]" />}
                      {category === 'bebidas' && <FiPlus className="mr-2 text-[#e6be44]" />}
                      {category === 'salgados' && <FiInfo className="mr-2 text-[#e6be44]" />}
                      {category === 'sobremesas' && <FiCoffee className="mr-2 text-[#e6be44]" />}
                      {category === 'semana' && 'Cardápio da Semana'}
                      {category === 'lanches' && 'Lanches'}
                      {category === 'porcoes' && 'Porções'}
                      {category === 'pasteis' && 'Pasteis'}
                      {category === 'cafe' && 'Bom Dia'}
                      {category === 'bebidas' && 'Bebidas'}
                      {category === 'salgados' && 'Salgados'}
                      {category === 'sobremesas' && 'Sobremesas'}
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenu(category).map(item => (
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
                            <span className="absolute top-2 left-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Vegetariano
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-black">{item.name}</h3>
                            <span className="font-bold text-black bg- white px-2 py-1 rounded-lg">€{item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center my-1">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.round(item.rating) ? 'text-[#e6be44] fill-[#e6be44]' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {item.description && <p className="text-gray-600 text-sm mt-2">{item.description}</p>}
                          <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => addToCart(item)}
                              className="mt-4 w-full bg-[#b0aca6] text-[#e6be44] font-bold px-4 py-2 rounded-lg hover:bg-[#a09c96] transition flex items-center justify-center"
                            >
                              <FiPlus className="mr-1" />
                              Adicionar
                            </motion.button>

                        </div>
                      </Card>
                    ))}
                  </div>
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
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 p-4 z-10"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={proceedToCheckout}
            className="w-full bg-[#b0aca6] text-[#e6be44] py-3 rounded-lg flex items-center justify-center"
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