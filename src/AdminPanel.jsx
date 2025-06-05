import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { loginAnonimo } from './firebase';
import { FiShoppingCart, FiClock, FiCheck, FiTruck, FiHome, FiPrinter, FiEdit, FiTrash2, FiSearch, FiUser, FiPlus, FiMinus, FiX, FiInfo, FiAlertCircle, FiCheckCircle, FiLock, FiChevronDown, FiChevronUp, FiPhone, FiMapPin, } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from './assets/logo-alto-astral.png';
import { database } from './firebase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { menu, menuCategories } from './menuData';
import { sendWhatsAppMessage } from './whatsappUtils';

const PRINTER_CONFIG = {
  deviceName: "BlueTooth Printer",
  serviceUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
  characteristicUUID: "0000ff02-0000-1000-8000-00805f9b34fb",
  maxRetries: 3,
  timeout: 10000,
};

const colors = {
  primary: '#2E7D32',
  secondary: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  info: '#1976D2',
  light: '#F5F5F5',
  dark: '#212121',
  white: '#FFFFFF',
};

const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    postalCode: z.string().min(1, "CEP é obrigatório")
  }),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  notes: z.string().optional()
});

const normalizeCustomerData = (customer) => {
  if (!customer) {
    return {
      name: 'Cliente não informado',
      phone: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        postalCode: ''
      },
      paymentMethod: '',
      notes: '',
      orderType: 'takeaway'
    };
  }

  if (typeof customer === 'string') {
    return {
      name: customer,
      phone: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        postalCode: ''
      },
      paymentMethod: '',
      notes: '',
      orderType: 'takeaway'
    };
  }

  return {
    name: customer.name || 'Cliente não informado',
    phone: customer.phone || '',
    address: {
      street: customer.address?.street || customer.address || '',
      number: customer.address?.number || '',
      complement: customer.address?.complement || '',
      neighborhood: customer.address?.neighborhood || '',
      city: customer.address?.city || '',
      postalCode: customer.address?.postalCode || customer.postalCode || ''
    },
    paymentMethod: customer.paymentMethod || '',
    notes: customer.notes || '',
    orderType: customer.orderType || 'takeaway'
  };
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    'pending': { color: 'warning', text: 'Pendente', icon: FiClock },
    'preparing': { color: 'info', text: 'Em Preparo', icon: FiClock },
    'ready': { color: 'success', text: 'Pronto', icon: FiCheck },
    'completed': { color: 'dark', text: 'Concluído', icon: FiCheckCircle },
    'delivered': { color: 'info', text: 'Entregue', icon: FiTruck },
  };

  const statusInfo = statusMap[status] || { color: 'dark', text: status, icon: null };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
      {statusInfo.icon && <statusInfo.icon className="mr-1" />}
      {statusInfo.text}
    </span>
  );
};

const OrderItem = ({ item, showStatus = false, showNotes = false }) => {
  return (
    <div className="p-3 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-medium">{item.name}</div>
          {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
          {showNotes && item.notes && <div className="text-xs text-yellow-700">Obs: {item.notes}</div>}
        </div>
        <div className="ml-4 text-right">
          <div className="font-bold">€{(item.price * item.quantity).toFixed(2)}</div>
          {showStatus && !item.printedTimestamp && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
              Não enviado
            </span>
          )}
        </div>
      </div>
      <div className="mt-1 text-sm text-gray-500">Quantidade: {item.quantity}</div>
    </div>
  );
};

const OrderView = ({ 
  order, 
  onPrint,
  onCancel,
  onMarkAsReady
}) => {
  const hasNewItems = order.items?.some(item => !item.printedTimestamp);

  const groupItemsByType = (items) => {
    const isBarItem = (item) => ['bebidas', 'cafe'].includes(item.category);
    
    return items.reduce((acc, item) => {
      const type = isBarItem(item) ? 'bar' : 'kitchen';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  };

  const groupedItems = groupItemsByType(order.items || []);
  const customer = normalizeCustomerData(order.customer);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">
            {order.orderType === 'delivery' ? 'Entrega' : 'Retirada'} - #{order.id?.slice(0, 6)}
          </h3>
          <div className="text-sm text-gray-600">
            {new Date(order.timestamp).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={order.status} />
          {hasNewItems && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              Novos itens
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-medium mb-2">Informações do Cliente</h4>
          <div className="bg-gray-50 p-3 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <FiUser className="text-gray-600 mr-2" />
                  <span>{customer.name}</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="text-gray-600 mr-2" />
                  <span>{customer.phone || 'Não informado'}</span>
                </div>
                <div className="flex items-center mt-1">
                  <FiLock className="text-gray-600 mr-2" />
                  <span>{customer.paymentMethod || 'Não informado'}</span>
                </div>
              </div>
              {order.orderType === 'delivery' && (
                <div>
                  <div className="flex items-start mb-1">
                    <FiMapPin className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <div><strong>Endereço Completo:</strong> {customer.address.street}, {customer.address.number}</div>
                      {customer.address.complement && <div><strong>Complemento:</strong> {customer.address.complement}</div>}
                      <div><strong>Codigo Postal:</strong> {customer.address.postalCode}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {customer.notes && (
              <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                <strong>Observações:</strong> {customer.notes}
              </div>
            )}
          </div>
        </div>

        <h4 className="font-medium mb-2">Itens do Pedido</h4>
        
        {groupedItems.kitchen && groupedItems.kitchen.length > 0 && (
          <>
            <div className="text-center text-sm font-medium my-2 text-gray-600">------- COZINHA -------</div>
            <div className="border border-gray-200 rounded divide-y divide-gray-200">
              {groupedItems.kitchen.map(item => (
                <OrderItem
                  key={item.id}
                  item={item}
                  showStatus={!item.printedTimestamp}
                  showNotes={!!item.notes}
                />
              ))}
            </div>
          </>
        )}

        {groupedItems.bar && groupedItems.bar.length > 0 && (
          <>
            <div className="text-center text-sm font-medium my-2 text-gray-600">------- BAR -------</div>
            <div className="border border-gray-200 rounded divide-y divide-gray-200">
              {groupedItems.bar.map(item => (
                <OrderItem
                  key={item.id}
                  item={item}
                  showStatus={!item.printedTimestamp}
                  showNotes={!!item.notes}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded">
    <div className="flex justify-between items-center">
        <div className="font-bold">
            Total: €{order.orderType === 'delivery' 
                ? (order.total + 2.50).toFixed(2) 
                : order.total.toFixed(2)}
            {order.orderType === 'delivery' && (
                <span className="text-sm font-normal ml-2">
                    (inclui €2.50 de taxa de entrega)
                </span>
            )}
        </div>
        <div className="flex space-x-2">
            {order.status === 'preparing' && (
                <button
                    onClick={() => onMarkAsReady(order)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center"
                >
                    <FiCheckCircle className="mr-1" /> Marcar como Pronto
                </button>
            )}
            <button
                onClick={() => onPrint(order)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center"
            >
                <FiPrinter className="mr-1" /> Enviar para Cozinha
            </button>
            <button
                onClick={() => onCancel(order)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center"
            >
                <FiX className="mr-1" /> Cancelar Pedido
            </button>
        </div>
    </div>
</div>
      </div>
    </div>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <h3 className="font-bold text-lg">{title}</h3>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'pending', label: 'Pendentes', icon: FiClock },
    { id: 'preparing', label: 'Em Preparo', icon: FiClock },
    { id: 'ready', label: 'Prontos', icon: FiCheck }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 flex items-center text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <tab.icon className="mr-2" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [printerConnected, setPrinterConnected] = useState(false);
  const [dashboardView, setDashboardView] = useState('stats');
  const [dashboardStatusTab, setDashboardStatusTab] = useState('pending');
  const [ordersCollapsed, setOrdersCollapsed] = useState(false);
  const printerDeviceRef = useRef(null);
  const printerCharacteristicRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const loadOrders = useCallback(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          items: Array.isArray(data[key].items) ? data[key].items : [],
          customer: normalizeCustomerData(data[key].customer),
          orderType: data[key].orderType || 'takeaway'
        }));
        
        setOrders(ordersArray.reverse());
      } else {
        setOrders([]);
      }
    });
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const notifyOrderReceived = async (order) => {
    const customer = normalizeCustomerData(order.customer);
    if (!customer.phone) {
      toast.warning('Número de telefone não informado, não foi possível enviar mensagem');
      return;
    }

    const message = `Olá, ${customer.name}! Recebemos o seu pedido e já estamos preparando. Obrigado por escolher o Alto Astral!`;
    
    try {
      const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Mensagem de confirmação enviada ao cliente');
    } catch (error) {
      toast.error('Erro ao enviar mensagem de confirmação');
    }
  };

  const notifyOrderReady = async (order) => {
    const customer = normalizeCustomerData(order.customer);
    if (!customer.phone) {
      toast.warning('Número de telefone não informado, não foi possível enviar mensagem');
      return;
    }

    const message = order.orderType === 'delivery' 
      ? `Olá, ${customer.name}! O seu pedido está pronto e já estamos a caminho para entregar. Obrigado!`
      : `Olá, ${customer.name}! O seu pedido já está pronto para recolha. Obrigado!`;
    
    try {
      const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Mensagem de pronto enviada ao cliente');
    } catch (error) {
      toast.error('Erro ao enviar mensagem de pronto');
    }
  };

  const printOrder = async (order) => {
    if (!order || !order.items || order.items.length === 0) {
      toast.error('Pedido inválido ou sem itens');
      return;
    }
    
    try {
      setIsPrinting(true);
      toast.info('Preparando impressora...');
      
      const receipt = formatOrderForPrint(order);
      await sendToPrinter(receipt);
      
      // Marcar itens como impressos
      const updates = {};
      const now = new Date().toISOString();
      
      order.items.forEach(item => {
        if (!item.printedTimestamp) {
          updates[`orders/${order.id}/items/${item.id}/printedTimestamp`] = now;
        }
      });
      
      if (order.status === 'pending') {
        updates[`orders/${order.id}/status`] = 'preparing';
      }
      
      await update(ref(database), updates);
      
      // Enviar notificação para o cliente
      await notifyOrderReceived(order);
      
      toast.success('✅ Pedido enviado para cozinha com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      let errorMessage = '❌ Falha ao enviar pedido: ';
      if (error.message.includes('GATT')) {
        errorMessage += 'Problema na conexão com a impressora. Verifique se está ligada e pareada.';
      } else {
        errorMessage += error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsPrinting(false);
    }
  };

const formatOrderForPrint = (order) => {
    const customer = normalizeCustomerData(order.customer);
    
    const ESC = '\x1B';
    const CENTER = `${ESC}a1`;
    const BOLD_ON = `${ESC}!${String.fromCharCode(8)}`;
    const BOLD_OFF = `${ESC}!${String.fromCharCode(0)}`;
    const LINE = '--------------------------------\n';
    const DOUBLE_LINE = '================================\n';
    const DOTTED_LINE = '..........\n';

    const replaceSpecialChars = (str) => {
        return str
            .replace(/ç/g, '\xE7')
            .replace(/á/g, '\xE1')
            .replace(/é/g, '\xE9')
            .replace(/í/g, '\xED')
            .replace(/ó/g, '\xF3')
            .replace(/ú/g, '\xFA')
            .replace(/ã/g, '\xE3')
            .replace(/õ/g, '\xF5')
            .replace(/à/g, '\xE0')
            .replace(/è/g, '\xE8')
            .replace(/ì/g, '\xEC')
            .replace(/ò/g, '\xF2')
            .replace(/ù/g, '\xF9')
            .replace(/â/g, '\xE2')
            .replace(/ê/g, '\xEA')
            .replace(/î/g, '\xEE')
            .replace(/ô/g, '\xF4')
            .replace(/û/g, '\xFB')
            .replace(/~e/g, '\xE3')
            .replace(/€/g, '\xA4');
    };

    let receipt = `${ESC}@${CENTER}${BOLD_ON}ALTO ASTRAL${BOLD_OFF}\n`;
    receipt += `${CENTER}${BOLD_ON}Pedido ${order.id || 'N/A'}${BOLD_OFF}\n`;
    receipt += `${CENTER}${BOLD_ON}${order.orderType === 'delivery' ? 'ENTREGA' : 'RETIRADA'}${BOLD_OFF}\n`;
    receipt += `${DOTTED_LINE}\n`;

    // Dados BÁSICOS (sempre mostrados)
    receipt += `${BOLD_ON}Cliente:${BOLD_OFF} ${replaceSpecialChars(customer.name)}\n`;
    receipt += `${BOLD_ON}Tel:${BOLD_OFF} ${customer.phone || 'Não informado'}\n`;
    receipt += `${BOLD_ON}Pagamento:${BOLD_OFF} ${replaceSpecialChars(customer.paymentMethod || 'Não informado')}\n`;

    // Dados de ENDEREÇO (apenas para entrega)
    if (order.orderType === 'delivery') {
        receipt += `${BOLD_ON}Endereço:${BOLD_OFF}\n`;
        receipt += `${replaceSpecialChars(customer.address.street)}, ${customer.address.number}\n`;
        if (customer.address.complement) {
            receipt += `Complemento: ${replaceSpecialChars(customer.address.complement)}\n`;
        }
        receipt += `${replaceSpecialChars(customer.address.neighborhood)}\n`;
        receipt += `${replaceSpecialChars(customer.address.city)} - ${customer.address.postalCode}\n`;
    }

    // Observações (se houver)
    if (customer.notes) {
        receipt += `${BOLD_ON}Obs:${BOLD_OFF} ${replaceSpecialChars(customer.notes)}\n`;
    }

    receipt += `${DOTTED_LINE}\n`;
    receipt += `${BOLD_ON}ITENS:${BOLD_OFF}\n`;
    receipt += `${DOUBLE_LINE}\n`;

    // Lista de itens
    (order.items || []).forEach(item => {
        receipt += `${item.quantity}x ${replaceSpecialChars(item.name || 'Produto')}\n`;
        if (item.notes) receipt += `  OBS: ${replaceSpecialChars(item.notes)}\n`;
    });

    receipt += `${DOUBLE_LINE}\n`;

    // TOTAL (com taxa apenas para entrega)
    if (order.orderType === 'delivery') {
        const deliveryFee = 2.50;
        receipt += `${BOLD_ON}Taxa de Entrega:${BOLD_OFF} ${deliveryFee.toFixed(2)}\n`;
        receipt += `${LINE}\n`;
        receipt += `${BOLD_ON}TOTAL:${BOLD_OFF} ${(order.total + deliveryFee).toFixed(2)}\n\n`;
    } else {
        receipt += `${BOLD_ON}TOTAL:${BOLD_OFF} ${order.total.toFixed(2)}\n\n`;
    }

    // Rodapé
    const date = new Date();
    receipt += `${CENTER}${date.toLocaleTimeString('pt-BR')} - ${date.toLocaleDateString('pt-BR')}\n`;
    receipt += `${CENTER}Obrigado e Volte Sempre!${BOLD_OFF}\n`;
    receipt += `${DOUBLE_LINE}\n`;

    return receipt;
};

  const connectToPrinter = async () => {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth não suportado neste navegador');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: PRINTER_CONFIG.deviceName }],
        optionalServices: [PRINTER_CONFIG.serviceUUID]
      });

      if (!device) throw new Error('Nenhuma impressora selecionada');

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(PRINTER_CONFIG.serviceUUID);
      const characteristic = await service.getCharacteristic(PRINTER_CONFIG.characteristicUUID);

      printerDeviceRef.current = device;
      printerCharacteristicRef.current = characteristic;
      setPrinterConnected(true);

      device.addEventListener('gattserverdisconnected', () => {
        setPrinterConnected(false);
        toast.warning('Impressora desconectada');
      });

      return { device, characteristic };
    } catch (error) {
      console.error('Erro ao conectar com a impressora:', error);
      throw error;
    }
  };

  const sendToPrinter = async (data) => {
    let retries = 0;
    let lastError = null;

    while (retries < PRINTER_CONFIG.maxRetries) {
      try {
        let characteristic = printerCharacteristicRef.current;
        
        if (!characteristic || !printerDeviceRef.current?.gatt?.connected) {
          const { characteristic: newCharacteristic } = await connectToPrinter();
          characteristic = newCharacteristic;
        }

        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        
        const chunkSize = 100;
        for (let i = 0; i < encodedData.length; i += chunkSize) {
          const chunk = encodedData.slice(i, i + chunkSize);
          await characteristic.writeValueWithoutResponse(chunk);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        return true;
      } catch (error) {
        lastError = error;
        retries++;
        if (retries < PRINTER_CONFIG.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError || new Error('Falha ao enviar para impressora após várias tentativas');
  };

  const cancelOrder = async (order) => {
    try {
      setIsCanceling(true);
      await remove(ref(database, `orders/${order.id}`));
      toast.success('✅ Pedido cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      toast.error('❌ Erro ao cancelar pedido');
    } finally {
      setIsCanceling(false);
      setOrderToCancel(null);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await update(ref(database, `orders/${orderId}`), {
        status: newStatus,
        readyTimestamp: newStatus === 'ready' ? new Date().toISOString() : null
      });

      if (newStatus === 'ready') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const customer = normalizeCustomerData(order.customer);
          if (customer.phone) {
            const message = order.orderType === 'delivery'
              ? `Olá ${customer.name}, seu pedido está a caminho! 🚀`
              : `Olá ${customer.name}, seu pedido está pronto para retirada! ✅`;
            
            window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
          }
        }
      }

      toast.success(`Status atualizado: ${newStatus === 'ready' ? 'Pronto' : 'Em preparo'}`);
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    }
  };

  const markOrderAsReady = async (order) => {
    await updateOrderStatus(order.id, 'ready');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (activeTab === 'orders' && filter !== 'all' && order.status !== filter) return false;
      if (activeTab === 'dashboard' && dashboardStatusTab !== 'all' && order.status !== dashboardStatusTab) return false;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesId = order.id?.toLowerCase().includes(searchLower);
        const matchesCustomer = order.customer?.name?.toLowerCase().includes(searchLower);
        const matchesPhone = order.customer?.phone?.toLowerCase().includes(searchLower);
        return matchesId || matchesCustomer || matchesPhone;
      }
      return true;
    });
  }, [orders, filter, searchQuery, activeTab, dashboardStatusTab]);

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    readyOrders: orders.filter(o => o.status === 'ready').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#b0aca6] text-white p-4 shadow sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Alto Astral" className="h-10 mr-3" />
            <h1 className="text-xl font-bold">Painel de Pedidos</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/restricted'}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded flex items-center text-sm"
            >
              <span className="mr-1">Voltar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto p-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg flex-shrink-0 flex items-center ${activeTab === 'dashboard' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg flex-shrink-0 flex items-center ${activeTab === 'orders' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
            >
              Pedidos
              {stats.pendingOrders > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.pendingOrders}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 pb-20">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Visão Geral</h2>
             
            <CollapsibleSection title="Estatísticas" defaultOpen={true}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pedidos</span>
                    <FiShoppingCart className="text-gray-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">{stats.totalOrders}</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendentes</span>
                    <FiClock className="text-gray-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">{stats.pendingOrders}</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Em Preparo</span>
                    <FiClock className="text-gray-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">{stats.preparingOrders}</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prontos</span>
                    <FiCheck className="text-gray-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">{stats.readyOrders}</div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Pedidos Recentes">
              <div className="mb-4">
                <StatusTabs 
                  activeTab={dashboardStatusTab} 
                  onTabChange={setDashboardStatusTab} 
                />
              </div>
              
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.slice(0, 5).map(order => (
                    <OrderView
                      key={order.id}
                      order={order}
                      onPrint={printOrder}
                      onCancel={(order) => setOrderToCancel(order)}
                      onMarkAsReady={markOrderAsReady}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                  Nenhum pedido encontrado
                </div>
              )}
            </CollapsibleSection>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              <div className="flex items-center w-full">
                <button
                  onClick={() => setOrdersCollapsed(!ordersCollapsed)}
                  className="mr-2 text-gray-600 hover:text-gray-800"
                >
                  {ordersCollapsed ? <FiChevronDown /> : <FiChevronUp />}
                </button>
                <h2 className="text-xl font-bold">Todos os Pedidos</h2>
              </div>
              {!ordersCollapsed && (
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar pedidos..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendentes</option>
                    <option value="preparing">Em Preparo</option>
                    <option value="ready">Prontos</option>
                  </select>
                </div>
              )}
            </div>

            {!ordersCollapsed && (
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <OrderView
                      key={order.id}
                      order={order}
                      onPrint={printOrder}
                      onCancel={(order) => setOrderToCancel(order)}
                      onMarkAsReady={markOrderAsReady}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                    Nenhum pedido encontrado
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {orderToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cancelar Pedido</h3>
              <p className="text-sm text-gray-500 mb-4">
                Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setOrderToCancel(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  onClick={() => cancelOrder(orderToCancel)}
                  disabled={isCanceling}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-red-400"
                >
                  {isCanceling ? 'Cancelando...' : 'Confirmar Cancelamento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;