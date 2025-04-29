import React, { useState, useEffect } from 'react';
import { 
  FiShoppingCart, FiClock, FiCheck, FiTruck, 
  FiHome, FiPieChart, FiSettings, FiPlus, FiEdit, FiTrash2,
  FiFilter, FiSearch, FiPrinter, FiDownload, FiRefreshCw, FiAlertCircle,
  FiArrowLeft, FiX, FiInfo, FiUser, FiUsers, FiPlusCircle, FiMinusCircle,FiCalendar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from './firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { Link } from 'react-router-dom';
import logo from './assets/logo-alto-astral.png';

// Componentes UI consistentes
const Typography = ({ children, variant = 'body', className = '' }) => {
  const variants = {
    h1: 'text-3xl md:text-4xl font-bold text-gray-800',
    h2: 'text-2xl md:text-3xl font-bold text-gray-800',
    h3: 'text-xl md:text-2xl font-semibold text-gray-700',
    purple: 'bg-purple-100 text-purple-800',
    subtitle: 'text-lg text-gray-500',
    body: 'text-base text-gray-700',
    caption: 'text-sm text-gray-500'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
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

// No componente StatusBadge, adicione:
const StatusBadge = ({ status }) => {
  const statusMap = {
    'pending': { color: 'warning', text: 'Pendente' },
    'preparing': { color: 'info', text: 'Em Preparo' },
    'ready': { color: 'success', text: 'Pronto' },
    'completed': { color: 'dark', text: 'Concluído' },
    'canceled': { color: 'danger', text: 'Cancelado' },
    'editing': { color: 'info', text: 'Em Edição' },
    'event': { color: 'purple', text: 'Evento' } // Adicione esta linha
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
                <FiX className="h-6 w-6" />
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

// Menu data structure
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

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [activeCategory, setActiveCategory] = useState('semana');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [activeOrderType, setActiveOrderType] = useState('all');

  // Função para enviar notificação via WhatsApp
  const sendWhatsAppNotification = (order, newStatus) => {
    // Não envia notificação para pedidos de mesa
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

  // Função para imprimir pedido
  const printOrder = async (order) => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    setPrintError(null);

    try {
      // Simulação de impressão - na prática você implementaria a lógica real de impressão
      console.log('Imprimindo pedido:', order);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPrinting(false);
      alert(`✅ Pedido #${order.id.slice(0, 6)} impresso com sucesso!`);
    } catch (error) {
      setIsPrinting(false);
      setPrintError(error.message);
      alert(`❌ Falha na impressão: ${error.message}`);
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
    }
  };

  // Função para adicionar item ao pedido
  const addItemToOrder = (itemToAdd) => {
    if (!currentOrder) return;

    const updatedItems = [...(currentOrder.items || [])];
    const existingItemIndex = updatedItems.findIndex(item => item.id === itemToAdd.id);

    if (existingItemIndex >= 0) {
      // Item já existe no pedido, incrementa quantidade
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
      };
    } else {
      // Adiciona novo item ao pedido
      updatedItems.push({
        ...itemToAdd,
        quantity: 1
      });
    }

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  // Função para remover item do pedido
  const removeItemFromOrder = (itemId) => {
    if (!currentOrder) return;

    const updatedItems = [...(currentOrder.items || [])];
    const itemIndex = updatedItems.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      if (updatedItems[itemIndex].quantity > 1) {
        // Diminui quantidade se for maior que 1
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity - 1
        };
      } else {
        // Remove o item se a quantidade for 1
        updatedItems.splice(itemIndex, 1);
      }
    }

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  // Função para salvar as alterações no pedido
 // Local: Na lista de funções do componente AdminPanel
const saveOrderChanges = async () => {
  if (!currentOrder) return;

  // Nova lógica para mesas/eventos
  if (currentOrder.orderType === 'dine-in' || currentOrder.orderType === 'event') {
    const ordersRef = ref(database, 'orders');
    const ordersToUpdate = orders.filter(
      o => o.orderType === currentOrder.orderType &&
           o.tableNumber === currentOrder.tableNumber &&
           o.status === 'pending' &&
           o.id !== currentOrder.id
    );

    await Promise.all(
      ordersToUpdate.map(async order => {
        const orderRef = ref(database, `orders/${order.id}`);
        await update(orderRef, null);
      })
    );
  }

  const orderRef = ref(database, `orders/${currentOrder.id}`);
  
  try {
    await update(orderRef, {
      items: currentOrder.items,
      total: currentOrder.total,
      status: 'pending' // Volta para pendente após edição
    });

    setIsEditModalOpen(false);
    setIsEditingOrder(false);
    alert('Pedido atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    alert('Erro ao atualizar pedido. Por favor, tente novamente.');
  }
};

  // Fetch data
  useEffect(() => {
    const ordersRef = ref(database, 'orders');

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          customer: data[key].customer || { name: 'Cliente não informado', phone: '' },
          orderType: data[key].orderType || 'takeaway'
        }));
        setOrders(ordersArray.reverse());
      } else {
        setOrders([]);
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

  // Filter orders
// Substitua a função filteredOrders por esta:
const filteredOrders = orders.reduce((acc, order) => {
  // Para pedidos que não são de mesa, adiciona normalmente
  if (order.orderType !== 'dine-in' && order.orderType !== 'event') {
    acc.push(order);
    return acc;
  }

  // Para pedidos de mesa/evento, verifica se já existe um pedido para aquela mesa
  const existingOrderIndex = acc.findIndex(
    o => o.orderType === order.orderType && 
         o.tableNumber === order.tableNumber && 
         o.status === order.status
  );

  if (existingOrderIndex >= 0) {
    // Se já existe, mescla os itens
    const existingOrder = acc[existingOrderIndex];
    existingOrder.items = [...existingOrder.items, ...order.items];
    existingOrder.total = existingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  } else {
    // Se não existe, adiciona o pedido
    acc.push(order);
  }

  return acc;
}, []);

  // Filter menu items by search
  const filteredMenuItems = Object.entries(menu).reduce((acc, [category, items]) => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(menuSearchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  // Stats
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
    takeawayOrders: orders.filter(o => o.orderType === 'takeaway').length,
    eventOrders: orders.filter(o => o.orderType === 'event').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-astral to-astral-dark text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Alto Astral" className="h-10 mr-2" />
            <Typography variant="h1" className="text-2xl">Painel Administrativo</Typography>
          </div>
          <Link to="/restricted/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg">
            Voltar Para o Dashboard
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
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'dashboard' ? 'bg-astral text-white' : 'bg-gray-100'}`}
            >
              <FiPieChart className="mr-2" />
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeTab === 'orders' ? 'bg-astral text-white' : 'bg-gray-100'}`}
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
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Total Pedidos</Typography>
                    <FiShoppingCart className="text-gray-400" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.totalOrders}</Typography>
                  <Typography variant="caption" className="mt-2">Desde o início</Typography>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Pedidos Pendentes</Typography>
                    <FiClock className="text-yellow-500" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.pendingOrders}</Typography>
                  <Typography variant="caption" className="mt-2">Aguardando preparo</Typography>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Em Preparo</Typography>
                    <FiAlertCircle className="text-blue-500" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.preparingOrders}</Typography>
                  <Typography variant="caption" className="mt-2">Na cozinha</Typography>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Faturamento Hoje</Typography>
                    <FiCheck className="text-green-500" />
                  </div>
                  <Typography variant="h1" className="mt-2">€{stats.todayRevenue.toFixed(2)}</Typography>
                  <Typography variant="caption" className="mt-2">Total do dia</Typography>
                </div>
              </Card>
            </div>

            {/* Order Type Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Pedidos na Mesa</Typography>
                    <FiHome className="text-astral" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.dineInOrders}</Typography>
                  <Typography variant="caption" className="mt-2">Comer no restaurante</Typography>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Pedidos para Entrega</Typography>
                    <FiTruck className="text-astral" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.deliveryOrders}</Typography>
                  <Typography variant="caption" className="mt-2">Delivery</Typography>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle">Pedidos para Retirada</Typography>
                    <FiShoppingCart className="text-astral" />
                  </div>
                  <Typography variant="h1" className="mt-2">{stats.takeawayOrders}</Typography>
                  <Typography variant="caption" className="mt-2">Takeaway</Typography>
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-8">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
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
                            {order.orderType === 'dine-in' ? (
                              <span className="flex items-center">
                                <FiHome className="mr-1" /> Mesa {order.tableNumber}
                              </span>
                            ) : order.orderType === 'event' ? (
                              <span className="flex items-center text-purple-600">
                                <FiCalendar className="mr-1" /> Evento {order.tableNumber}
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
                                {order.orderType === 'dine-in' || order.orderType === 'event' ? (
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
                                ) : null}
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent w-full"
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
                      { value: 'event', label: 'Eventos' },
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeOrderType === 'all' ? 'bg-astral text-white' : 'bg-gray-100'}`}
              >
                <FiShoppingCart className="mr-2" />
                Todos os Pedidos
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('dine-in')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeOrderType === 'dine-in' ? 'bg-astral text-white' : 'bg-gray-100'}`}
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
                onClick={() => setActiveOrderType('event')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeOrderType === 'event' ? 'bg-purple-500 text-white' : 'bg-gray-100'}`}
              >
                <FiCalendar className="mr-2" />
                Eventos
                {filteredOrders.filter(o => o.orderType === 'event' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {filteredOrders.filter(o => o.orderType === 'event' && o.status === 'pending').length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('delivery')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeOrderType === 'delivery' ? 'bg-astral text-white' : 'bg-gray-100'}`}
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${activeOrderType === 'takeaway' ? 'bg-astral text-white' : 'bg-gray-100'}`}
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

            <Card>
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
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
            {order.customer?.name || 'Cliente não informado'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {order.customer?.phone || '--'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {order.orderType === 'dine-in' ? (
              <span className="flex items-center">
                <FiHome className="mr-1" /> Mesa {order.tableNumber}
              </span>
            ) : order.orderType === 'event' ? (
              <span className="flex items-center text-purple-600">
                <FiCalendar className="mr-1" /> Evento {order.tableNumber}
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
            {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            €{(order.total || 0).toFixed(2)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <StatusBadge status={order.status || 'pending'} />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex flex-wrap gap-2">
              <PrintButton order={order} />
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
                  setCurrentOrder(order);
                  setIsEditModalOpen(true);
                  setIsEditingOrder(order.orderType === 'dine-in' || order.orderType === 'event');
                }}
                className="text-astral hover:text-astral-dark p-2"
              >
                <FiEdit />
              </button>
              <button 
                onClick={() => deleteOrder(order.id)}
                className="text-red-500 hover:text-red-700 p-2"
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
      </div>

      {/* Edit Order Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setIsEditingOrder(false);
        }}
        title={`Pedido #${currentOrder?.id?.slice(0, 6) || ''}`}
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
              <div className="lg:col-span-1">
                <Typography variant="h3" className="mb-4">Informações do Cliente</Typography>
                <div className="space-y-4">
                  <div>
                    <Typography variant="caption" className="block mb-1">Nome</Typography>
                    <p className="bg-gray-50 p-3 rounded-lg">{currentOrder.customer?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <Typography variant="caption" className="block mb-1">Telefone</Typography>
                    <p className="bg-gray-50 p-3 rounded-lg">{currentOrder.customer?.phone || 'Não informado'}</p>
                  </div>
                  {currentOrder.orderType === 'delivery' && (
                    <div>
                      <Typography variant="caption" className="block mb-1">Endereço</Typography>
                      <p className="bg-gray-50 p-3 rounded-lg">
                        {currentOrder.customer?.address || 'Não informado'}
                      </p>
                    </div>
                  )}
                  {currentOrder.orderType === 'dine-in' && (
                    <div>
                      <Typography variant="caption" className="block mb-1">Mesa</Typography>
                      <p className="bg-gray-50 p-3 rounded-lg">
                        {currentOrder.tableNumber || 'Não informado'}
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
              </div>
              
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h3">Detalhes do Pedido</Typography>
                  {currentOrder.orderType === 'dine-in' && (
                    <Button
                      variant={isEditingOrder ? 'success' : 'outline'}
                      size="small"
                      onClick={() => setIsEditingOrder(!isEditingOrder)}
                      icon={isEditingOrder ? FiCheck : FiEdit}
                    >
                      {isEditingOrder ? 'Finalizar Edição' : 'Editar Pedido'}
                    </Button>
                  )}
                </div>
                
                <div className="mb-4">
                  <Typography variant="caption" className="block mb-1">Status</Typography>
                  <Select
                    value={currentOrder.status || 'pending'}
                    onChange={(e) => {
                      setCurrentOrder({...currentOrder, status: e.target.value});
                      if (!isEditingOrder) {
                        updateOrderStatus(currentOrder.id, e.target.value);
                      }
                    }}
                    disabled={isEditingOrder}
                    options={[
                      { value: 'pending', label: 'Pendente' },
                      { value: 'preparing', label: 'Em Preparo' },
                      { value: 'ready', label: 'Pronto' },
                      { value: 'completed', label: 'Concluído' }
                    ]}
                  />
                </div>
                
                <div className="mb-4">
                  <Typography variant="caption" className="block mb-1">Itens</Typography>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {(currentOrder.items || []).map((item, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <Typography variant="body" className="font-medium">{item.name}</Typography>
                          <Typography variant="caption">{item.quantity}x €{(item.price || 0).toFixed(2)}</Typography>
                        </div>
                        <div className="flex items-center">
                          <Typography variant="body" className="font-medium mr-4">
                            €{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </Typography>
                          {isEditingOrder && (
                            <div className="flex items-center space-x-2">
                              <button 
                                type="button"
                                onClick={() => removeItemFromOrder(item.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <FiMinusCircle size={18} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => addItemToOrder(item)}
                                className="text-green-500 hover:text-green-700 p-1"
                              >
                                <FiPlusCircle size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isEditingOrder && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <Typography variant="h3">Adicionar Itens</Typography>
                      <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSearch className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar itens..."
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-astral focus:border-transparent"
                          value={menuSearchQuery}
                          onChange={(e) => setMenuSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {Object.keys(menu).map(category => (
                          <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeCategory === category ? 'bg-astral text-white' : 'bg-gray-100'}`}
                          >
                            {category === 'semana' ? 'Cardápio da Semana' : 
                             category === 'lanches' ? 'Lanches' :
                             category === 'porcoes' ? 'Porções' :
                             category === 'pasteis' ? 'Pasteis' :
                             category === 'cafe' ? 'Café da Manhã' :
                             category === 'bebidas' ? 'Bebidas' :
                             category === 'salgados' ? 'Salgados' : 'Sobremesas'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                      {filteredMenuItems[activeCategory]?.map(item => (
                        <Card key={item.id} className="p-3 flex justify-between items-center hover:shadow-md transition-shadow">
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Typography variant="body" className="font-medium">{item.name}</Typography>
                              {item.description && (
                                <Typography variant="caption" className="line-clamp-1">{item.description}</Typography>
                              )}
                              <Typography variant="body" className="font-bold text-astral mt-1">
                                €{item.price.toFixed(2)}
                              </Typography>
                            </div>
                          </div>
                          <Button 
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              addItemToOrder(item);
                            }}
                          >
                            <FiPlus />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

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
                  <div className="flex justify-between pt-2">
                    <Typography variant="body" className="font-bold">Total:</Typography>
                    <Typography variant="body" className="font-bold text-astral">
                      €{(currentOrder.total || 0).toFixed(2)}
                    </Typography>
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