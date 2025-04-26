import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiUsers, FiPlus, FiMinus, FiTrash2, 
  FiCoffee, FiMenu, FiClock, FiUser,
  FiDollarSign, FiPrinter, FiSend, FiShoppingCart,
  FiChevronRight, FiMaximize2, FiGrid, FiExternalLink,
  FiStar, FiHeart, FiAward, FiZap, FiSun, FiMapPin,
  FiCheckCircle, FiXCircle, FiPhone, FiAlertCircle,
  FiChevronDown, FiCreditCard, FiEdit2, FiLock, FiUnlock
} from 'react-icons/fi';
import { 
  FaChair, FaUmbrellaBeach, FaWineGlassAlt, FaHamburger, 
  FaIceCream, FaWineBottle, FaGlassWhiskey, FaBeer,
  FaBreadSlice, FaFish, FaDrumstickBite, FaCheese,
  FaConciergeBell, FaReceipt, FaQrcode, FaRegClock
} from 'react-icons/fa';
import { 
  GiMeal, GiChickenOven, GiSteak, GiSodaCan, 
  GiForkKnifeSpoon, GiCakeSlice, GiCoffeeCup, GiSaucepan,
  GiChocolateBar, GiFullPizza, GiSausage, GiFruitBowl,
  GiCook, GiSpoon
} from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import axios from 'axios';

// Premium food images
const foodImages = {
  frangoCremoso: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  picanhaPremium: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  costelaRaiz: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  feijoada: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  hamburguer: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  batataFrita: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  pastel: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  cafe: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  bebida: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  salgado: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  sobremesa: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
};

// Modern color palette
const colors = {
  primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  primaryHover: 'hover:from-indigo-700 hover:to-purple-700',
  secondary: 'bg-gradient-to-r from-amber-500 to-orange-500',
  secondaryHover: 'hover:from-amber-600 hover:to-orange-600',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  danger: 'bg-gradient-to-r from-rose-500 to-pink-500',
  warning: 'bg-gradient-to-r from-amber-400 to-yellow-500',
  info: 'bg-gradient-to-r from-blue-400 to-cyan-400',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  light: 'bg-gradient-to-r from-gray-50 to-gray-100'
};

const InterfaceRestaurante = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [timeElapsed, setTimeElapsed] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [customerCount, setCustomerCount] = useState(1);
  const [editingTable, setEditingTable] = useState(null);
  const [editCustomerCount, setEditCustomerCount] = useState(1);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [printerIP, setPrinterIP] = useState('192.168.1.100');
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [newTable, setNewTable] = useState({
    name: '',
    area: 'Área Principal',
    capacity: 2,
    location: '',
    outdoor: false
  });

  // Professional tables with premium icons
  const [tables, setTables] = useState([
    // Main Area
    { id: 1, name: 'Mesa 1', area: 'Área Principal', status: 'livre', capacity: 4, icon: <FaChair className="text-indigo-600" />, location: 'Perto da janela', customers: 0 },
    { id: 2, name: 'Mesa 2', area: 'Área Principal', status: 'ocupada', capacity: 6, time: 25, icon: <FaChair className="text-rose-600" />, customers: 4, location: 'Centro' },
    { id: 3, name: 'Mesa 3', area: 'Área Principal', status: 'livre', capacity: 2, icon: <FaChair className="text-emerald-600" />, location: 'Canto', customers: 0 },
    { id: 4, name: 'Mesa 4', area: 'Área Principal', status: 'ocupada', capacity: 8, time: 45, icon: <FaChair className="text-rose-600" />, customers: 6, location: 'Perto do balcão' },
    { id: 5, name: 'Mesa 5', area: 'Área Principal', status: 'livre', capacity: 4, icon: <FaChair className="text-emerald-600" />, location: 'Meio', customers: 0 },
    { id: 6, name: 'Mesa 6', area: 'Área Principal', status: 'ocupada', capacity: 4, time: 15, icon: <FaChair className="text-rose-600" />, customers: 2, location: 'Fundo' },
    { id: 7, name: 'Mesa 7', area: 'Área Principal', status: 'livre', capacity: 6, icon: <FaChair className="text-emerald-600" />, location: 'Perto da entrada', customers: 0 },
    { id: 8, name: 'Mesa 8', area: 'Área Principal', status: 'livre', capacity: 2, icon: <FaChair className="text-emerald-600" />, location: 'Varanda', customers: 0 },
    
    // Outdoor Area
    { id: 9, name: 'Mesa 9', area: 'Área Externa', status: 'livre', capacity: 4, icon: <FaUmbrellaBeach className="text-teal-600" />, location: 'Jardim', customers: 0 },
    { id: 10, name: 'Mesa 10', area: 'Área Externa', status: 'ocupada', capacity: 6, time: 35, icon: <FaUmbrellaBeach className="text-rose-600" />, customers: 6, location: 'Perto da piscina' },
    { id: 11, name: 'Mesa 11', area: 'Área Externa', status: 'livre', capacity: 2, icon: <FaUmbrellaBeach className="text-teal-600" />, location: 'Varanda', customers: 0 },
    { id: 12, name: 'Mesa 12', area: 'Área Externa', status: 'ocupada', capacity: 8, time: 60, icon: <FaUmbrellaBeach className="text-rose-600" />, customers: 7, location: 'Quintal' },
    { id: 13, name: 'Mesa 13', area: 'Área Externa', status: 'livre', capacity: 4, icon: <FaUmbrellaBeach className="text-teal-600" />, location: 'Varanda', customers: 0 },
    { id: 14, name: 'Mesa 14', area: 'Área Externa', status: 'ocupada', capacity: 4, time: 20, icon: <FaUmbrellaBeach className="text-rose-600" />, customers: 3, location: 'Jardim' },
    { id: 15, name: 'Mesa 15', area: 'Área Externa', status: 'livre', capacity: 6, icon: <FaUmbrellaBeach className="text-teal-600" />, location: 'Pérgola', customers: 0 },
    { id: 16, name: 'Mesa 16', area: 'Área Externa', status: 'livre', capacity: 2, icon: <FaUmbrellaBeach className="text-teal-600" />, location: 'Varanda', customers: 0 }
  ]);

  // Professional menu
  const menu = {
    semana: [
      { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: foodImages.frangoCremoso, rating: 4.5, prepTime: 15, icon: <GiChickenOven className="text-amber-600" />, type: 'food' },
      { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: foodImages.picanhaPremium, rating: 4.8, prepTime: 25, icon: <GiSteak className="text-rose-600" />, type: 'food' },
      { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: foodImages.costelaRaiz, rating: 4.7, prepTime: 30, icon: <FaDrumstickBite className="text-amber-700" />, type: 'food' },
      { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: foodImages.frangoCremoso, rating: 4.3, prepTime: 20, icon: <GiChickenOven className="text-amber-500" />, type: 'food' },
      { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: foodImages.feijoada, rating: 4.9, prepTime: 40, icon: <GiSaucepan className="text-brown-600" />, type: 'food' },
      { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: foodImages.frangoCremoso, rating: 4.2, prepTime: 15, icon: <GiFruitBowl className="text-green-600" />, type: 'food' }
    ],
    lanches: [
      { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: foodImages.hamburguer, rating: 4.4, prepTime: 10, icon: <FaHamburger className="text-amber-700" />, type: 'food' },
      { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: foodImages.hamburguer, rating: 4.7, prepTime: 12, icon: <FaHamburger className="text-amber-600" />, type: 'food' },
      { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: foodImages.hamburguer, rating: 4.9, prepTime: 15, icon: <FaHamburger className="text-amber-800" />, type: 'food' },
      { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: foodImages.hamburguer, rating: 4.1, prepTime: 8, icon: <FaBreadSlice className="text-yellow-600" />, type: 'food' },
      { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.hamburguer, rating: 4.0, prepTime: 7, icon: <GiForkKnifeSpoon className="text-amber-600" />, type: 'food' },
      { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: foodImages.hamburguer, rating: 3.9, prepTime: 6, icon: <GiFruitBowl className="text-green-500" />, type: 'food' }
    ],
    porcoes: [
      { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: foodImages.batataFrita, rating: 4.2, prepTime: 10, icon: <GiMeal className="text-yellow-600" />, type: 'food' },
      { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: foodImages.batataFrita, rating: 4.6, prepTime: 12, icon: <GiMeal className="text-yellow-700" />, type: 'food' },
      { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.batataFrita, rating: 4.5, prepTime: 15, icon: <GiSausage className="text-red-600" />, type: 'food' },
      { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.4, prepTime: 20, icon: <FaDrumstickBite className="text-amber-600" />, type: 'food' },
      { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.7, prepTime: 25, icon: <GiSteak className="text-brown-600" />, type: 'food' },
      { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: foodImages.batataFrita, rating: 4.8, prepTime: 20, icon: <GiSteak className="text-rose-600" />, type: 'food' },
      { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: foodImages.batataFrita, rating: 4.3, prepTime: 18, icon: <FaFish className="text-blue-500" />, type: 'food' }
    ],
    pasteis: [
      { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: foodImages.pastel, rating: 4.3, prepTime: 8, icon: <GiFullPizza className="text-yellow-600" />, type: 'food' },
      { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: foodImages.pastel, rating: 4.5, prepTime: 8, icon: <GiFullPizza className="text-yellow-600" />, type: 'food' },
      { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: foodImages.pastel, rating: 4.7, prepTime: 9, icon: <GiFullPizza className="text-yellow-700" />, type: 'food' },
      { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: foodImages.pastel, rating: 4.4, prepTime: 8, icon: <GiFullPizza className="text-yellow-600" />, type: 'food' },
      { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: foodImages.pastel, rating: 4.6, prepTime: 9, icon: <GiFullPizza className="text-yellow-700" />, type: 'food' },
      { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: foodImages.pastel, rating: 4.2, prepTime: 8, icon: <GiSausage className="text-red-500" />, type: 'food' },
      { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: foodImages.pastel, rating: 4.1, prepTime: 8, icon: <GiFullPizza className="text-yellow-600" />, type: 'food' },
      { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: foodImages.pastel, rating: 4.0, prepTime: 8, icon: <GiFullPizza className="text-yellow-600" />, type: 'food' },
      { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: foodImages.pastel, rating: 4.8, prepTime: 10, icon: <GiFullPizza className="text-yellow-700" />, type: 'food' },
      { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: foodImages.pastel, rating: 4.7, prepTime: 8, icon: <GiFullPizza className="text-pink-500" />, type: 'food' },
      { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: foodImages.pastel, rating: 4.9, prepTime: 8, icon: <GiFullPizza className="text-purple-600" />, type: 'food' }
    ],
    cafe: [
      { id: 31, name: 'Café Expresso', price: 1.00, image: foodImages.cafe, rating: 4.5, prepTime: 2, icon: <GiCoffeeCup className="text-brown-700" />, type: 'drink' },
      { id: 32, name: 'Café Descafeinado', price: 1.00, image: foodImages.cafe, rating: 4.3, prepTime: 2, icon: <GiCoffeeCup className="text-brown-500" />, type: 'drink' },
      { id: 33, name: 'Café Duplo', price: 2.00, image: foodImages.cafe, rating: 4.6, prepTime: 3, icon: <GiCoffeeCup className="text-brown-800" />, type: 'drink' },
      { id: 34, name: 'Garoto', price: 1.00, image: foodImages.cafe, rating: 4.2, prepTime: 2, icon: <GiCoffeeCup className="text-brown-600" />, type: 'drink' },
      { id: 35, name: 'Abatanado', price: 1.10, image: foodImages.cafe, rating: 4.1, prepTime: 2, icon: <GiCoffeeCup className="text-brown-600" />, type: 'drink' },
      { id: 36, name: 'Meia de Leite', price: 1.50, image: foodImages.cafe, rating: 4.4, prepTime: 3, icon: <GiCoffeeCup className="text-brown-400" />, type: 'drink' },
      { id: 37, name: 'Galão', price: 1.60, image: foodImages.cafe, rating: 4.5, prepTime: 3, icon: <GiCoffeeCup className="text-brown-300" />, type: 'drink' },
      { id: 38, name: 'Chá', price: 1.60, image: foodImages.cafe, rating: 4.0, prepTime: 2, icon: <GiCoffeeCup className="text-green-500" />, type: 'drink' },
      { id: 39, name: 'Cappuccino', price: 3.00, image: foodImages.cafe, rating: 4.7, prepTime: 5, icon: <GiCoffeeCup className="text-brown-200" />, type: 'drink' },
      { id: 40, name: 'Caricoa de Limão', price: 1.00, image: foodImages.cafe, rating: 3.9, prepTime: 2, icon: <GiCoffeeCup className="text-yellow-500" />, type: 'drink' },
      { id: 41, name: 'Chocolate Quente', price: 3.00, image: foodImages.cafe, rating: 4.8, prepTime: 5, icon: <GiChocolateBar className="text-brown-800" />, type: 'drink' },
      { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: foodImages.cafe, rating: 4.3, prepTime: 5, icon: <FaBreadSlice className="text-yellow-600" />, type: 'food' },
      { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: foodImages.cafe, rating: 4.1, prepTime: 4, icon: <FaBreadSlice className="text-yellow-500" />, type: 'food' },
      { id: 44, name: 'Meia Torrada', price: 1.00, image: foodImages.cafe, rating: 4.0, prepTime: 3, icon: <FaBreadSlice className="text-yellow-400" />, type: 'food' },
      { id: 45, name: 'Croissant Misto', price: 3.00, image: foodImages.cafe, rating: 4.6, prepTime: 5, icon: <FaBreadSlice className="text-yellow-700" />, type: 'food' },
      { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: foodImages.cafe, rating: 4.7, prepTime: 6, icon: <FaBreadSlice className="text-yellow-800" />, type: 'food' },
      { id: 47, name: 'Tosta Mista', price: 3.20, image: foodImages.cafe, rating: 4.5, prepTime: 6, icon: <FaCheese className="text-yellow-500" />, type: 'food' },
      { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: foodImages.cafe, rating: 4.4, prepTime: 5, icon: <FaCheese className="text-yellow-400" />, type: 'food' },
      { id: 49, name: 'Sandes Mista', price: 2.20, image: foodImages.cafe, rating: 4.2, prepTime: 5, icon: <FaCheese className="text-yellow-300" />, type: 'food' },
      { id: 50, name: 'Pão com Ovo', price: 2.20, image: foodImages.cafe, rating: 4.1, prepTime: 5, icon: <GiMeal className="text-yellow-600" />, type: 'food' },
      { id: 51, name: 'Ovos com Bacon', price: 4.00, image: foodImages.cafe, rating: 4.7, prepTime: 8, icon: <GiMeal className="text-yellow-700" />, type: 'food' }
    ],
    bebidas: [
      { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: foodImages.bebida, rating: 4.8, prepTime: 5, icon: <FaGlassWhiskey className="text-green-500" />, type: 'drink' },
      { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: foodImages.bebida, rating: 4.9, prepTime: 5, icon: <FaGlassWhiskey className="text-black" />, type: 'drink' },
      { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: foodImages.bebida, rating: 4.7, prepTime: 2, icon: <FaGlassWhiskey className="text-amber-800" />, type: 'drink' },
      { id: 55, name: 'Whiskey J&B', price: 3.00, image: foodImages.bebida, rating: 4.5, prepTime: 2, icon: <FaGlassWhiskey className="text-amber-700" />, type: 'drink' },
      { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: foodImages.bebida, rating: 4.8, prepTime: 2, icon: <FaGlassWhiskey className="text-amber-900" />, type: 'drink' },
      { id: 57, name: 'Whiskey Black Label', price: 4.00, image: foodImages.bebida, rating: 4.9, prepTime: 2, icon: <FaGlassWhiskey className="text-black" />, type: 'drink' },
      { id: 58, name: 'Vodka', price: 4.00, image: foodImages.bebida, rating: 4.6, prepTime: 2, icon: <FaGlassWhiskey className="text-gray-300" />, type: 'drink' },
      { id: 59, name: 'Somersby', price: 2.50, image: foodImages.bebida, rating: 4.4, prepTime: 1, icon: <FaBeer className="text-yellow-400" />, type: 'drink' },
      { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: foodImages.bebida, rating: 4.5, prepTime: 1, icon: <FaBeer className="text-green-700" />, type: 'drink' },
      { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: foodImages.bebida, rating: 4.7, prepTime: 1, icon: <FaBeer className="text-green-800" />, type: 'drink' },
      { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: foodImages.bebida, rating: 4.3, prepTime: 1, icon: <FaBeer className="text-amber-600" />, type: 'drink' },
      { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: foodImages.bebida, rating: 4.2, prepTime: 1, icon: <FaBeer className="text-amber-500" />, type: 'drink' },
      { id: 64, name: 'Taça de Sangria', description: 'Sangria blanco, rosé ou tinta', price: 6.00, image: foodImages.bebida, rating: 4.8, prepTime: 5, icon: <FaWineGlassAlt className="text-purple-600" />, type: 'drink' },
      { id: 65, name: 'Refrigerante Lata', price: 1.60, image: foodImages.bebida, rating: 4.1, prepTime: 1, icon: <GiSodaCan className="text-red-500" />, type: 'drink' },
      { id: 66, name: 'Água 1.5L', price: 1.50, image: foodImages.bebida, rating: 4.0, prepTime: 1, icon: <GiSodaCan className="text-blue-400" />, type: 'drink' },
      { id: 67, name: 'Água 0.5L', price: 1.00, image: foodImages.bebida, rating: 4.0, prepTime: 1, icon: <GiSodaCan className="text-blue-300" />, type: 'drink' },
      { id: 68, name: 'Água 0.33L', price: 0.60, image: foodImages.bebida, rating: 4.0, prepTime: 1, icon: <GiSodaCan className="text-blue-200" />, type: 'drink' },
      { id: 69, name: 'Água Castelo', price: 1.40, image: foodImages.bebida, rating: 4.2, prepTime: 1, icon: <GiSodaCan className="text-blue-500" />, type: 'drink' },
      { id: 70, name: 'Água das Pedras', price: 1.40, image: foodImages.bebida, rating: 4.3, prepTime: 1, icon: <GiSodaCan className="text-blue-600" />, type: 'drink' }
    ],
    salgados: [
      { id: 71, name: 'Pão de Queijo', price: 1.60, image: foodImages.salgado, rating: 4.5, prepTime: 3, icon: <FaCheese className="text-yellow-500" />, type: 'food' },
      { id: 72, name: 'Pastel de Nata', price: 1.30, image: foodImages.salgado, rating: 4.7, prepTime: 2, icon: <GiCakeSlice className="text-yellow-400" />, type: 'food' },
      { id: 73, name: 'Empada de Frango', price: 2.00, image: foodImages.salgado, rating: 4.4, prepTime: 5, icon: <GiMeal className="text-yellow-600" />, type: 'food' },
      { id: 74, name: 'Kibe', price: 2.20, image: foodImages.salgado, rating: 4.3, prepTime: 4, icon: <GiMeal className="text-brown-600" />, type: 'food' },
      { id: 75, name: 'Fiambre e Queijo', price: 2.20, image: foodImages.salgado, rating: 4.2, prepTime: 3, icon: <FaCheese className="text-yellow-300" />, type: 'food' },
      { id: 76, name: 'Bauru', price: 2.20, image: foodImages.salgado, rating: 4.1, prepTime: 4, icon: <FaBreadSlice className="text-yellow-500" />, type: 'food' },
      { id: 77, name: 'Bola de Queijo', price: 2.20, image: foodImages.salgado, rating: 4.3, prepTime: 3, icon: <FaCheese className="text-yellow-400" />, type: 'food' },
      { id: 78, name: 'Coxinha de Frango', price: 2.20, image: foodImages.salgado, rating: 4.6, prepTime: 5, icon: <FaDrumstickBite className="text-amber-600" />, type: 'food' },
      { id: 79, name: 'Coxinha com Catupiry', price: 3.00, image: foodImages.salgado, rating: 4.8, prepTime: 6, icon: <FaCheese className="text-yellow-500" />, type: 'food' },
      { id: 80, name: 'Hamburgão', price: 3.50, image: foodImages.salgado, rating: 4.7, prepTime: 7, icon: <FaHamburger className="text-amber-700" />, type: 'food' }
    ],
    sobremesas: [
      { id: 81, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: foodImages.sobremesa, rating: 4.8, prepTime: 5, icon: <GiCakeSlice className="text-brown-600" />, type: 'food' },
      { id: 82, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: foodImages.sobremesa, rating: 4.9, prepTime: 5, icon: <GiChocolateBar className="text-brown-800" />, type: 'food' },
      { id: 83, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: foodImages.sobremesa, rating: 4.7, prepTime: 5, icon: <GiFruitBowl className="text-yellow-500" />, type: 'food' },
      { id: 84, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: foodImages.sobremesa, rating: 4.8, prepTime: 5, icon: <GiChocolateBar className="text-brown-700" />, type: 'food' },
      { id: 85, name: 'Cheesecake - Goiabada', price: 3.50, image: foodImages.sobremesa, rating: 4.7, prepTime: 5, icon: <GiCakeSlice className="text-pink-500" />, type: 'food' },
      { id: 86, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: foodImages.sobremesa, rating: 4.8, prepTime: 5, icon: <GiCakeSlice className="text-red-500" />, type: 'food' },
      { id: 87, name: 'Brigadeiro Tradicional', price: 1.50, image: foodImages.sobremesa, rating: 4.6, prepTime: 2, icon: <GiChocolateBar className="text-brown-600" />, type: 'food' },
      { id: 88, name: 'Brigadeiro Beijinho', price: 1.50, image: foodImages.sobremesa, rating: 4.5, prepTime: 2, icon: <GiChocolateBar className="text-white" />, type: 'food' },
      { id: 89, name: 'Brigadeiro Ninho', price: 2.00, image: foodImages.sobremesa, rating: 4.8, prepTime: 3, icon: <GiChocolateBar className="text-white" />, type: 'food' },
      { id: 90, name: 'Brigadeiro Paçoca', price: 2.00, image: foodImages.sobremesa, rating: 4.7, prepTime: 3, icon: <GiChocolateBar className="text-yellow-700" />, type: 'food' },
      { id: 91, name: 'Brigadeiro Morango', price: 2.00, image: foodImages.sobremesa, rating: 4.8, prepTime: 3, icon: <GiChocolateBar className="text-pink-400" />, type: 'food' },
      { id: 92, name: 'Brigadeiro Churros', price: 2.00, image: foodImages.sobremesa, rating: 4.9, prepTime: 3, icon: <GiChocolateBar className="text-yellow-600" />, type: 'food' },
      { id: 93, name: 'Tarte de Toblerone', price: 2.20, image: foodImages.sobremesa, rating: 4.7, prepTime: 5, icon: <GiCakeSlice className="text-yellow-500" />, type: 'food' },
      { id: 94, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: foodImages.sobremesa, rating: 4.8, prepTime: 5, icon: <GiCakeSlice className="text-brown-700" />, type: 'food' }
    ]
  };

  // Professional categories with premium icons
  const categories = [
    { id: 'todos', name: 'Menu Completo', icon: <FiGrid className="text-indigo-500" />, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'semana', name: 'Pratos do Dia', icon: <GiMeal className="text-rose-500" />, color: 'bg-rose-100 text-rose-800' },
    { id: 'lanches', name: 'Lanches', icon: <FaHamburger className="text-amber-700" />, color: 'bg-amber-100 text-amber-800' },
    { id: 'porcoes', name: 'Porções', icon: <GiMeal className="text-yellow-600" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'pasteis', name: 'Pastéis', icon: <GiFullPizza className="text-yellow-700" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'cafe', name: 'Café da Manhã', icon: <GiCoffeeCup className="text-brown-600" />, color: 'bg-brown-100 text-brown-800' },
    { id: 'bebidas', name: 'Bebidas', icon: <FaWineGlassAlt className="text-purple-600" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'salgados', name: 'Salgados', icon: <FaCheese className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'sobremesas', name: 'Sobremesas', icon: <GiCakeSlice className="text-pink-500" />, color: 'bg-pink-100 text-pink-800' }
  ];

  // Update elapsed time for occupied tables
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeElapsed = {};
      tables.forEach(table => {
        if (table.status === 'ocupada' && table.time) {
          newTimeElapsed[table.id] = (newTimeElapsed[table.id] || table.time) + 1;
        }
      });
      setTimeElapsed(newTimeElapsed);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [tables]);

  const filteredTables = activeCategory === 'todos' 
    ? tables 
    : tables.filter(table => 
        table.area.toLowerCase().includes(activeCategory.toLowerCase()) || 
        table.status === activeCategory ||
        (activeCategory === 'outdoor' && table.outdoor)
      );

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const addToCart = (item) => {
    setCart([...cart, { 
      ...item, 
      id: Date.now(), 
      quantity: 1,
      timestamp: new Date().toLocaleTimeString(),
      status: 'pendente',
      table: selectedTable.name
    }]);
    toast.success(`${item.name} adicionado à comanda!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    toast.error('Item removido da comanda!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  const calculateServiceFee = () => {
    return calculateTotal() * 0.10; // 10% service fee
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateServiceFee();
  };

  const openTable = (table) => {
    if (table.status === 'ocupada') {
      setSelectedTable(table);
      return;
    }
    
    setShowCustomerModal(true);
    setEditingTable(table);
    setEditCustomerCount(1);
  };

  const confirmOpenTable = () => {
    const updatedTables = tables.map(t => 
      t.id === editingTable.id 
        ? { ...t, status: 'ocupada', customers: editCustomerCount, time: 0 } 
        : t
    );
    
    setTables(updatedTables);
    setSelectedTable(editingTable);
    setCustomerCount(editCustomerCount);
    setShowCustomerModal(false);
    setCart([]);
    
    toast.success(`Mesa ${editingTable.name} aberta com ${editCustomerCount} cliente(s)!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const closeTable = () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    // Close the table
    const updatedTables = tables.map(t => 
      t.id === selectedTable.id 
        ? { ...t, status: 'livre', customers: 0, time: 0 } 
        : t
    );
    
    setTables(updatedTables);
    setSelectedTable(null);
    setCart([]);
    setShowPaymentModal(false);
    setPaymentMethod('');
    
    toast.success(`Conta da Mesa ${selectedTable.name} fechada com sucesso!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const sendToKitchen = async () => {
    // Filter only food items
    const foodItems = cart.filter(item => item.type === 'food');
    
    if (foodItems.length === 0) {
      toast.warn('Nenhum item de comida para enviar à cozinha!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Mark items as sent to kitchen
    setCart(cart.map(item => ({
      ...item,
      status: item.type === 'food' ? 'enviado' : item.status,
      kitchenTime: item.type === 'food' ? new Date().toLocaleTimeString() : item.kitchenTime
    })));
    
    try {
      // Send order to admin panel
      await axios.post('http://localhost:3000/admin/orders', {
        table: selectedTable.name,
        items: foodItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          status: 'preparando'
        })),
        timestamp: new Date().toISOString()
      });
      
      toast.success('Pedido enviado para a cozinha e painel administrativo!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast.error('Erro ao enviar pedido para o painel administrativo', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const sendToBar = () => {
    // Filter only drink items
    const drinkItems = cart.filter(item => item.type === 'drink');
    
    if (drinkItems.length === 0) {
      toast.warn('Nenhum item de bebida para enviar ao bar!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Mark items as sent to bar
    setCart(cart.map(item => ({
      ...item,
      status: item.type === 'drink' ? 'enviado' : item.status,
      barTime: item.type === 'drink' ? new Date().toLocaleTimeString() : item.barTime
    })));
    
    toast.success('Pedido enviado para o bar!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const addNewTable = () => {
    const newTableObj = {
      id: Math.max(...tables.map(t => t.id)) + 1,
      name: newTable.name || `Mesa ${Math.max(...tables.map(t => t.id)) + 1}`,
      area: newTable.area,
      status: 'livre',
      capacity: newTable.capacity,
      icon: newTable.area === 'Área Externa' ? <FaUmbrellaBeach className="text-teal-600" /> : <FaChair className="text-indigo-600" />,
      location: newTable.location || 'Nova localização',
      customers: 0
    };
    
    setTables([...tables, newTableObj]);
    setShowTableModal(false);
    setNewTable({
      name: '',
      area: 'Área Principal',
      capacity: 2,
      location: '',
      outdoor: false
    });
    
    toast.success('Nova mesa adicionada com sucesso!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const updatePrinterSettings = () => {
    setShowPrinterModal(false);
    toast.success('Configurações da impressora atualizadas!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'livre': return 'bg-emerald-100 text-emerald-800';
      case 'ocupada': return 'bg-rose-100 text-rose-800';
      case 'reservada': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAreaColor = (area) => {
    switch(area) {
      case 'Área Principal': return 'bg-indigo-100 text-indigo-800';
      case 'Área Externa': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemStatusColor = (status) => {
    switch(status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'preparando': return 'bg-purple-100 text-purple-800';
      case 'pronto': return 'bg-green-100 text-green-800';
      case 'entregue': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeTab === 'qr') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        >
          <div className={`p-6 ${colors.primary} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Cardápio Digital Premium</h2>
                <p className="opacity-90">Restaurante Alto Astral</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <FaQrcode size={24} />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-center mb-6 p-4 bg-white rounded-lg border-2 border-dashed border-indigo-200">
              <QRCode 
                value={`${window.location.origin}/cardapio`} 
                size={200} 
                level="H"
                fgColor="#6366f1"
                imageSettings={{
                  src: 'https://i.imgur.com/5BqTSXW.png',
                  height: 40,
                  width: 40,
                  excavate: true
                }}
              />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                Escaneie este QR code para acessar nosso cardápio digital premium
              </p>
              <p className="text-sm text-gray-500">
                Experiência gastronômica completa em seu dispositivo
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('mesas')}
              className={`w-full flex items-center justify-center gap-2 ${colors.primary} hover:${colors.primaryHover} text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md`}
            >
              <FiChevronRight className="transform rotate-180" />
              Voltar para Mesas
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedTable) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        {/* Premium Header */}
        <header className={`${colors.primary} text-white shadow-lg`}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <span className="bg-white/10 p-2 rounded-lg">{selectedTable.icon}</span>
                <span>
                  {selectedTable.name}
                  <span className="block text-sm font-normal opacity-90">{selectedTable.area} • {selectedTable.location}</span>
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedTable.status)}`}>
                  {selectedTable.status === 'ocupada' ? `Ocupada (${timeElapsed[selectedTable.id] || selectedTable.time} min)` : selectedTable.status}
                </span>
                <span className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full text-sm">
                  <FiUser size={14} />
                  {selectedTable.capacity} {selectedTable.capacity > 1 ? 'lugares' : 'lugar'}
                </span>
                {selectedTable.customers > 0 && (
                  <span className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full text-sm">
                    <FiUser size={14} />
                    {selectedTable.customers} {selectedTable.customers > 1 ? 'clientes' : 'cliente'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('qr')}
                className="flex items-center gap-2 bg-white/90 text-indigo-700 hover:bg-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm border border-indigo-200"
              >
                <FaQrcode />
                Cardápio QR
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTable(null)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                <FiChevronRight className="transform rotate-180" />
                Voltar
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Menu Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="font-bold text-xl text-gray-800 flex items-center gap-3">
                    <FiMenu className="text-indigo-600" /> 
                    <span>Cardápio Premium</span>
                    <span className="ml-auto text-sm font-normal text-gray-500 flex items-center gap-1">
                      <FiMapPin size={14} /> {selectedTable.area}
                    </span>
                  </h2>
                </div>
                
                {/* Categories */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 overflow-x-auto">
                  <div className="flex space-x-2">
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeCategory === category.id
                            ? `${category.color} shadow-md`
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {category.icon}
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-4">
                  {Object.entries(menu).map(([categoryId, items]) => (
                    <div key={categoryId} className="mb-6">
                      <motion.button
                        onClick={() => toggleCategory(categoryId)}
                        className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg mb-2"
                      >
                        <div className="flex items-center gap-2">
                          {categories.find(c => c.id === categoryId)?.icon || <FiGrid />}
                          <span className="font-medium">
                            {categories.find(c => c.id === categoryId)?.name || categoryId}
                          </span>
                        </div>
                        <FiChevronDown className={`transition-transform ${expandedCategories[categoryId] ? 'transform rotate-180' : ''}`} />
                      </motion.button>
                      
                      <AnimatePresence>
                        {(expandedCategories[categoryId] || activeCategory === categoryId) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {items.map(item => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  whileHover={{ y: -2 }}
                                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-sm transition-all relative group"
                                >
                                  <div className="relative h-40 overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-3 text-white">
                                      <h3 className="font-semibold text-lg">{item.name}</h3>
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <FiStar 
                                            key={i} 
                                            size={14} 
                                            className={i < Math.floor(item.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} 
                                          />
                                        ))}
                                        <span className="text-xs ml-1 opacity-90">{item.rating}</span>
                                      </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                      <FiClock size={10} /> {item.prepTime} min
                                    </div>
                                    {item.veg && (
                                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                        Veg
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                      {item.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-indigo-600 font-bold">
                                        €{item.price.toFixed(2)}
                                      </span>
                                      <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(item)}
                                        className={`${colors.primary} hover:${colors.primaryHover} text-white py-1 px-3 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors`}
                                      >
                                        <FiPlus size={14} /> Adicionar
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Section */}
            <div>
              <div className="bg-white rounded-xl shadow-sm sticky top-4 overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                      <FiShoppingCart className="text-indigo-600" /> 
                      <span>Comanda Premium</span>
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`${colors.primary} text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center`}>
                        {cart.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Cart Items */}
                <div className="p-4 max-h-[400px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <FiShoppingCart className="mx-auto text-gray-300 text-4xl mb-3" />
                      <p className="text-gray-500">Nenhum item adicionado</p>
                      <p className="text-sm text-gray-400">Selecione itens do menu premium</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 flex items-center gap-2">
                              {item.icon || <FiZap size={14} className="text-indigo-500" />}
                              <span>{item.name}</span>
                              <span className={`ml-auto text-xs px-2 py-1 rounded-full ${getItemStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.timestamp} • {item.prepTime} min
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <button 
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="px-2 text-sm font-medium">{item.quantity || 1}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                            <span className="font-semibold text-indigo-600 whitespace-nowrap">
                              €{(item.price * (item.quantity || 1)).toFixed(2)}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Cart Summary */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-800">
                        €{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taxa de Serviço (10%):</span>
                      <span className="font-medium text-gray-800">
                        €{calculateServiceFee().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-700">Total:</span>
                      <span className="font-bold text-xl text-indigo-600">
                        €{calculateGrandTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendToKitchen}
                      disabled={cart.length === 0}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                        cart.length === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <GiCook size={16} />
                      <span className="text-sm font-medium">Enviar Cozinha</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendToBar}
                      disabled={cart.length === 0}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                        cart.length === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <FaGlassWhiskey size={16} />
                      <span className="text-sm font-medium">Enviar Bar</span>
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeTable}
                    disabled={cart.length === 0}
                    className={`mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all shadow-sm ${
                      cart.length === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : `${colors.primary} hover:${colors.primaryHover} text-white`
                    }`}
                  >
                    <FaReceipt size={16} />
                    Fechar Conta (€{calculateGrandTotal().toFixed(2)})
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Count Modal */}
        <AnimatePresence>
          {showCustomerModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className={`p-6 ${colors.primary} text-white`}>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FiUser /> Abrir Mesa {editingTable?.name}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Número de Clientes:</label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button 
                        onClick={() => setEditCustomerCount(prev => Math.max(1, prev - 1))}
                        className="px-4 py-2 text-gray-500 hover:bg-gray-100"
                      >
                        <FiMinus size={18} />
                      </button>
                      <span className="px-4 py-2 text-lg font-medium">{editCustomerCount}</span>
                      <button 
                        onClick={() => setEditCustomerCount(prev => Math.min(editingTable.capacity, prev + 1))}
                        className="px-4 py-2 text-gray-500 hover:bg-gray-100"
                      >
                        <FiPlus size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Capacidade máxima: {editingTable?.capacity} lugares
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCustomerModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all"
                    >
                      Cancelar
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmOpenTable}
                      className={`flex-1 ${colors.primary} hover:${colors.primaryHover} text-white py-3 px-4 rounded-lg font-medium transition-all`}
                    >
                      Confirmar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className={`p-6 ${colors.primary} text-white`}>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FiDollarSign /> Finalizar Pagamento
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">€{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de Serviço:</span>
                      <span className="font-medium">€{calculateServiceFee().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-lg text-indigo-600">€{calculateGrandTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">Método de Pagamento</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Dinheiro', 'Cartão', 'MBWay', 'Transferência'].map(method => (
                        <motion.button
                          key={method}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-3 rounded-lg border transition-all ${
                            paymentMethod === method
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {method === 'Cartão' ? <FiCreditCard className="inline mr-2" /> : null}
                          {method === 'MBWay' ? <FiPhone className="inline mr-2" /> : null}
                          {method}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all"
                    >
                      Cancelar
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmPayment}
                      disabled={!paymentMethod}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        !paymentMethod
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : `${colors.primary} hover:${colors.primaryHover} text-white`
                      }`}
                    >
                      Confirmar Pagamento
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Main Tables View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer />
      {/* Premium Header */}
      <header className={`${colors.primary} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Restaurante Alto Astral</h1>
            <p className="text-sm opacity-90">Sistema de Gerenciamento Premium</p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTableModal(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              <FiPlus size={16} />
              Nova Mesa
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPrinterModal(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              <FiPrinter size={16} />
              Impressora
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('qr')}
              className="flex items-center gap-2 bg-white/90 text-indigo-700 hover:bg-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm border border-indigo-200"
            >
              <FaQrcode/>
              Cardápio QR
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-3">
            {['todos', 'Área Principal', 'Área Externa', 'livre', 'ocupada'].map(filter => (
              <motion.button
                key={filter}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === filter
                    ? `${colors.primary} text-white shadow-md`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter === 'todos' ? 'Todas Mesas' : 
                 filter === 'livre' ? 'Mesas Livres' : 
                 filter === 'ocupada' ? 'Mesas Ocupadas' : filter}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredTables.map(table => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -5, shadow: 'lg' }}
                onClick={() => openTable(table)}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all border-l-4 ${
                  table.status === 'livre' 
                    ? 'border-emerald-400 hover:shadow-lg' 
                    : table.status === 'ocupada' 
                      ? 'border-rose-400' 
                      : 'border-amber-400'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">{table.icon}</span>
                        <span>{table.name}</span>
                      </h3>
                      <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${getAreaColor(table.area)}`}>
                        {table.area}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(table.status)}`}>
                        {table.status === 'ocupada' ? `Ocupada (${timeElapsed[table.id] || table.time} min)` : table.status}
                      </span>
                      <div className="flex items-center mt-3 text-sm text-gray-600">
                        <FiUser className="mr-2" size={14} />
                        {table.capacity} {table.capacity > 1 ? 'lugares' : 'lugar'}
                      </div>
                    </div>
                  </div>
                  
                  {table.status === 'ocupada' && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-2" size={16} />
                        <span>{timeElapsed[table.id] || table.time} minutos</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {table.customers} {table.customers > 1 ? 'pessoas' : 'pessoa'}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {table.location}
                  </div>
                </div>
                
                {table.status === 'livre' && (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 text-center">
                    <span className="text-sm font-medium text-emerald-700 flex items-center justify-center gap-2">
                      <FiPlus size={16} /> Abrir Mesa
                    </span>
                  </div>
                )}
                
                {table.status === 'ocupada' && (
                  <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-4 text-center">
                    <span className="text-sm font-medium text-rose-700 flex items-center justify-center gap-2">
                      <FiEdit2 size={16} /> Ver/Editar Pedido
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Table Modal */}
      <AnimatePresence>
        {showTableModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className={`p-6 ${colors.primary} text-white`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiPlus /> Adicionar Nova Mesa
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Nome da Mesa:</label>
                    <input
                      type="text"
                      value={newTable.name}
                      onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Mesa VIP 1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Área:</label>
                    <select
                      value={newTable.area}
                      onChange={(e) => setNewTable({...newTable, area: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Área Principal">Área Principal</option>
                      <option value="Área Externa">Área Externa</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Capacidade:</label>
                    <select
                      value={newTable.capacity}
                      onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {[2, 4, 6, 8, 10].map(num => (
                        <option key={num} value={num}>{num} pessoas</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Localização:</label>
                    <input
                      type="text"
                      value={newTable.location}
                      onChange={(e) => setNewTable({...newTable, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Perto da janela"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowTableModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all"
                  >
                    Cancelar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addNewTable}
                    className={`flex-1 ${colors.primary} hover:${colors.primaryHover} text-white py-3 px-4 rounded-lg font-medium transition-all`}
                  >
                    Adicionar Mesa
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Printer Settings Modal */}
      <AnimatePresence>
        {showPrinterModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className={`p-6 ${colors.primary} text-white`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiPrinter /> Configurações da Impressora
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">IP da Impressora:</label>
                    <input
                      type="text"
                      value={printerIP}
                      onChange={(e) => setPrinterIP(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: 192.168.1.100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Testar Conexão:</label>
                    <button className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
                      Testar Impressora
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPrinterModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all"
                  >
                    Cancelar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={updatePrinterSettings}
                    className={`flex-1 ${colors.primary} hover:${colors.primaryHover} text-white py-3 px-4 rounded-lg font-medium transition-all`}
                  >
                    Salvar Configurações
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterfaceRestaurante;