import React, { useState, useEffect, useMemo, useRef } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { loginAnonimo } from './firebase';
import { 
  FiShoppingCart, FiClock, FiCheck, FiTruck, 
  FiHome, FiPieChart, FiSettings, FiPlus, FiEdit, FiTrash2,
  FiFilter, FiSearch, FiPrinter, FiDownload, FiRefreshCw, FiAlertCircle,
  FiArrowLeft, FiX, FiInfo, FiUser, FiUsers, FiPlusCircle, FiMinusCircle, FiCalendar, FiMinus, FiCoffee,
  FiChevronDown, FiChevronUp, FiTag, FiDollarSign, FiPackage, FiList,FiCheckCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from './assets/logo-alto-astral.png';
import { database } from './firebase';

// Configurações da impressora Bluetooth
const PRINTER_CONFIG = {
  deviceName: "BlueTooth Printer",
  serviceUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
  characteristicUUID: "0000ff02-0000-1000-8000-00805f9b34fb",
  maxRetries: 3,
  chunkSize: 100,
  delayBetweenChunks: 100
};

// Componentes UI atualizados
const Typography = ({ children, variant = 'body', className = '', color = 'default' }) => {
  const variants = {
    h1: 'text-3xl md:text-4xl font-bold',
    h2: 'text-2xl md:text-3xl font-bold',
    h3: 'text-xl md:text-2xl font-semibold',
    subtitle: 'text-lg font-medium',
    body: 'text-base',
    caption: 'text-sm'
  };

  const colors = {
    default: 'text-gray-800',
    primary: 'text-astral',
    secondary: 'text-gray-600',
    light: 'text-gray-500',
    white: 'text-white',
    danger: 'text-red-600',
    success: 'text-green-600'
  };

  return (
    <div className={`${variants[variant]} ${colors[color]} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'medium', icon: Icon, iconPosition = 'left', className = '', disabled = false, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-astral to-astral-dark text-white shadow-lg hover:shadow-astral/30',
    secondary: 'bg-gray-800 hover:bg-gray-900 text-white',
    outline: 'border border-astral text-astral hover:bg-astral/10',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    premium: 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg hover:shadow-purple-500/30',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
  };

  const sizes = {
    small: 'py-1.5 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-5 text-lg'
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="flex-shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="flex-shrink-0" />}
    </motion.button>
  );
};

const Card = ({ children, className = '', hoverEffect = false, noPadding = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 
      ${hoverEffect ? 'hover:shadow-md transition-all duration-300' : ''} 
      ${noPadding ? '' : 'p-4 md:p-6'} ${className}`}>
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
    dark: 'bg-gray-800 text-white',
    premium: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    'pending': { color: 'warning', text: 'Pendente', icon: <FiClock className="mr-1" /> },
    'preparing': { color: 'info', text: 'Em Preparo', icon: <FiPackage className="mr-1" /> },
    'ready': { color: 'success', text: 'Pronto', icon: <FiCheck className="mr-1" /> },
    'completed': { color: 'dark', text: 'Concluído', icon: <FiCheckCircle className="mr-1" /> },
    'canceled': { color: 'danger', text: 'Cancelado', icon: <FiX className="mr-1" /> },
    'editing': { color: 'info', text: 'Em Edição', icon: <FiEdit className="mr-1" /> }
  };

  return (
    <Badge variant={statusMap[status]?.color || 'default'} className="flex items-center">
      {statusMap[status]?.icon}
      {statusMap[status]?.text || status}
    </Badge>
  );
};

const Input = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400" />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent transition`}
          {...props}
        />
      </div>
    </div>
  );
};

const Select = ({ label, options, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>}
      <select
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent bg-white transition"
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
    xl: 'max-w-5xl',
    full: 'max-w-full w-full h-full rounded-none'
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
            className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col overflow-hidden`}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-astral to-astral-dark">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 p-1 transition"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              {children}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end space-x-3 bg-white">
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


// Menu data structure (mantido igual)
const menu = {
  semana: [
    { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 }
  ],
  lanches: [
    { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 3.9 }
  ],
  porcoes: [
    { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 }
  ],
  pasteis: [
    { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 }
  ],
  cafe: [
    { id: 31, name: 'Café Expresso', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 32, name: 'Café Descafeinado', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 33, name: 'Café Duplo', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 34, name: 'Garoto', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 35, name: 'Abatanado', price: 1.10, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 36, name: 'Meia de Leite', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 37, name: 'Galão', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 38, name: 'Chá', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 39, name: 'Cappuccino', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 40, name: 'Caricoa de Limão', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 3.9 },
    { id: 41, name: 'Chocolate Quente', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 44, name: 'Meia Torrada', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 45, name: 'Croissant Misto', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 47, name: 'Tosta Mista', price: 3.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 49, name: 'Sandes Mista', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 50, name: 'Pão com Ovo', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 51, name: 'Ovos com Bacon', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 }
  ],
  bebidas: [
    { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 55, name: 'Whiskey J&B', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 57, name: 'Whiskey Black Label', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 58, name: 'Vodka', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 59, name: 'Somersby', price: 2.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 64, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 65, name: 'Refrigerante Lata', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 66, name: 'Água 1.5L', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 67, name: 'Água 0.5L', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 68, name: 'Água 0.33L', price: 0.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 69, name: 'Água Castelo', price: 1.40, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 70, name: 'Água das Pedras', price: 1.40, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 }
  ],
  salgados: [
    { id: 71, name: 'Pão de Queijo', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 72, name: 'Pastel de Nata', price: 1.30, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 73, name: 'Empada de Frango', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 74, name: 'Kibe', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 75, name: 'Fiambre e Queijo', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 76, name: 'Bauru', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 77, name: 'Bola de Queijo', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 78, name: 'Coxinha de Frango', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 79, name: 'Coxinha com Catupiry', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 80, name: 'Hamburgão', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 }
  ],
  sobremesas: [
    { id: 81, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 82, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 83, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 84, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 85, name: 'Cheesecake - Goiabada', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 86, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 87, name: 'Brigadeiro Tradicional', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 88, name: 'Brigadeiro Beijinho', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 89, name: 'Brigadeiro Ninho', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 90, name: 'Brigadeiro Paçoca', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 91, name: 'Brigadeiro Morango', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 92, name: 'Brigadeiro Churros', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 93, name: 'Tarte de Toblerone', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 94, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 }
  ]
};

/// Novo componente para exibir itens do menu
const MenuItemCard = ({ item, onAdd, onRemove, currentQuantity = 0 }) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Typography variant="body" className="font-medium truncate">{item.name}</Typography>
            {item.description && (
              <Typography variant="caption" className="text-gray-500 truncate block">
                {item.description}
              </Typography>
            )}
          </div>
          <Typography variant="body" className="font-medium text-astral ml-2 whitespace-nowrap">
            €{item.price.toFixed(2)}
          </Typography>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          {currentQuantity > 0 ? (
            <>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
                >
                  <FiMinus size={16} />
                </button>
                <span className="px-3 py-1 bg-white w-12 text-center border-x border-gray-200">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => onAdd(item)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              <Typography variant="body" className="font-medium">
                €{(item.price * currentQuantity).toFixed(2)}
              </Typography>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="small" 
              onClick={() => onAdd(item)}
              className="w-full"
            >
              <FiPlus className="mr-1" /> Adicionar
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const OrderItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition">
      <div className="flex-1 min-w-0">
        <Typography variant="body" className="font-medium truncate">{item.name}</Typography>
        <Typography variant="caption" className="text-gray-500">
          €{item.price.toFixed(2)} un.
        </Typography>
      </div>
      
      <div className="flex items-center ml-4">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
            disabled={item.quantity <= 1}
          >
            <FiMinus size={16} />
          </button>
          <span className="px-3 py-1 bg-white w-12 text-center border-x border-gray-200">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
          >
            <FiPlus size={16} />
          </button>
        </div>
        
        <Typography variant="body" className="font-medium ml-4 w-20 text-right">
          €{(item.price * item.quantity).toFixed(2)}
        </Typography>
        
        <button
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-500 hover:text-red-700 p-1 transition"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const CategoryTabs = ({ categories, activeCategory, onSelect, className = '' }) => {
  return (
    <div className={`flex space-x-2 overflow-x-auto pb-2 ${className}`}>
      {categories.map(category => (
        <motion.button
          key={category.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(category.key);
          }}
          className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
            activeCategory === category.key 
              ? 'bg-astral text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {category.icon && <category.icon className="mr-2" />}
          {category.label}
        </motion.button>
      ))}
    </div>
  );
};

const PrintButton = ({ order, isPrinting, printOrder }) => (
  <Button
    variant="outline"
    icon={FiPrinter}
    onClick={(e) => {
      e.stopPropagation();
      printOrder(order);
    }}
    disabled={isPrinting}
    className="mr-2"
  >
    {isPrinting ? 'Imprimindo...' : 'Imprimir'}
  </Button>
);

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeArea, setActiveArea] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [activeOrderType, setActiveOrderType] = useState('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [activeMenuCategory, setActiveMenuCategory] = useState('semana');
  const [expandedCategories, setExpandedCategories] = useState({
    semana: true,
    lanches: true,
    porcoes: true,
    pasteis: true,
    cafe: true,
    bebidas: true,
    salgados: true,
    sobremesas: true
  });
  const [printerConnected, setPrinterConnected] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [printedItems, setPrintedItems] = useState({});
  const [printerReconnectAttempted, setPrinterReconnectAttempted] = useState(false);

  const printerDeviceRef = useRef(null);
  const printerCharacteristicRef = useRef(null);

  // Categorias do menu para navegação
  const menuCategories = [
    { key: 'semana', label: 'Pratos da Semana', icon: FiHome },
    { key: 'lanches', label: 'Lanches', icon: FiShoppingCart },
    { key: 'porcoes', label: 'Porções', icon: FiUsers },
    { key: 'pasteis', label: 'Pasteis', icon: FiTag },
    { key: 'cafe', label: 'Café', icon: FiCoffee },
    { key: 'bebidas', label: 'Bebidas', icon: FiTruck },
    { key: 'salgados', label: 'Salgados', icon: FiClock },
    { key: 'sobremesas', label: 'Sobremesas', icon: FiCheck }
  ];

  const savePrinterState = (device, characteristic) => {
    try {
      const printerState = {
        deviceId: device.id,
        deviceName: device.name,
        connected: device.gatt.connected,
        lastConnected: Date.now()
      };
      localStorage.setItem('bluetoothPrinter', JSON.stringify(printerState));
    } catch (err) {
      console.error('Erro ao salvar estado da impressora:', err);
    }
  };

  const clearPrinterState = () => {
    localStorage.removeItem('bluetoothPrinter');
    setPrinterConnected(false);
  };

  const handleDisconnection = () => {
    console.log('Impressora desconectada');
    clearPrinterState();
    printerDeviceRef.current = null;
    printerCharacteristicRef.current = null;
  };

  const connectToPrinter = async () => {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth não suportado neste navegador');
      }
  
      setIsPrinting(true);
      setError(null);
  
      if (printerDeviceRef.current?.gatt?.connected) {
        return true;
      }
  
      console.log('Procurando dispositivo Bluetooth...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: PRINTER_CONFIG.deviceName }],
        optionalServices: [PRINTER_CONFIG.serviceUUID]
      });
  
      if (!device) {
        throw new Error('Nenhum dispositivo selecionado');
      }
  
      device.addEventListener('gattserverdisconnected', handleDisconnection);
  
      console.log('Conectando ao servidor GATT...');
      const server = await device.gatt.connect();
      
      console.log('Obtendo serviço...');
      const service = await server.getPrimaryService(PRINTER_CONFIG.serviceUUID);
      
      console.log('Obtendo característica...');
      const characteristic = await service.getCharacteristic(PRINTER_CONFIG.characteristicUUID);
  
      printerDeviceRef.current = device;
      printerCharacteristicRef.current = characteristic;
      setPrinterConnected(true);
      savePrinterState(device, characteristic);
  
      console.log('Conectado com sucesso à impressora');
      return true;
    } catch (err) {
      console.error('Erro na conexão Bluetooth:', err);
      printerDeviceRef.current = null;
      printerCharacteristicRef.current = null;
      setPrinterConnected(false);
      setError(`Falha na conexão: ${err.message}`);
      return false;
    } finally {
      setIsPrinting(false);
    }
  };

  const sendToPrinter = async (data) => {
    let retryCount = 0;
    
    while (retryCount < PRINTER_CONFIG.maxRetries) {
      try {
        if (!printerDeviceRef.current?.gatt?.connected) {
          console.log(`Tentativa ${retryCount + 1}: Reconectando...`);
          const connected = await connectToPrinter();
          if (!connected) throw new Error('Falha ao reconectar');
        }
  
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        let offset = 0;
        
        console.log(`Enviando ${encodedData.length} bytes...`);
        
        while (offset < encodedData.length) {
          const chunk = encodedData.slice(offset, offset + PRINTER_CONFIG.chunkSize);
          await printerCharacteristicRef.current.writeValueWithoutResponse(chunk);
          offset += PRINTER_CONFIG.chunkSize;
          
          await new Promise(resolve => 
            setTimeout(resolve, PRINTER_CONFIG.delayBetweenChunks)
          );
        }
        
        console.log('Dados enviados com sucesso');
        return true;
        
      } catch (err) {
        retryCount++;
        console.error(`Tentativa ${retryCount} falhou:`, err);
        
        if (retryCount >= PRINTER_CONFIG.maxRetries) {
          console.error('Número máximo de tentativas atingido');
          setError(`Falha na impressão: ${err.message}`);
          return false;
        }
        
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * retryCount)
        );
      }
    }
  };

  const formatReceipt = (order) => {
    if (!order || !order.items || order.items.length === 0) return '';
  
    const ESC = '\x1B';
    const GS = '\x1D';
    const INIT = `${ESC}@`;
    const CENTER = `${ESC}a1`;
    const LEFT = `${ESC}a0`;
    const BOLD_ON = `${ESC}!${String.fromCharCode(8)}`;
    const BOLD_OFF = `${ESC}!${String.fromCharCode(0)}`;
    const CUT = `${GS}V0`;
    const LF = '\x0A';
    const FEED = '\x1Bd';
  
    let receipt = INIT;
    receipt += `${CENTER}${BOLD_ON}RESTAURANTE ALTO ASTRAL${BOLD_OFF}${LF}`;
    receipt += `PEDIDO: #${order.id?.slice(0, 6) || 'N/A'}${LF}`;
    receipt += `${new Date().toLocaleString()}${LF}${LF}`;
    receipt += '--------------------------------' + LF;
    
    receipt += LEFT;
    order.items.forEach(item => {
      receipt += `${BOLD_ON}${item.quantity}x ${item.name}${BOLD_OFF}${LF}`;
      if (item.description) {
        receipt += `${item.description}${LF}`;
      }
      receipt += `€ ${(item.price * item.quantity).toFixed(2)}${LF}${LF}`;
    });
  
    receipt += '--------------------------------' + LF;
    receipt += `${BOLD_ON}TOTAL: € ${order.total.toFixed(2)}${BOLD_OFF}${LF}${LF}`;
    receipt += `${CENTER}Obrigado pela sua preferência!${LF}${LF}`;
    receipt += `${CENTER}Volte sempre${LF}${LF}`;
    receipt += `${FEED}${FEED}${CUT}`;
  
    return receipt;
  };

  const printOrder = async (order) => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    setPrintError(null);

    try {
      // Conecta à impressora se não estiver conectada
      if (!printerDeviceRef.current?.gatt?.connected) {
        const connected = await connectToPrinter();
        if (!connected) {
          throw new Error('Não foi possível conectar à impressora');
        }
      }

      // Formata o recibo
      const receipt = formatReceipt(order);
      
      // Envia para impressão
      const success = await sendToPrinter(receipt);
      
      if (success) {
        toast.success(`✅ Pedido #${order.id.slice(0, 6)} impresso com sucesso!`);
      } else {
        throw new Error('Falha ao enviar para impressora');
      }
    } catch (error) {
      setIsPrinting(false);
      setPrintError(error.message);
      toast.error(`❌ Falha na impressão: ${error.message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  const PrintButton = ({ order }) => (
    <Button
      variant="outline"
      icon={FiPrinter}
      onClick={(e) => {
        e.stopPropagation();
        printOrder(order);
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
        if (newStatus === 'preparing' || newStatus === 'ready') {
          await sendWhatsAppNotification(order, newStatus);
        }
        
        if (newStatus === 'preparing') {
          await printOrder(order);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const addItemToOrder = (item) => {
    if (!currentOrder) return;
  
    const updatedItems = [...currentOrder.items];
    const existingItemIndex = updatedItems.findIndex(i => i.id === item.id);
  
    if (existingItemIndex >= 0) {
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
    } else {
      updatedItems.push({
        ...item,
        quantity: 1
      });
    }
  
    // Recalcula o total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (!currentOrder || newQuantity < 1) return;
  
    const updatedItems = [...currentOrder.items];
    const itemIndex = updatedItems.findIndex(item => item.id === itemId);
  
    if (itemIndex >= 0) {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: newQuantity
      };
  
      // Recalcula o total
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setCurrentOrder({
        ...currentOrder,
        items: updatedItems,
        total: newTotal
      });
    }
  };

  const removeItemFromOrder = (itemId) => {
    if (!currentOrder) return;
  
    const updatedItems = [...currentOrder.items];
    const itemIndex = updatedItems.findIndex(item => item.id === itemId);
  
    if (itemIndex >= 0) {
      updatedItems.splice(itemIndex, 1);
    }
  
    // Recalcula o total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const saveOrderChanges = async () => {
    if (!currentOrder) return;
  
    try {
      const ordersRef = ref(database, 'orders');
      
      // Remove todos os pedidos originais da mesa
      const deletePromises = currentOrder.originalIds.map(orderId => {
        const orderRef = ref(database, `orders/${orderId}`);
        return remove(orderRef);
      });
  
      await Promise.all(deletePromises);
  
      // Cria um novo pedido consolidado com as alterações
      const newOrderRef = push(ordersRef);
      
      await update(newOrderRef, {
        items: currentOrder.items,
        total: currentOrder.total,
        status: currentOrder.status || 'pending',
        timestamp: new Date().toISOString(),
        customer: currentOrder.customer || { name: 'Cliente não informado', phone: '' },
        orderType: currentOrder.orderType,
        tableNumber: currentOrder.tableNumber || null, // Garante que o tableNumber está incluído
        originalIds: [newOrderRef.key]
      });
  
      toast.success(`Pedido da ${currentOrder.orderType === 'dine-in' ? 'mesa' : 'entrega'} ${currentOrder.tableNumber} atualizado com sucesso!`);
      
      setIsEditModalOpen(false);
      setIsEditingOrder(false);
  
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error('Erro ao atualizar pedido. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
  
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          items: data[key].items || [], // Garante que items existe
          customer: data[key].customer || { name: 'Cliente não informado', phone: '' },
          orderType: data[key].orderType || 'takeaway' // Define um padrão para orderType
        }));
        
        // Verifica se há um novo pedido para direcionar para a aba correta
        if (ordersArray.length > 0 && orders.length > 0) {
          const newOrder = ordersArray[0];
          const isNewOrder = !orders.some(order => order.id === newOrder.id);
          
          if (isNewOrder) {
            // Direciona para a aba de pedidos
            setActiveTab('orders');
            
            // Define a aba de tipo de pedido com base no orderType
            if (newOrder.orderType === 'dine-in') {
              setActiveOrderType('dine-in');
            } else if (newOrder.orderType === 'delivery') {
              setActiveOrderType('delivery');
            } else {
              setActiveOrderType('takeaway');
            }
          }
        }
        
        setOrders(ordersArray.reverse());
      } else {
        setOrders([]);
      }
    });
  }, [orders]);

  const deleteOrder = (orderId) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      const orderRef = ref(database, `orders/${orderId}`);
      remove(orderRef)
        .then(() => toast.success('Pedido excluído com sucesso!'))
        .catch(error => toast.error('Erro ao excluir pedido: ' + error.message));
    }
  };

  const extractTableNumber = (order) => {
    // Primeiro tenta pegar diretamente do pedido
    if (order.tableNumber) return order.tableNumber;
    
    // Depois tenta extrair da URL
    if (order.url) {
      try {
        const urlObj = new URL(order.url);
        const params = new URLSearchParams(urlObj.search);
        return params.get('tableNumber') || 'Não informado';
      } catch {
        return 'Não informado';
      }
    }
    
    // Finalmente, tenta pegar de qualquer outro lugar
    return order.table || 'Não informado';
  };

  // Função consolidateOrders modificada
  const consolidateOrders = (orders) => {
    const consolidatedOrders = [];
    const ordersMap = new Map();
  
    orders.forEach(order => {
      if (!order.items) order.items = [];
      
      // Para pedidos que não são de mesa, adiciona diretamente
      if (order.orderType !== 'dine-in') {
        consolidatedOrders.push({...order, originalIds: [order.id]});
        return;
      }
  
      // Extrai o número da mesa corretamente
      const tableNumber = extractTableNumber(order);
      const orderKey = `dine-in-${tableNumber}`;
      
      if (ordersMap.has(orderKey)) {
        const existingOrder = ordersMap.get(orderKey);
        
        order.items.forEach(newItem => {
          const existingItemIndex = existingOrder.items.findIndex(
            item => item.id === newItem.id
          );
  
          if (existingItemIndex >= 0) {
            existingOrder.items[existingItemIndex].quantity += newItem.quantity;
          } else {
            existingOrder.items.push({...newItem});
          }
        });
  
        existingOrder.total = existingOrder.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
  
        if (new Date(order.timestamp) > new Date(existingOrder.timestamp)) {
          existingOrder.timestamp = order.timestamp;
          existingOrder.status = order.status;
        }
        
        existingOrder.originalIds.push(order.id);
      } else {
        const newConsolidatedOrder = {
          ...order,
          tableNumber: tableNumber,
          items: order.items.map(item => ({...item})),
          originalIds: [order.id]
        };
        ordersMap.set(orderKey, newConsolidatedOrder);
        consolidatedOrders.push(newConsolidatedOrder);
      }
    });
  
    return consolidatedOrders;
  };

  const filteredOrders = useMemo(() => {
    const consolidated = consolidateOrders(orders);
    
    return consolidated
      .filter(order => {
        // Filtra por tipo de pedido
        if (activeOrderType !== 'all' && order.orderType !== activeOrderType) return false;
        
        // Filtra por status
        if (filter !== 'all' && order.status !== filter) return false;
        
        // Filtra por busca
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          const matchesId = order.id?.toLowerCase().includes(searchLower);
          const matchesTable = order.tableNumber?.toString().includes(searchLower);
          const matchesCustomer = order.customer?.name?.toLowerCase().includes(searchLower);
          
          if (!matchesId && !matchesTable && !matchesCustomer) return false;
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [orders, activeOrderType, filter, searchQuery]);

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    readyOrders: orders.filter(o => o.status === 'ready').length,
    todayRevenue: orders
      .filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
      .reduce((sum, order) => sum + (order.total || 0), 0),
    dineInOrders: orders.filter(o => o.orderType === 'dine-in').length,
    deliveryOrders: orders.filter(o => o.orderType === 'delivery').length,
    takeawayOrders: orders.filter(o => o.orderType === 'takeaway').length
  };
 

  const sendWhatsAppNotification = (order, newStatus) => {
    if (order.orderType === 'dine-in') return;
  
    const phone = order.customer?.phone;
    if (!phone) return;
  
    const cleanedPhone = phone.replace(/\D/g, '');
    
    let message = '';
    if (newStatus === 'preparing') {
      message = `Olá ${order.customer?.name || 'cliente'}! Seu pedido #${order.id.slice(0, 6)} está sendo preparado. Agradecemos pela preferência!`;
    } else if (newStatus === 'ready') {
      if (order.orderType === 'delivery') {
        message = `Olá ${order.customer?.name || 'cliente'}! Seu pedido #${order.id.slice(0, 6)} está pronto para entrega.`;
      } else {
        message = `Olá ${order.customer?.name || 'cliente'}! Seu pedido #${order.id.slice(0, 6)} está pronto para retirada.`;
      }
    }
  
    if (message) {
      const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };
  
  // Adicione esta constante antes do return
  const filteredMenuItems = useMemo(() => {
    const categoryItems = menu[activeMenuCategory] || [];
  
    if (!menuSearchQuery) return categoryItems;
  
    const query = menuSearchQuery.toLowerCase();
    return categoryItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query))
    );
  }, [activeMenuCategory, menuSearchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-astral to-astral-dark text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Alto Astral" className="h-10 mr-3" />
            <Typography variant="h1" className="text-2xl text-white">Painel Administrativo</Typography>
          </div>
          <Link 
            to="/restricted/dashboard"  // Assumindo que é a rota principal da área restrita
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Voltar Para o Dashboard
          </Link>
        </div>
      </header>


      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex space-x-1 p-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                activeTab === 'dashboard' 
                  ? 'bg-astral text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FiPieChart className="mr-2" />
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                activeTab === 'orders' 
                  ? 'bg-astral text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FiShoppingCart className="mr-2" />
              Pedidos
              {stats.pendingOrders > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.pendingOrders}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 pb-20">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <Typography variant="h2" className="mb-6">Visão Geral</Typography>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Total Pedidos</Typography>
                    <FiShoppingCart className="text-gray-400 text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.totalOrders}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Desde o início</Typography>
                </div>
              </Card>
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Pedidos Pendentes</Typography>
                    <FiClock className="text-yellow-500 text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.pendingOrders}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Aguardando preparo</Typography>
                </div>
              </Card>
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Em Preparo</Typography>
                    <FiPackage className="text-blue-500 text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.preparingOrders}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Na cozinha</Typography>
                </div>
              </Card>
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Faturamento Hoje</Typography>
                    <FiDollarSign className="text-green-500 text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">€{stats.todayRevenue.toFixed(2)}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Total do dia</Typography>
                </div>
              </Card>
            </div>

            {/* Order Type Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Pedidos na Mesa</Typography>
                    <FiHome className="text-astral text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.dineInOrders}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Comer no restaurante</Typography>
                </div>
              </Card>
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Pedidos para Entrega</Typography>
                    <FiTruck className="text-astral text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.deliveryOrders}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Delivery</Typography>
                </div>
              </Card>
              <Card hoverEffect>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle" color="light">Pedidos para Retirada</Typography>
                    <FiShoppingCart className="text-astral text-xl" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.takeawayOrders}</Typography>
                  <Typography variant="caption" color="light" className="mt-2">Takeaway</Typography>
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card hoverEffect className="mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Typography variant="h3">Pedidos Recentes</Typography>
                  <Button variant="ghost" icon={FiRefreshCw}>
                    Atualizar
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id?.slice(0, 6) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.orderType === 'dine-in' ? (
                              <span className="flex items-center">
                                <FiHome className="mr-1" /> Mesa {order.tableNumber}
                              </span>
                            ) : order.orderType === 'delivery' ? (
                              <span className="flex items-center">
                                <FiTruck className="mr-1" /> Entrega
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FiShoppingCart className="mr-1" /> Retirada
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="group relative">
                              <span className="cursor-pointer underline decoration-dotted">
                                {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                              </span>
                              {order.orderType === 'dine-in' && (
                                <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                  <div className="text-xs font-semibold mb-1">Itens da mesa:</div>
                                  <ul className="space-y-1">
                                    {order.items?.map((item, idx) => (
                                      <li key={idx} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            €{(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status || 'pending'} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <PrintButton 
                                order={order} 
                                isPrinting={isPrinting}
                                printOrder={printOrder}
                              />
                              {order.status === 'pending' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                >
                                  <FiClock /> Preparar
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <Typography variant="h2">Todos os Pedidos</Typography>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent w-full transition"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">          
                  <Select
                    value={activeOrderType}
                    onChange={(e) => setActiveOrderType(e.target.value)}
                    options={[
                      { value: 'all', label: 'Todos' },
                      { value: 'dine-in', label: 'Mesas' },
                      { value: 'delivery', label: 'Entregas' },
                      { value: 'takeaway', label: 'Retiradas' }
                    ]}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Order Type Tabs */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'all' 
                    ? 'bg-astral text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FiShoppingCart className="mr-2" />
                Todos os Pedidos
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('dine-in')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'dine-in' 
                    ? 'bg-astral text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FiHome className="mr-2" />
                Mesas
                {filteredOrders.filter(o => o.orderType === 'dine-in' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {filteredOrders.filter(o => o.orderType === 'dine-in' && o.status === 'pending').length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('delivery')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'delivery' 
                    ? 'bg-astral text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FiTruck className="mr-2" />
                Entregas
                {filteredOrders.filter(o => o.orderType === 'delivery' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {filteredOrders.filter(o => o.orderType === 'delivery' && o.status === 'pending').length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('takeaway')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'takeaway' 
                    ? 'bg-astral text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FiShoppingCart className="mr-2" />
                Retiradas
                {filteredOrders.filter(o => o.orderType === 'takeaway' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {filteredOrders.filter(o => o.orderType === 'takeaway' && o.status === 'pending').length}
                  </span>
                )}
              </motion.button>
            </div>

            <Card hoverEffect>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      {activeOrderType === 'dine-in' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id?.slice(0, 6) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.timestamp)?.toLocaleString() || 'Data inválida'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.orderType === 'dine-in' ? (
                              <span className="flex items-center">
                                <FiHome className="mr-1" /> Mesa
                              </span>
                            ) : order.orderType === 'delivery' ? (
                              <span className="flex items-center">
                                <FiTruck className="mr-1" /> Entrega
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FiShoppingCart className="mr-1" /> Retirada
                              </span>
                            )}
                          </td>
                          {activeOrderType === 'dine-in' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.tableNumber ? `Mesa ${order.tableNumber}` : 'Não informado'}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            €{(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status || 'pending'} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-wrap gap-2">
                              <PrintButton 
                                order={order} 
                                isPrinting={isPrinting}
                                printOrder={printOrder}
                              />
                              {order.status === 'pending' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className="flex-grow"
                                >
                                  <FiClock />
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
                                  className="flex-grow"
                                >
                                  <FiCheck />
                                </Button>
                              )}
                              <button 
                                onClick={() => {
                                  const allTableOrders = orders.filter(
                                    o => o.orderType === order.orderType && 
                                         o.tableNumber === order.tableNumber && 
                                         o.status === order.status
                                  );
                                  
                                  const consolidatedItems = [];
                                  allTableOrders.forEach(tableOrder => {
                                    tableOrder.items.forEach(item => {
                                      const existingItem = consolidatedItems.find(i => i.id === item.id);
                                      if (existingItem) {
                                        existingItem.quantity += item.quantity;
                                      } else {
                                        consolidatedItems.push({...item});
                                      }
                                    });
                                  });

                                  const orderToEdit = {
                                    ...order,
                                    items: consolidatedItems,
                                    total: consolidatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                                    originalIds: allTableOrders.map(o => o.id)
                                  };

                                  setCurrentOrder(orderToEdit);
                                  setIsEditModalOpen(true);
                                  setIsEditingOrder(true);
                                }}
                                className="text-astral hover:text-astral-dark p-2 transition"
                              >
                                <FiEdit />
                              </button>
                              <button 
                                onClick={() => {
                                  if (order.originalIds && order.originalIds.length > 0) {
                                    if (window.confirm(`Tem certeza que deseja excluir ${order.originalIds.length > 1 ? 'todos os pedidos desta mesa?' : 'este pedido?'}`)) {
                                      const deletePromises = order.originalIds.map(orderId => {
                                        const orderRef = ref(database, `orders/${orderId}`);
                                        return remove(orderRef);
                                      });
                                      
                                      Promise.all(deletePromises)
                                        .then(() => toast.success('Pedido(s) excluído(s) com sucesso!'))
                                        .catch(error => toast.error('Erro ao excluir pedido(s): ' + error.message));
                                    }
                                  } else {
                                    deleteOrder(order.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-2 transition"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeOrderType === 'dine-in' ? "7" : "6"} className="px-6 py-4 text-center text-sm text-gray-500">
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
      </div>

      {/* Edit Order Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setIsEditingOrder(false);
        }}
        title={`${currentOrder?.orderType === 'dine-in' ? 'Mesa' : 'Pedido'} #${currentOrder?.tableNumber || ''}`}
        size="xl"
      >
        {currentOrder && (
          <form id="modal-form" onSubmit={(e) => {
            e.preventDefault();
            if (isEditingOrder) {
              saveOrderChanges();
            } else {
              setIsEditModalOpen(false);
            }
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {isEditingOrder ? (
                  <>
                    <div className="mb-6">
                      <Typography variant="h3" className="mb-4">Adicionar Itens</Typography>
                      
                      <div className="mb-4">
                        <div className="relative mb-4">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Buscar itens no menu..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent w-full transition"
                            value={menuSearchQuery}
                            onChange={(e) => setMenuSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        <CategoryTabs
                          categories={menuCategories}
                          activeCategory={activeMenuCategory}
                          onSelect={(category) => {
                            setActiveMenuCategory(category);
                            if (!expandedCategories[category]) {
                              setExpandedCategories(prev => ({
                                ...prev,
                                [category]: true
                              }));
                            }
                          }}
                          className="mb-4"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredMenuItems.map(item => {
                            const currentItem = currentOrder?.items?.find(i => i.id === item.id);
                            const currentQuantity = currentItem ? currentItem.quantity : 0;
                            
                            return (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                onAdd={addItemToOrder}
                                onRemove={removeItemFromOrder}
                                currentQuantity={currentQuantity}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Typography variant="h3" className="mb-4">Itens do Pedido</Typography>
                      
                      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {currentOrder.items?.length > 0 ? (
                          currentOrder.items.map((item, index) => (
                            <OrderItem
                              key={`${item.id}-${index}`}
                              item={item}
                              onQuantityChange={updateItemQuantity}
                              onRemove={removeItemFromOrder}
                            />
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Nenhum item adicionado ao pedido
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <Typography variant="h3" className="mb-4">Itens do Pedido</Typography>
                    
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {(currentOrder.items || []).map((item, index) => (
                        <div key={index} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
                          <div>
                            <Typography variant="body" className="font-medium">{item.name}</Typography>
                            <Typography variant="caption">{item.quantity}x €{(item.price || 0).toFixed(2)}</Typography>
                          </div>
                          <Typography variant="body" className="font-medium">
                            €{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <Typography variant="h3" className="mb-4">Informações do Pedido</Typography>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Typography variant="caption" className="block mb-1">
                        {currentOrder.orderType === 'dine-in' ? 'Número da Mesa' : 'Número'}
                      </Typography>
                      <p className="bg-gray-50 p-3 rounded-lg">
                        {currentOrder.tableNumber || 
                        (currentOrder.orderType === 'dine-in' && currentOrder.id 
                          ? `Mesa ${parseInt(currentOrder.id.slice(-2), 10) % 16 + 1}` 
                          : 'Não informado')}
                      </p>
                    </div>
                    
                    <div>
                      <Typography variant="caption" className="block mb-1">Tipo de Pedido</Typography>
                      <p className="bg-gray-50 p-3 rounded-lg">
                        {currentOrder.orderType === 'dine-in' ? 'Mesa' :
                         currentOrder.orderType === 'delivery' ? 'Entrega' : 'Retirada'}
                      </p>
                    </div>
                    
                    <div>
                      <Typography variant="caption" className="block mb-1">Data/Hora</Typography>
                      <p className="bg-gray-50 p-3 rounded-lg">
                        {new Date(currentOrder.timestamp)?.toLocaleString() || 'Data inválida'}
                      </p>
                    </div>
                    
                    <div>
                      <Typography variant="caption" className="block mb-1">Status</Typography>
                      <Select
                        value={currentOrder.status || 'pending'}
                        onChange={(e) => {
                          setCurrentOrder({...currentOrder, status: e.target.value});
                        }}
                        options={[
                          { value: 'pending', label: 'Pendente' },
                          { value: 'preparing', label: 'Em Preparo' },
                          { value: 'ready', label: 'Pronto' },
                          { value: 'completed', label: 'Concluído' }
                        ]}
                      />
                    </div>
                    
                    {currentOrder.orderType !== 'dine-in' && (
                      <div>
                        <Typography variant="caption" className="block mb-1">Cliente</Typography>
                        <p className="bg-gray-50 p-3 rounded-lg">
                          {currentOrder.customer?.name || 'Não informado'}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <Typography variant="caption" className="block mb-1">Observações</Typography>
                      <p className="bg-gray-50 p-3 rounded-lg">
                        {currentOrder.customer?.notes || 'Nenhuma observação'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <Typography variant="body">Subtotal:</Typography>
                      <Typography variant="body" className="font-medium">
                        €{((currentOrder.total || 0) - (currentOrder.orderType === 'delivery' ? 2.5 : 0)).toFixed(2)}
                      </Typography>
                    </div>
                    {currentOrder.orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <Typography variant="body">Taxa de Entrega:</Typography>
                        <Typography variant="body" className="font-medium">€2.50</Typography>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <Typography variant="body" className="font-bold">Total:</Typography>
                      <Typography variant="body" className="font-bold text-astral">
                        €{(currentOrder.total || 0).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    {currentOrder.orderType === 'dine-in' && (
                      <Button
                        variant={isEditingOrder ? 'success' : 'outline'}
                        size="large"
                        onClick={() => setIsEditingOrder(!isEditingOrder)}
                        icon={isEditingOrder ? FiCheck : FiEdit}
                        className="w-full"
                      >
                        {isEditingOrder ? 'Finalizar Edição' : 'Editar Pedido'}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="large"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setIsEditingOrder(false);
                      }}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminPanel;