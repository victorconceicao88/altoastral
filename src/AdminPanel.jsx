import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { loginAnonimo } from './firebase';
import { 
  FiShoppingCart, FiClock, FiCheck, FiTruck, 
  FiHome, FiPieChart, FiSettings, FiPlus, FiEdit, FiTrash2,
  FiFilter, FiSearch, FiPrinter, FiDownload, FiRefreshCw, FiAlertCircle,
  FiArrowLeft, FiX, FiInfo, FiUser, FiUsers, FiPlusCircle, FiMinusCircle, 
  FiCalendar, FiMinus, FiCoffee, FiChevronDown, FiChevronUp, FiTag, 
  FiDollarSign, FiPackage, FiList, FiCheckCircle, FiUserCheck,
  FiMessageSquare, FiBell, FiStar, FiCreditCard, FiBarChart2, FiLock, FiSave,
  FiExternalLink, FiEye, FiEyeOff, FiArchive, FiSend, FiCornerUpRight, FiGrid
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from './assets/logo-alto-astral.png';
import { database } from './firebase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chart } from 'react-google-charts';
import { v4 as uuidv4 } from 'uuid';

// Configurações avançadas da impressora Bluetooth
const PRINTER_CONFIG = {
  deviceName: "BlueTooth Printer",
  deviceId: "27A0A417-4342-A5B4-3199-702B5E923859",
  serviceUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
  characteristicUUID: "0000ff02-0000-1000-8000-00805f9b34fb",
  maxRetries: 3,
  chunkSize: 100,
  delayBetweenChunks: 50,
  printQuality: "high",
  paperWidth: 80,
  headerText: "RESTAURANTE ALTO ASTRAL",
  footerText: "Obrigado pela preferência! Volte sempre!"
};

// Esquema de validação para pedidos
const orderSchema = z.object({
  customerName: z.string().min(1, "Nome é obrigatório"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  tableNumber: z.number().min(1, "Número da mesa é obrigatório").max(50, "Número inválido")
});

// Cores personalizadas premium
const colors = {
  primary: '#3B82F6',
  primaryLight: '#93C5FD',
  primaryDark: '#1D4ED8',
  secondary: '#F59E0B',
  secondaryLight: '#FCD34D',
  secondaryDark: '#D97706',
  success: '#10B981',
  successLight: '#6EE7B7',
  successDark: '#059669',
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerDark: '#DC2626',
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',
  info: '#3B82F6',
  infoLight: '#93C5FD',
  infoDark: '#1D4ED8',
  light: '#F8FAFC',
  lighter: '#F1F5F9',
  dark: '#1E293B',
  darker: '#0F172A',
  white: '#FFFFFF',
  premium: '#8B5CF6',
  premiumLight: '#C4B5FD',
  premiumDark: '#7C3AED'
};

// Gradientes premium
const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`,
  success: `linear-gradient(135deg, ${colors.success} 0%, ${colors.successDark} 100%)`,
  danger: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerDark} 100%)`,
  premium: `linear-gradient(135deg, ${colors.premium} 0%, ${colors.premiumDark} 100%)`,
  light: `linear-gradient(135deg, ${colors.light} 0%, ${colors.lighter} 100%)`
};

// Componente de Tipografia Premium
const Typography = ({ children, variant = 'body', className = '', color = 'dark', weight = 'normal', gradient, ...props }) => {
  const variants = {
    h1: 'text-4xl md:text-5xl font-extrabold tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold',
    subtitle: 'text-lg font-medium tracking-wide',
    body: 'text-base',
    caption: 'text-sm tracking-wide',
    tiny: 'text-xs tracking-wider'
  };

  const colorClasses = {
    default: 'text-gray-800',
    primary: 'text-primary',
    secondary: 'text-secondary',
    light: 'text-gray-500',
    white: 'text-white',
    danger: 'text-danger',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    premium: 'text-premium',
    dark: 'text-dark',
    darker: 'text-darker'
  };

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const gradientClass = gradient ? `bg-clip-text text-transparent bg-gradient-to-r ${gradient}` : '';

  return (
    <div 
      className={`${variants[variant]} ${colorClasses[color]} ${weights[weight]} ${gradientClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Componente de Botão Premium Avançado
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon: Icon, 
  iconPosition = 'left', 
  className = '', 
  disabled = false, 
  loading = false,
  fullWidth = false,
  pulse = false,
  rounded = 'xl',
  shadow = true,
  gradient = false,
  ...props 
}) => {
  const variants = {
    primary: gradient 
      ? `bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary active:shadow-inner` 
      : `bg-primary text-white hover:bg-primary-dark active:bg-primary-darker`,
    secondary: gradient
      ? `bg-gradient-to-r from-secondary to-secondary-dark text-white hover:from-secondary-dark hover:to-secondary active:shadow-inner`
      : `bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-darker`,
    outline: `border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20`,
    ghost: `hover:bg-gray-100 text-gray-700 active:bg-gray-200`,
    danger: gradient
      ? `bg-gradient-to-r from-danger to-danger-dark text-white hover:from-danger-dark hover:to-danger`
      : `bg-danger text-white hover:bg-danger-dark active:bg-danger-darker`,
    success: gradient
      ? `bg-gradient-to-r from-success to-success-dark text-white hover:from-success-dark hover:to-success`
      : `bg-success text-white hover:bg-success-dark active:bg-success-darker`,
    premium: gradient
      ? `bg-gradient-to-r from-premium to-premium-dark text-white hover:from-premium-dark hover:to-premium`
      : `bg-premium text-white hover:bg-premium-dark active:bg-premium-darker`,
    light: `bg-gray-100 hover:bg-gray-200 text-gray-800 active:bg-gray-300`,
    warning: gradient
      ? `bg-gradient-to-r from-warning to-warning-dark text-white hover:from-warning-dark hover:to-warning`
      : `bg-warning text-white hover:bg-warning-dark active:bg-warning-darker`,
    dark: `bg-dark text-white hover:bg-darker active:bg-gray-900`
  };

  const sizes = {
    small: 'py-1.5 px-3 text-sm',
    medium: 'py-2.5 px-5',
    large: 'py-3 px-6 text-lg'
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -2, scale: 1.02, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`transition-all duration-200 flex items-center justify-center gap-2 font-medium
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${pulse && !disabled && !loading ? 'animate-pulse' : ''}
        ${roundedClasses[rounded]}
        ${shadow ? 'shadow-lg hover:shadow-md' : 'shadow-none'}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        Icon && iconPosition === 'left' && <Icon className="flex-shrink-0" />
      )}
      {children}
      {Icon && !loading && iconPosition === 'right' && <Icon className="flex-shrink-0" />}
    </motion.button>
  );
};

// Componente de Card Premium com Efeitos Visuais
const Card = ({ 
  children, 
  className = '', 
  hoverEffect = false, 
  noPadding = false, 
  shadow = 'md', 
  border = false,
  gradient = false,
  title = null,
  headerAction = null,
  footer = null,
  glassEffect = false,
  ...props
}) => {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  return (
    <motion.div 
      whileHover={hoverEffect ? { 
        y: -3, 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        scale: 1.01
      } : {}}
      className={`bg-white rounded-2xl overflow-hidden ${border ? 'border border-gray-200' : ''}
        ${noPadding ? '' : 'p-6'} 
        ${shadows[shadow]} ${className}
        ${gradient ? gradients.primary : ''}
        ${glassEffect ? 'backdrop-blur-sm bg-white/80 border border-white/20' : ''}`}
      {...props}
    >
      {title && (
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <Typography variant="h3" className="!text-lg">{title}</Typography>
          {headerAction}
        </div>
      )}
      
      <div className={noPadding ? '' : title ? '' : 'p-6'}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-100 p-4">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

// Componente de Badge Premium
const Badge = ({ children, variant = 'default', className = '', size = 'normal', icon: Icon, pulse = false }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
    dark: 'bg-dark text-white',
    premium: 'bg-premium/10 text-premium',
    new: 'bg-blue-100 text-blue-800',
    sent: 'bg-green-100 text-green-800'
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    normal: 'text-xs px-2.5 py-1',
    large: 'text-sm px-3 py-1'
  };

  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`font-medium rounded-full inline-flex items-center ${variants[variant]} ${sizes[size]} ${className} ${pulse ? 'animate-pulse' : ''}`}
    >
      {Icon && <Icon className="mr-1.5 flex-shrink-0" size={14} />}
      {children}
    </motion.span>
  );
};

// Componente de Status Badge Avançado
const StatusBadge = ({ status }) => {
  const statusMap = {
    'pending': { color: 'warning', text: 'Pendente', icon: FiClock },
    'preparing': { color: 'info', text: 'Em Preparo', icon: FiPackage },
    'ready': { color: 'success', text: 'Pronto', icon: FiCheck },
    'completed': { color: 'dark', text: 'Concluído', icon: FiCheckCircle },
    'canceled': { color: 'danger', text: 'Cancelado', icon: FiX },
    'editing': { color: 'info', text: 'Em Edição', icon: FiEdit }
  };

  const statusInfo = statusMap[status] || { color: 'default', text: status, icon: null };

  return (
    <Badge variant={statusInfo.color} size="large" icon={statusInfo.icon} className="transition-all hover:scale-105">
      {statusInfo.text}
    </Badge>
  );
};

// Componente de Input Premium
const Input = ({ label, icon: Icon, className = '', error, success, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`text-gray-400 ${error ? 'text-danger' : ''} ${success ? 'text-success' : ''}`} />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} p-3 border-2 ${
            error 
              ? 'border-danger focus:border-danger focus:ring-danger/30' 
              : success 
                ? 'border-success focus:border-success focus:ring-success/30' 
                : 'border-gray-200 focus:border-primary focus:ring-primary/30'
          } rounded-xl focus:ring-2 focus:outline-none transition`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {success && <p className="mt-1 text-sm text-success">{success}</p>}
    </div>
  );
};

// Componente de Select Premium
const Select = ({ label, options, className = '', error, success, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full p-3 border-2 ${
          error 
            ? 'border-danger focus:border-danger focus:ring-danger/30' 
            : success 
              ? 'border-success focus:border-success focus:ring-success/30' 
              : 'border-gray-200 focus:border-primary focus:ring-primary/30'
        } rounded-xl focus:ring-2 focus:outline-none bg-white transition appearance-none`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {success && <p className="mt-1 text-sm text-success">{success}</p>}
    </div>
  );
};

// Componente de Modal Premium Avançado
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  footer = true,
  onConfirm,
  confirmText = 'Confirmar',
  confirmLoading = false,
  confirmDisabled = false,
  cancelText = 'Cancelar',
  hideCancel = false,
  customFooter,
  preventClose = false,
  fullHeight = false,
  ...props
}) => {
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
          onClick={!preventClose ? onClose : null}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} ${fullHeight ? 'h-[90vh]' : 'max-h-[90vh]'} flex flex-col overflow-hidden`}
            onClick={e => e.stopPropagation()}
            {...props}
          >
            <div className={`p-6 border-b bg-gradient-to-r from-primary to-primary-dark flex justify-between items-center`}>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              {!preventClose && (
                <button 
                  onClick={onClose}
                  className="text-white hover:text-gray-200 p-1 transition rounded-full hover:bg-white/10"
                >
                  <FiX className="h-6 w-6" />
                </button>
              )}
            </div>
            <div className={`p-6 overflow-y-auto ${fullHeight ? 'flex-grow' : ''} bg-gray-50`}>
              {children}
            </div>
            {footer && (
              <div className={`p-4 border-t border-gray-100 bg-white flex justify-end space-x-3`}>
                {customFooter ? (
                  customFooter
                ) : (
                  <>
                    {!hideCancel && (
                      <Button variant="outline" onClick={onClose}>
                        {cancelText}
                      </Button>
                    )}
                    <Button 
                      onClick={onConfirm} 
                      loading={confirmLoading}
                      disabled={confirmDisabled}
                      gradient
                    >
                      {confirmText}
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Componente de Card de Item do Menu Premium
const MenuItemCard = ({ item, onAdd, onRemove, currentQuantity = 0, className = '' }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md ${className}`}
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
          <Typography variant="body" className="font-bold text-primary ml-2 whitespace-nowrap">
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
                <span className="px-3 py-1 bg-white w-12 text-center border-x border-gray-200 font-medium">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => onAdd(item)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              <Typography variant="body" className="font-bold">
                €{(item.price * currentQuantity).toFixed(2)}
              </Typography>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="small" 
              onClick={() => onAdd(item)}
              className="w-full"
              fullWidth
            >
              <FiPlus className="mr-1" /> Adicionar
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de Item do Pedido Premium
const OrderItem = ({ 
  item, 
  onQuantityChange, 
  onRemove, 
  showStatus = false,
  showCustomer = false,
  showNotes = false,
  className = '',
  showActions = true
}) => {
  return (
    <motion.div 
      whileHover={{ backgroundColor: '#F8FAFC' }}
      className={`flex justify-between items-start p-3 hover:bg-gray-50 rounded-lg transition ${className}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {showStatus && !item.printedTimestamp && (
            <Badge variant="new" className="mr-2" size="small" pulse>
              Novo
            </Badge>
          )}
          {showStatus && item.printedTimestamp && (
            <Badge variant="sent" className="mr-2" size="small">
              Enviado
            </Badge>
          )}
          <Typography variant="body" className="font-medium truncate">{item.name}</Typography>
        </div>
        
        {showCustomer && item.customerName && (
          <Typography variant="caption" className="text-gray-500 block">
            <FiUser className="inline mr-1" size={12} />
            {item.customerName}
          </Typography>
        )}
        
        {showNotes && item.notes && (
          <Typography variant="caption" className="text-gray-500 block italic">
            <FiMessageSquare className="inline mr-1" size={12} />
            {item.notes}
          </Typography>
        )}
        
        <Typography variant="caption" className="text-gray-500">
          €{item.price.toFixed(2)} un.
        </Typography>
      </div>
      
      <div className="flex items-center ml-4">
        {showActions && (
          <>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
                disabled={item.quantity <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className="px-3 py-1 bg-white w-12 text-center border-x border-gray-200 font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
              >
                <FiPlus size={16} />
              </button>
            </div>
            
            <Typography variant="body" className="font-bold ml-4 w-20 text-right">
              €{(item.price * item.quantity).toFixed(2)}
            </Typography>
          </>
        )}
        
        {onRemove && (
          <button
            onClick={() => onRemove(item.id)}
            className="ml-4 text-danger hover:text-danger-dark p-1 transition"
          >
            <FiTrash2 size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Componente de Abas de Categorias Premium
const CategoryTabs = ({ categories, activeCategory, onSelect, className = '' }) => {
  return (
    <div className={`flex space-x-2 overflow-x-auto pb-2 ${className}`}>
      {categories.map(category => (
        <motion.button
          key={category.key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(category.key);
          }}
          className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
            activeCategory === category.key 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {category.icon && <category.icon className="mr-2" />}
          {category.label}
        </motion.button>
      ))}
    </div>
  );
};

// Componente de Botão de Impressão Premium
const KitchenPrintButton = ({ order, isPrinting, printOrder }) => (
  <Button
    variant="primary"
    icon={FiPrinter}
    onClick={(e) => {
      e.stopPropagation();
      printOrder(order);
    }}
    disabled={isPrinting}
    loading={isPrinting}
    className="mr-2"
    size="small"
    gradient
  >
    {isPrinting ? 'Enviando...' : 'Enviar para Cozinha'}
  </Button>
);

// Componente de Modal de Confirmação Premium
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Ação", 
  message = "Tem certeza que deseja realizar esta ação?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  icon: Icon = FiAlertCircle,
  iconColor = "text-danger"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <Typography variant="body" className="mb-2">
          {message}
        </Typography>
      </div>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} gradient>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

// Componente de Toggle Switch Premium
const ToggleSwitch = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={onChange}
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      {label && <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>}
    </label>
  );
};

// Componente Principal do Painel Administrativo Premium
const AdminPanel = () => {
  // Estados do componente
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const navigate = useNavigate();
  const [printerConnected, setPrinterConnected] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [printedItems, setPrintedItems] = useState({});
  const [printerReconnectAttempted, setPrinterReconnectAttempted] = useState(false);
  const [newItems, setNewItems] = useState([]);
  const [sentItems, setSentItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [viewMode, setViewMode] = useState('grouped');
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isPrinterSettingsOpen, setIsPrinterSettingsOpen] = useState(false);
  const [printerStatus, setPrinterStatus] = useState('disconnected');
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [printerSettings, setPrinterSettings] = useState({
    headerText: PRINTER_CONFIG.headerText,
    footerText: PRINTER_CONFIG.footerText,
    printQuality: PRINTER_CONFIG.printQuality,
    paperWidth: PRINTER_CONFIG.paperWidth
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(orderSchema)
  });

  const printerDeviceRef = useRef(null);
  const printerCharacteristicRef = useRef(null);


  // Dados do menu premium
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

  // Categorias do menu para navegação premium
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

  // Efeito para separar itens enviados/não enviados e agrupar por cliente
  useEffect(() => {
    if (currentOrder) {
      // Separa itens não enviados (sem printedTimestamp)
      const unsent = currentOrder.items.filter(item => !item.printedTimestamp);
      const sent = currentOrder.items.filter(item => item.printedTimestamp);
      
      setNewItems(unsent);
      setSentItems(sent);
      
      // Agrupa itens por cliente (se houver informação de cliente)
      const grouped = currentOrder.items.reduce((acc, item) => {
        const customer = item.customerName || 'Cliente não identificado';
        if (!acc[customer]) {
          acc[customer] = [];
        }
        acc[customer].push(item);
        return acc;
      }, {});
      
      setGroupedItems(grouped);
    }
  }, [currentOrder]);

  // Função para enviar apenas os novos itens para a cozinha
  const sendNewItemsToKitchen = async () => {
    if (newItems.length === 0) {
      toast.warning('Não há novos itens para enviar à cozinha');
      return;
    }

    try {
      setIsPrinting(true);
      
      // Cria um pedido temporário apenas com os novos itens
      const tempOrder = {
        ...currentOrder,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      // Envia para impressão
      const success = await printOrder(tempOrder);
      
      if (success) {
        // Marca os itens como enviados
        const updatedItems = currentOrder.items.map(item => {
          if (!item.printedTimestamp) {
            return { ...item, printedTimestamp: new Date().toISOString() };
          }
          return item;
        });

        // Atualiza o pedido no estado
        setCurrentOrder({
          ...currentOrder,
          items: updatedItems
        });

        toast.success(`✅ ${newItems.length} item(s) enviado(s) para cozinha!`);
      }
    } catch (error) {
      toast.error(`❌ Falha ao enviar itens: ${error.message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  // Função para confirmar o fechamento da mesa
  const confirmCloseTable = () => {
    setIsConfirmingClose(true);
  };

  // Função para fechar a mesa
  const closeTable = async () => {
    setIsConfirmingClose(false);
    
    try {
      // Atualiza o status para 'completed'
      const orderRef = ref(database, `orders/${currentOrder.id}`);
      await update(orderRef, { status: 'completed' });

      toast.success('✅ Mesa fechada com sucesso!');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('❌ Erro ao fechar mesa: ' + error.message);
    }
  };

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
    receipt += `${CENTER}${BOLD_ON}${printerSettings.headerText}${BOLD_OFF}${LF}`;
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
    receipt += `${CENTER}${printerSettings.footerText}${LF}${LF}`;
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
        toast.success(`✅ Pedido #${order.id.slice(0, 6)} enviado para cozinha com sucesso!`);
        // Atualiza o status para "preparing" automaticamente
        await updateOrderStatus(order.id, 'preparing');
        return true;
      } else {
        throw new Error('Falha ao enviar para impressora');
      }
    } catch (error) {
      setIsPrinting(false);
      setPrintError(error.message);
      toast.error(`❌ Falha ao enviar para cozinha: ${error.message}`);
      return false;
    } finally {
      setIsPrinting(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = ref(database, `orders/${orderId}`);
    
    try {
      await update(orderRef, { status: newStatus });

      const order = orders.find(o => o.id === orderId);
      if (order) {
        if (newStatus === 'preparing' || newStatus === 'ready') {
          await sendWhatsAppNotification(order, newStatus);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('❌ Erro ao atualizar status do pedido');
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
        quantity: 1,
        printedTimestamp: null // Novo item não foi enviado para cozinha
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
      setIsSavingChanges(true);
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
        tableNumber: currentOrder.tableNumber || null,
        originalIds: [newOrderRef.key]
      });
  
      toast.success(`✅ Pedido da ${currentOrder.orderType === 'dine-in' ? 'mesa' : 'entrega'} ${currentOrder.tableNumber} atualizado com sucesso!`);
      
      setIsEditModalOpen(false);
      setIsEditingOrder(false);
  
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error('❌ Erro ao atualizar pedido. Por favor, tente novamente.');
    } finally {
      setIsSavingChanges(false);
    }
  };

  const loadOrders = useCallback(() => {
    setIsLoadingOrders(true);
    const ordersRef = ref(database, 'orders');
  
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          items: data[key].items || [],
          customer: data[key].customer || { name: 'Cliente não informado', phone: '' },
          orderType: data[key].orderType || 'takeaway'
        }));
        
        if (ordersArray.length > 0 && orders.length > 0) {
          const newOrder = ordersArray[0];
          const isNewOrder = !orders.some(order => order.id === newOrder.id);
          
          if (isNewOrder) {
            setActiveTab('orders');
            
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
      setIsLoadingOrders(false);
    });
  }, [orders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const deleteOrder = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    remove(orderRef)
      .then(() => toast.success('✅ Pedido excluído com sucesso!'))
      .catch(error => toast.error('❌ Erro ao excluir pedido: ' + error.message));
  };

  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsConfirmDelete(true);
  };

  const handleDeleteOrder = () => {
    if (orderToDelete.originalIds && orderToDelete.originalIds.length > 0) {
      const deletePromises = orderToDelete.originalIds.map(orderId => {
        const orderRef = ref(database, `orders/${orderId}`);
        return remove(orderRef);
      });
      
      Promise.all(deletePromises)
        .then(() => toast.success('✅ Pedido(s) excluído(s) com sucesso!'))
        .catch(error => toast.error('❌ Erro ao excluir pedido(s): ' + error.message));
    } else {
      deleteOrder(orderToDelete.id);
    }
    setIsConfirmDelete(false);
  };

  const extractTableNumber = (order) => {
    if (order.tableNumber && !isNaN(order.tableNumber)) {
      return parseInt(order.tableNumber, 10);
    }
    
    if (order.url) {
      try {
        const url = new URL(order.url);
        const table = url.searchParams.get('table');
        if (table && !isNaN(table)) return parseInt(table, 10);
      } catch (e) {
        console.error('Erro ao extrair mesa da URL:', e);
      }
    }
    
    if (order.customer?.name) {
      const match = order.customer.name.match(/(Mesa|mesa|Table|table)[\s:]?(\d+)/i);
      if (match && match[2] && !isNaN(match[2])) return parseInt(match[2], 10);
    }
    
    if (order.id) {
      const lastDigit = parseInt(order.id.slice(-1), 10);
      if (!isNaN(lastDigit)) return (lastDigit % 16) + 1;
    }
    
    return Math.floor(Math.random() * 16) + 1;
  };

  const consolidateOrders = (orders) => {
    const consolidatedOrders = [];
    const ordersMap = new Map();
    const processedIds = new Set();
  
    orders.forEach(order => {
      if (processedIds.has(order.id)) return;
      
      if (!order.items) order.items = [];
      
      if (order.orderType !== 'dine-in') {
        consolidatedOrders.push({
          ...order,
          originalIds: [order.id]
        });
        processedIds.add(order.id);
        return;
      }
  
      const tableNumber = extractTableNumber(order);
      if (!tableNumber || tableNumber === 'Não informado') {
        consolidatedOrders.push({
          ...order,
          tableNumber: 'Não informado',
          originalIds: [order.id]
        });
        processedIds.add(order.id);
        return;
      }
  
      const orderKey = `dine-in-${tableNumber}-${order.status}`;
      
      if (ordersMap.has(orderKey)) {
        const existingOrder = ordersMap.get(orderKey);
        
        order.items.forEach(newItem => {
          const existingItem = existingOrder.items.find(
            item => item.id === newItem.id && item.notes === newItem.notes
          );
  
          if (existingItem) {
            existingItem.quantity += newItem.quantity;
          } else {
            existingOrder.items.push({...newItem});
          }
        });
  
        existingOrder.total = existingOrder.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
  
        if (new Date(order.timestamp) > new Date(existingOrder.timestamp)) {
          existingOrder.timestamp = order.timestamp;
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
      
      processedIds.add(order.id);
    });
  
    return consolidatedOrders;
  };

  const filteredOrders = useMemo(() => {
    const consolidated = consolidateOrders(orders);
    
    return consolidated
      .filter(order => {
        if (activeOrderType !== 'all' && order.orderType !== activeOrderType) return false;
        
        if (filter !== 'all' && order.status !== filter) return false;
        
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
  
  const filteredMenuItems = useMemo(() => {
    const categoryItems = menu[activeMenuCategory] || [];
  
    if (!menuSearchQuery) return categoryItems;
  
    const query = menuSearchQuery.toLowerCase();
    return categoryItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query))
    );
  }, [activeMenuCategory, menuSearchQuery]);

  const openOrderDetails = (order) => {
    setSelectedOrderDetails(order);
    setIsOrderDetailsOpen(true);
  };

  const openEditModal = (order) => {
    const allTableOrders = orders.filter(
      o => o.orderType === order.orderType && 
           o.tableNumber === order.tableNumber && 
           o.status === order.status
    );
    
    const consolidatedItems = [];
    allTableOrders.forEach(tableOrder => {
      tableOrder.items.forEach(item => {
        const existingItem = consolidatedItems.find(i => i.id === item.id && i.notes === item.notes);
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
    setIsEditingOrder(false);
  };

  const togglePrinterSettings = () => {
    setIsPrinterSettingsOpen(!isPrinterSettingsOpen);
  };

  const savePrinterSettings = () => {
    localStorage.setItem('printerSettings', JSON.stringify(printerSettings));
    toast.success('✅ Configurações da impressora salvas com sucesso!');
    setIsPrinterSettingsOpen(false);
  };

  useEffect(() => {
    // Carrega configurações da impressora do localStorage
    const savedSettings = localStorage.getItem('printerSettings');
    if (savedSettings) {
      setPrinterSettings(JSON.parse(savedSettings));
    }

    // Verifica se há conexão salva com a impressora
    const savedPrinter = localStorage.getItem('bluetoothPrinter');
    if (savedPrinter) {
      const printerState = JSON.parse(savedPrinter);
      if (printerState.connected) {
        setPrinterConnected(true);
      }
    }
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    {/* Header Premium */}
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 shadow-xl sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Alto Astral" className="h-12 mr-3" />
          <Typography variant="h1" className="text-2xl text-white">
            Painel Administrativo Premium
          </Typography>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            icon={FiPrinter}
            onClick={togglePrinterSettings}
            className="text-white hover:bg-white/10"
          >
            {printerConnected ? 'Impressora Conectada' : 'Configurar Impressora'}
          </Button>
          <Button
          onClick={() => (window.location.href = '/restricted')}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center shadow hover:shadow-md text-black"
        >
          <FiArrowLeft className="mr-2" /> Voltar Para o Dashboard
        </Button>

        </div>
      </div>
    </header>

    {/* Printer Settings Modal */}
    <Modal
      isOpen={isPrinterSettingsOpen}
      onClose={togglePrinterSettings}
      title="Configurações da Impressora"
      size="md"
    >
      <div className="space-y-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <Typography variant="subtitle" className="mb-2 text-gray-800">Status da Impressora</Typography>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${printerConnected ? 'bg-success' : 'bg-danger'}`}></div>
            <Typography variant="body" className="text-gray-700">
              {printerConnected ? 'Conectada' : 'Desconectada'}
            </Typography>
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <Typography variant="subtitle" className="mb-2 text-gray-800">Configurações do Recibo</Typography>
          <div className="space-y-4">
            <Input
              label="Texto do Cabeçalho"
              value={printerSettings.headerText}
              onChange={(e) => setPrinterSettings({...printerSettings, headerText: e.target.value})}
            />
            <Input
              label="Texto do Rodapé"
              value={printerSettings.footerText}
              onChange={(e) => setPrinterSettings({...printerSettings, footerText: e.target.value})}
            />
            <Select
              label="Qualidade de Impressão"
              value={printerSettings.printQuality}
              onChange={(e) => setPrinterSettings({...printerSettings, printQuality: e.target.value})}
              options={[
                { value: 'high', label: 'Alta' },
                { value: 'medium', label: 'Média' },
                { value: 'low', label: 'Baixa' }
              ]}
            />
            <Select
              label="Largura do Papel"
              value={printerSettings.paperWidth}
              onChange={(e) => setPrinterSettings({...printerSettings, paperWidth: parseInt(e.target.value)})}
              options={[
                { value: '58', label: '58mm' },
                { value: '80', label: '80mm' }
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={printerConnected ? 'success' : 'primary'}
            onClick={connectToPrinter}
            loading={isPrinting}
            fullWidth
            gradient
          >
            {printerConnected ? 'Reconectar Impressora' : 'Conectar Impressora'}
          </Button>
          {printerConnected && (
            <Button
              variant="danger"
              onClick={() => {
                if (printerDeviceRef.current?.gatt?.connected) {
                  printerDeviceRef.current.gatt.disconnect();
                }
                clearPrinterState();
              }}
              fullWidth
              gradient
            >
              Desconectar Impressora
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={togglePrinterSettings}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={savePrinterSettings}
            fullWidth
            gradient
          >
            Salvar Configurações
          </Button>
        </div>
      </div>
    </Modal>

    {/* Tabs Navigation Premium */}
    <div className="bg-white shadow-sm sticky top-16 z-10">
      <div className="container mx-auto overflow-x-auto">
        <div className="flex space-x-1 p-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <FiPieChart className="mr-2" />
            Dashboard
            <Badge variant="premium" className="ml-2" size="small">
              <FiStar size={12} className="mr-1" />
              Premium
            </Badge>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
              activeTab === 'orders' 
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <FiShoppingCart className="mr-2" />
            Pedidos
            {stats.pendingOrders > 0 && (
              <span className="ml-2 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
            <Typography variant="h2" className="mb-6">Visão Geral Premium</Typography>
             
          {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <Card hoverEffect gradient="from-yellow-400 to-orange-300">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Total Pedidos</Typography>
        <FiShoppingCart className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.totalOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Desde o início</Typography>
    </div>
  </Card>

  <Card hoverEffect gradient="from-orange-300 to-orange-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Pedidos Pendentes</Typography>
        <FiClock className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.pendingOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Aguardando preparo</Typography>
    </div>
  </Card>

  <Card hoverEffect gradient="from-blue-300 to-blue-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Em Preparo</Typography>
        <FiPackage className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.preparingOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Na cozinha</Typography>
    </div>
  </Card>

  <Card hoverEffect gradient="from-green-300 to-green-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Prontos para Entrega</Typography>
        <FiCheck className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.readyOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Aguardando retirada</Typography>
    </div>
  </Card>
</div>


      {/* Order Type Stats */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <Card hoverEffect gradient="from-purple-300 to-purple-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Pedidos na Mesa</Typography>
        <FiHome className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.dineInOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Comer no restaurante</Typography>
    </div>
  </Card>

  <Card hoverEffect gradient="from-teal-300 to-teal-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Pedidos para Entrega</Typography>
        <FiTruck className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.deliveryOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Delivery</Typography>
    </div>
  </Card>

  <Card hoverEffect gradient="from-pink-300 to-pink-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" color="dark">Pedidos para Retirada</Typography>
        <FiShoppingCart className="text-gray-800 text-xl" />
      </div>
      <Typography variant="h1" className="mt-2 text-black">{stats.takeawayOrders}</Typography>
      <Typography variant="caption" color="dark" className="mt-2 text-gray-700">Takeaway</Typography>
    </div>
  </Card>
</div>


            {/* Recent Orders */}
            <Card hoverEffect className="mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Typography variant="h3">Pedidos Recentes</Typography>
                  <Button 
                    variant="ghost" 
                    icon={FiRefreshCw}
                    onClick={loadOrders}
                    loading={isLoadingOrders}
                  >
                    Atualizar
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Itens</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            #{order.id?.slice(0, 6) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="group relative">
                              <span className="cursor-pointer underline decoration-dotted">
                                {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                              </span>
                              {order.orderType === 'dine-in' && (
                                <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                  <div className="text-xs font-semibold mb-1">Itens da mesa:</div>
                                  <ul className="space-y-1">
                                    {order.items?.map((item, idx) => (
                                      <li key={`${item.id}-${idx}`} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            €{(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status || 'pending'} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <KitchenPrintButton 
                                order={order} 
                                isPrinting={isPrinting}
                                printOrder={printOrder}
                              />
                              {order.status === 'pending' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  gradient
                                >
                                  <FiClock /> Preparar
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
                                  gradient
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
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-primary focus:ring-primary/30 rounded-xl focus:ring-2 focus:outline-none w-full transition"
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'all' 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FiShoppingCart className="mr-2" />
                Todos os Pedidos
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('dine-in')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'dine-in' 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FiHome className="mr-2" />
                Mesas
                {filteredOrders.filter(o => o.orderType === 'dine-in' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {filteredOrders.filter(o => o.orderType === 'dine-in' && o.status === 'pending').length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('delivery')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'delivery' 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FiTruck className="mr-2" />
                Entregas
                {filteredOrders.filter(o => o.orderType === 'delivery' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {filteredOrders.filter(o => o.orderType === 'delivery' && o.status === 'pending').length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveOrderType('takeaway')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center transition ${
                  activeOrderType === 'takeaway' 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FiShoppingCart className="mr-2" />
                Retiradas
                {filteredOrders.filter(o => o.orderType === 'takeaway' && o.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Itens</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            #{order.id?.slice(0, 6) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(order.timestamp)?.toLocaleString() || 'Data inválida'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.tableNumber ? `Mesa ${order.tableNumber}` : 'Não informado'}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            €{(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status || 'pending'} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex flex-wrap gap-2">
                              <KitchenPrintButton 
                                order={order} 
                                isPrinting={isPrinting}
                                printOrder={printOrder}
                              />
                              {order.status === 'pending' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className="flex-grow"
                                  gradient
                                >
                                  <FiClock />
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button 
                                  size="small" 
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
                                  className="flex-grow"
                                  gradient
                                >
                                  <FiCheck />
                                </Button>
                              )}
                              <button 
                                onClick={() => openOrderDetails(order)}
                                className="text-primary hover:text-primary-dark p-2 transition"
                              >
                                <FiEye />
                              </button>
                              <button 
                                onClick={() => openEditModal(order)}
                                className="text-primary hover:text-primary-dark p-2 transition"
                              >
                                <FiEdit />
                              </button>
                              <button 
                                onClick={() => confirmDeleteOrder(order)}
                                className="text-danger hover:text-danger-dark p-2 transition"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeOrderType === 'dine-in' ? "7" : "6"} className="px-6 py-4 text-center text-sm">
                          {isLoadingOrders ? 'Carregando pedidos...' : 'Nenhum pedido encontrado'}
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

      {/* Order Details Modal */}
      <Modal 
        isOpen={isOrderDetailsOpen} 
        onClose={() => setIsOrderDetailsOpen(false)}
        title={`Detalhes do Pedido #${selectedOrderDetails?.id?.slice(0, 6) || ''}`}
        size="lg"
      >
        {selectedOrderDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-gray-50">
                <Typography variant="subtitle" className="mb-3">Informações do Pedido</Typography>
                <div className="space-y-2">
                  <div>
                    <Typography variant="caption" className="block text-gray-500">Tipo:</Typography>
                    <Typography variant="body">
                      {selectedOrderDetails.orderType === 'dine-in' ? (
                        <span className="flex items-center">
                          <FiHome className="mr-1" /> Mesa {selectedOrderDetails.tableNumber}
                        </span>
                      ) : selectedOrderDetails.orderType === 'delivery' ? (
                        <span className="flex items-center">
                          <FiTruck className="mr-1" /> Entrega
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiShoppingCart className="mr-1" /> Retirada
                        </span>
                      )}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" className="block text-gray-500">Data/Hora:</Typography>
                    <Typography variant="body">
                      {new Date(selectedOrderDetails.timestamp).toLocaleString()}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" className="block text-gray-500">Status:</Typography>
                    <Typography variant="body">
                      <StatusBadge status={selectedOrderDetails.status || 'pending'} />
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" className="block text-gray-500">Total:</Typography>
                    <Typography variant="body" className="font-bold">
                      €{(selectedOrderDetails.total || 0).toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-gray-50">
                <Typography variant="subtitle" className="mb-3">Informações do Cliente</Typography>
                <div className="space-y-2">
                  <div>
                    <Typography variant="caption" className="block text-gray-500">Nome:</Typography>
                    <Typography variant="body">
                      {selectedOrderDetails.customer?.name || 'Não informado'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" className="block text-gray-500">Telefone:</Typography>
                    <Typography variant="body">
                      {selectedOrderDetails.customer?.phone || 'Não informado'}
                    </Typography>
                  </div>
                  
                  {selectedOrderDetails.customer?.notes && (
                    <div>
                      <Typography variant="caption" className="block text-gray-500">Observações:</Typography>
                      <Typography variant="body">
                        {selectedOrderDetails.customer.notes}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gray-50">
              <Typography variant="subtitle" className="mb-3">Itens do Pedido</Typography>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {selectedOrderDetails.items?.length > 0 ? (
                  selectedOrderDetails.items.map((item, idx) => (
                    <OrderItem
                      key={`${item.id}-${idx}`}
                      item={item}
                      onQuantityChange={() => {}}
                      onRemove={null}
                      showStatus={!item.printedTimestamp}
                      showCustomer={true}
                      showNotes={!!item.notes}
                      showActions={false}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum item encontrado neste pedido
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsOrderDetailsOpen(false)}
              >
                Fechar
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setIsOrderDetailsOpen(false);
                  openEditModal(selectedOrderDetails);
                }}
                gradient
              >
                <FiEdit className="mr-2" /> Editar Pedido
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Order Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setIsEditingOrder(false);
          setIsConfirmingClose(false);
        }}
        title={`${currentOrder?.orderType === 'dine-in' ? 'Comanda - Mesa' : 'Pedido'} ${currentOrder?.tableNumber || ''}`}
        size="xl"
        fullHeight
        footer={!isConfirmingClose}
        customFooter={
          isConfirmingClose ? (
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsConfirmingClose(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={closeTable} gradient>
                <FiLock className="mr-2" /> Confirmar Fechamento
              </Button>
            </div>
          ) : null
        }
      >
        {currentOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              {/* Seção de Adição de Itens (apenas quando editando) */}
              {isEditingOrder && (
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
                        className="pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-primary focus:ring-primary/30 rounded-xl focus:ring-2 focus:outline-none w-full transition"
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <CategoryTabs
                      categories={menuCategories}
                      activeCategory={activeMenuCategory}
                      onSelect={setActiveMenuCategory}
                      className="mb-4"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredMenuItems.map(item => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onAdd={addItemToOrder}
                          onRemove={removeItemFromOrder}
                          currentQuantity={currentOrder.items?.find(i => i.id === item.id)?.quantity || 0}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Seção de Itens da Comanda */}
              <div className="mb-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h3">Itens da Comanda</Typography>
                  {newItems.length > 0 && (
                    <Badge variant="warning" className="flex items-center">
                      <FiAlertCircle className="mr-1" />
                      {newItems.length} item(s) não enviado(s)
                    </Badge>
                  )}
                </div>
                
                {/* Abas para visualização agrupada ou linear */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    onClick={() => setViewMode('grouped')}
                    className={`px-4 py-2 font-medium ${viewMode === 'grouped' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  >
                    <FiUsers className="inline mr-2" />
                    Agrupado por Cliente
                  </button>
                  <button
                    onClick={() => setViewMode('linear')}
                    className={`px-4 py-2 font-medium ${viewMode === 'linear' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  >
                    <FiList className="inline mr-2" />
                    Lista Completa
                  </button>
                </div>
                
                {/* Visualização dos Itens */}
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-200 h-[calc(100%-60px)] overflow-y-auto">
                  {viewMode === 'grouped' ? (
                    // Visualização Agrupada por Cliente
                    Object.entries(groupedItems).length > 0 ? (
                      Object.entries(groupedItems).map(([customer, items]) => (
                        <div key={customer} className="p-3">
                          <div className="flex items-center mb-2">
                            <FiUserCheck className="text-primary mr-2" />
                            <Typography variant="subtitle" className="text-primary">{customer}</Typography>
                          </div>
                          <div className="pl-6">
                            {items.map((item, idx) => (
                              <OrderItem
                                key={`${item.id}-${idx}`}
                                item={item}
                                onQuantityChange={updateItemQuantity}
                                onRemove={removeItemFromOrder}
                                showStatus={!item.printedTimestamp}
                                showNotes={!!item.notes}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum item adicionado à comanda
                      </div>
                    )
                  ) : (
                    // Visualização Linear
                    currentOrder.items?.length > 0 ? (
                      currentOrder.items.map((item, idx) => (
                        <OrderItem
                          key={`${item.id}-${idx}`}
                          item={item}
                          onQuantityChange={updateItemQuantity}
                          onRemove={removeItemFromOrder}
                          showStatus={!item.printedTimestamp}
                          showCustomer={true}
                          showNotes={!!item.notes}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum item adicionado à comanda
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            
            {/* Painel de Ações e Informações */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Resumo do Pedido */}
                <div>
                  <Typography variant="h3" className="mb-4">Resumo</Typography>
                  
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="flex justify-between">
                      <Typography variant="body">Tipo:</Typography>
                      <Typography variant="body" className="font-bold">
                        {currentOrder.orderType === 'dine-in' ? (
                          <span className="flex items-center">
                            <FiHome className="mr-1" /> Mesa
                          </span>
                        ) : currentOrder.orderType === 'delivery' ? (
                          <span className="flex items-center">
                            <FiTruck className="mr-1" /> Entrega
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FiShoppingCart className="mr-1" /> Retirada
                          </span>
                        )}
                      </Typography>
                    </div>
                    
                    <div className="flex justify-between">
                      <Typography variant="body">Status:</Typography>
                      <StatusBadge status={currentOrder.status || 'pending'} />
                    </div>
                    
                    <div className="flex justify-between">
                      <Typography variant="body">Itens:</Typography>
                      <Typography variant="body" className="font-bold">
                        {currentOrder.items?.length || 0}
                      </Typography>
                    </div>
                    
                    <div className="flex justify-between">
                      <Typography variant="body">Não enviados:</Typography>
                      <Typography variant="body" className="font-bold">
                        {newItems.length}
                      </Typography>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <Typography variant="body" className="font-bold">Total:</Typography>
                      <Typography variant="h3" className="text-primary">
                        €{(currentOrder.total || 0).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                </div>
                
                {/* Ações Principais */}
                <div className="space-y-3">
                  {newItems.length > 0 && (
                    <Button
                      variant="primary"
                      size="large"
                      onClick={sendNewItemsToKitchen}
                      icon={FiPrinter}
                      disabled={isPrinting}
                      loading={isPrinting}
                      className="w-full"
                      gradient
                    >
                      {isPrinting ? 'Enviando...' : 'Enviar para Cozinha'}
                    </Button>
                  )}
                  
                  <Button
                    variant={isEditingOrder ? 'success' : 'outline'}
                    size="large"
                    onClick={() => setIsEditingOrder(!isEditingOrder)}
                    icon={isEditingOrder ? FiCheck : FiEdit}
                    className="w-full"
                    gradient={isEditingOrder}
                  >
                    {isEditingOrder ? 'Parar de Editar' : 'Editar Comanda'}
                  </Button>
                  
                  {isEditingOrder && (
                    <Button
                      variant="primary"
                      size="large"
                      onClick={saveOrderChanges}
                      icon={FiSave}
                      loading={isSavingChanges}
                      className="w-full"
                      gradient
                    >
                      {isSavingChanges ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  )}

                  {currentOrder.status !== 'completed' && (
                    <Button
                      variant="danger"
                      size="large"
                      onClick={confirmCloseTable}
                      icon={FiCheckCircle}
                      className="w-full"
                      gradient
                    >
                      Fechar Mesa
                    </Button>
                  )}
                </div>
                
                {/* Detalhes do Pedido */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <Typography variant="subtitle" className="mb-2">Detalhes</Typography>
                  
                  <div className="space-y-2">
                    <div>
                      <Typography variant="caption" className="block text-gray-500">Data/Hora:</Typography>
                      <Typography variant="body">
                        {new Date(currentOrder.timestamp).toLocaleString()}
                      </Typography>
                    </div>
                    
                    {currentOrder.customer?.notes && (
                      <div>
                        <Typography variant="caption" className="block text-gray-500">Observações:</Typography>
                        <Typography variant="body">
                          {currentOrder.customer.notes}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        onConfirm={handleDeleteOrder}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir ${orderToDelete?.originalIds?.length > 1 ? 'todos os pedidos desta mesa?' : 'este pedido?'}`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Confirmação de Fechamento de Mesa */}
      <ConfirmationModal
        isOpen={isConfirmingClose}
        onClose={() => setIsConfirmingClose(false)}
        onConfirm={closeTable}
        title="Fechar Mesa"
        message="Tem certeza que deseja fechar esta mesa? Esta ação não pode ser desfeita."
        confirmText="Fechar Mesa"
        cancelText="Cancelar"
        variant="danger"
        icon={FiLock}
        iconColor="text-primary"
      />
      
      </div>
  );
};

export default AdminPanel;