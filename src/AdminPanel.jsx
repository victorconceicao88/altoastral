import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { loginAnonimo } from './firebase';
import { FiShoppingCart, FiClock, FiCheck, FiTruck, FiHome, FiPrinter, FiEdit, FiTrash2, FiSearch, FiUser, FiPlus, FiMinus, FiX, FiInfo, FiAlertCircle, FiCheckCircle, FiLock, FiChevronDown, FiChevronUp, FiPhone, FiMapPin } from 'react-icons/fi';
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

const PRINTER_CONFIG = {
  deviceName: "BlueTooth Printer",
  serviceUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
  characteristicUUID: "0000ff02-0000-1000-8000-00805f9b34fb",
  maxRetries: 3,
  timeout: 10000, // 10 segundos
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

const orderSchema = z.object({
  customerName: z.string().min(1, "Nome é obrigatório"),
  tableNumber: z.number().min(1, "Número da mesa é obrigatório").max(50, "Número inválido")
});

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

const OrderItem = ({ item, onQuantityChange, onRemove, showStatus = false, showCustomer = false, showNotes = false }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      onQuantityChange && onQuantityChange(item.id, newQuantity);
    } else if (newQuantity < 1) {
      onRemove && onRemove(item.id);
    }
  };

  return (
    <div className="p-3 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-medium">{item.name}</div>
          {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
          {showCustomer && item.customerName && <div className="text-xs text-gray-600">Cliente: {item.customerName}</div>}
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
      
      {onQuantityChange && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
            >
              <FiMinus size={14} />
            </button>
            <span className="px-3 py-1 w-12 text-center border-x border-gray-300">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
            >
              <FiPlus size={14} />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const TableOrderView = ({ 
  tableOrder, 
  onEdit, 
  onDelete, 
  isExpanded = false, 
  onToggleExpand,
}) => {
  const hasNewItems = tableOrder.customers.some(customer => {
    const items = customer.items || [];
    return items.some(item => !item.printedTimestamp);
  });

  const groupItemsByType = (items) => {
    const isBarItem = (item) => ['bebidas', 'cafe'].includes(item.category);
    
    return items.reduce((acc, item) => {
      const type = isBarItem(item) ? 'bar' : 'kitchen';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onToggleExpand}
            className="mr-2 text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </button>
          <h3 className="font-bold text-lg">Mesa {tableOrder.tableNumber}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={tableOrder.status} />
          {hasNewItems && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              Novos itens
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {tableOrder.customers.map(customer => {
            const groupedItems = groupItemsByType(customer.items);
            const hasKitchenItems = groupedItems.kitchen && groupedItems.kitchen.length > 0;
            const hasBarItems = groupedItems.bar && groupedItems.bar.length > 0;

            return (
              <div key={customer.id} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-3 bg-gray-50 flex items-center">
                  <FiUser className="text-gray-600 mr-2" />
                  <span className="font-medium">{customer.name}</span>
                  {customer.notes && (
                    <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                      <FiInfo size={12} className="mr-1" /> Observações
                    </span>
                  )}
                </div>

                <div className="px-4 py-2">
                  {customer.notes && (
                    <div className="mb-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                      <strong>Observações:</strong> {customer.notes}
                    </div>
                  )}

                  {hasKitchenItems && (
                    <>
                      <div className="text-center text-sm font-medium my-2 text-gray-600">------- COZINHA -------</div>
                      {groupedItems.kitchen.map(item => (
                        <OrderItem
                          key={item.id}
                          item={{ ...item, customerName: customer.name }}
                          showStatus={!item.printedTimestamp}
                        />
                      ))}
                    </>
                  )}

                  {hasBarItems && (
                    <>
                      <div className="text-center text-sm font-medium my-2 text-gray-600">------- BAR -------</div>
                      {groupedItems.bar.map(item => (
                        <OrderItem
                          key={item.id}
                          item={{ ...item, customerName: customer.name }}
                          showStatus={!item.printedTimestamp}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div>
              <div className="font-bold">Total: €{tableOrder.total.toFixed(2)}</div>
              <div className="text-sm text-gray-500">
                {new Date(tableOrder.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(tableOrder)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center text-sm"
              >
                <FiEdit className="mr-2" /> Editar Pedido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MenuItemAdder = ({ onAddItem }) => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.key || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!activeCategory || !menu[activeCategory]) return [];
    if (!searchTerm) return menu[activeCategory] || [];
    return (menu[activeCategory] || []).filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )}, [activeCategory, searchTerm]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar item..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex overflow-x-auto pb-2 mb-4">
        {menuCategories.map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${activeCategory === category.key ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => onAddItem(item)}
          >
            <div className="font-medium">{item.name}</div>
            {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
            <div className="text-sm font-bold mt-1">€{item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [activeOrderType, setActiveOrderType] = useState('all');
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [expandedTables, setExpandedTables] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);
  const [localChanges, setLocalChanges] = useState({
    addedItems: [],
    removedItems: [],
    updatedItems: []
  });

  const printerDeviceRef = useRef(null);
  const printerCharacteristicRef = useRef(null);

  const consolidateTableOrders = (orders) => {
    const tableOrdersMap = {};

    orders.forEach(order => {
      if (order.orderType !== 'dine-in' || order.status === 'completed') return;

      const tableNumber = order.tableNumber;
      const tableKey = `table-${tableNumber}`;

      if (!tableOrdersMap[tableKey]) {
        tableOrdersMap[tableKey] = {
          tableNumber,
          status: order.status,
          customers: [],
          orderIds: [],
          timestamp: order.timestamp,
          total: 0,
          originalIds: []
        };
      }

      const items = Array.isArray(order.items) ? order.items : [];

      tableOrdersMap[tableKey].customers.push({
        id: `customer-${order.id}`,
        name: order.customer?.name || 'Cliente',
        notes: order.customer?.notes,
        items: items
      });

      tableOrdersMap[tableKey].orderIds.push(order.id);
      tableOrdersMap[tableKey].originalIds.push(order.id);
      tableOrdersMap[tableKey].total += order.total || 0;

      if (order.status === 'preparing' || order.status === 'ready') {
        tableOrdersMap[tableKey].status = order.status;
      }

      if (new Date(order.timestamp) > new Date(tableOrdersMap[tableKey].timestamp)) {
        tableOrdersMap[tableKey].timestamp = order.timestamp;
      }
    });

    return tableOrdersMap;
  };

  const loadOrders = useCallback(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          items: Array.isArray(data[key].items) ? data[key].items : [],
          customer: data[key].customer || { name: 'Cliente não informado' },
          orderType: data[key].orderType || 'takeaway'
        }));
        
        const consolidated = consolidateTableOrders(ordersArray);
        setTableOrders(consolidated);
        setOrders(ordersArray.filter(order => order.orderType !== 'dine-in').reverse());
        
        setExpandedTables(prev => {
          const newExpanded = {...prev};
          Object.keys(consolidated).forEach(key => {
            if (!(key in newExpanded)) {
              newExpanded[key] = false;
            }
          });
          return newExpanded;
        });
      } else {
        setOrders([]);
        setTableOrders({});
        setExpandedTables({});
      }
    });
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatOrderForPrint = (order) => {
    const ESC = '\x1B';
    const CENTER = `${ESC}a1`;
    const BOLD_ON = `${ESC}!${String.fromCharCode(8)}`;
    const BOLD_OFF = `${ESC}!${String.fromCharCode(0)}`;
    const LINE = '--------------------------------\n';

    let receipt = `${ESC}@${CENTER}${BOLD_ON}RESTAURANTE ALTO ASTRAL${BOLD_OFF}\n`;
    
    if (order.tableNumber) {
      receipt += `${CENTER}MESA: ${order.tableNumber}\n\n`;
    } else {
      receipt += `${CENTER}PEDIDO: #${order.id?.slice(0, 6) || 'N/A'}\n`;
      receipt += `${CENTER}Cliente: ${order.customer?.name || 'Não informado'}\n`;
      if (order.customer?.phone) {
        receipt += `${CENTER}Telefone: ${order.customer.phone}\n`;
      }
      if (order.orderType === 'delivery' && order.customer?.address) {
        receipt += `${CENTER}Endereço: ${order.customer.address}\n`;
      }
      receipt += `\n`;
    }

    if (order.customer?.notes) {
      receipt += `${BOLD_ON}OBSERVAÇÕES:${BOLD_OFF}\n`;
      receipt += `${order.customer.notes}\n\n`;
    }

    const groupItemsByType = (items) => {
      const isBarItem = (item) => ['bebidas', 'cafe'].includes(item.category);
      
      return (items || []).reduce((acc, item) => {
        const type = isBarItem(item) ? 'bar' : 'kitchen';
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
      }, {});
    };

    const groupedItems = groupItemsByType(order.items);

    if (groupedItems.kitchen) {
      receipt += `${BOLD_ON}=== COZINHA ===${BOLD_OFF}\n`;
      groupedItems.kitchen.forEach(item => {
        receipt += `${item.quantity}x ${item.name}\n`;
        if (item.notes) receipt += `OBS: ${item.notes}\n`;
      });
      receipt += `\n`;
    }

    if (groupedItems.bar) {
      receipt += `${BOLD_ON}=== BAR ===${BOLD_OFF}\n`;
      groupedItems.bar.forEach(item => {
        receipt += `${item.quantity}x ${item.name}\n`;
        if (item.notes) receipt += `OBS: ${item.notes}\n`;
      });
    }

    receipt += `\n${LINE}`;
    receipt += `${CENTER}TOTAL: €${order.total.toFixed(2)}\n`;
    receipt += `${LINE}`;
    receipt += `${CENTER}${new Date().toLocaleTimeString()}\n`;
    receipt += `${CENTER}Obrigado pela preferência!\n`;
    
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
        
        // Dividir os dados em chunks para evitar problemas com grandes pedidos
        const chunkSize = 100;
        for (let i = 0; i < encodedData.length; i += chunkSize) {
          const chunk = encodedData.slice(i, i + chunkSize);
          await characteristic.writeValueWithoutResponse(chunk);
          await new Promise(resolve => setTimeout(resolve, 50)); // Pequeno delay entre chunks
        }
        
        return true;
      } catch (error) {
        lastError = error;
        retries++;
        if (retries < PRINTER_CONFIG.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de tentar novamente
        }
      }
    }

    throw lastError || new Error('Falha ao enviar para impressora após várias tentativas');
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
      
      if (order.originalIds && order.originalIds.length > 0) {
        // É uma mesa com múltiplos pedidos
        order.originalIds.forEach(id => {
          order.items.forEach(item => {
            if (!item.printedTimestamp) {
              updates[`orders/${id}/items/${item.id}/printedTimestamp`] = now;
            }
          });
          
          if (order.status === 'pending') {
            updates[`orders/${id}/status`] = 'preparing';
          }
        });
      } else {
        // É um pedido único
        order.items.forEach(item => {
          if (!item.printedTimestamp) {
            updates[`orders/${order.id}/items/${item.id}/printedTimestamp`] = now;
          }
        });
        
        if (order.status === 'pending') {
          updates[`orders/${order.id}/status`] = 'preparing';
        }
      }
      
      await update(ref(database), updates);
      
      toast.success('✅ Pedido enviado para cozinha com sucesso!');
      
      // Atualizar estado local
      setCurrentOrder(prev => ({
        ...prev,
        items: prev.items.map(item => ({
          ...item,
          printedTimestamp: item.printedTimestamp || now
        })),
        status: prev.status === 'pending' ? 'preparing' : prev.status
      }));
      
      setIsEditModalOpen(false);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await update(ref(database, `orders/${orderId}/status`), newStatus);
      toast.success(`Status atualizado para ${newStatus === 'ready' ? 'Pronto' : 'Em Preparo'}`);
    } catch (error) {
      toast.error('❌ Erro ao atualizar status');
    }
  };

  const openEditModal = (order) => {
    setLocalChanges({
      addedItems: [],
      removedItems: [],
      updatedItems: []
    });

    if (order.originalIds) {
      // É uma mesa consolidada - precisamos reconstruir o pedido
      const consolidatedOrder = {
        ...order,
        id: order.originalIds[0],
        items: order.customers.flatMap(customer => 
          customer.items.map(item => ({
            ...item,
            customerName: customer.name,
            customerNotes: customer.notes,
            orderId: order.originalIds[0]
          }))
        ),
        customer: {
          name: 'Mesa ' + order.tableNumber,
          notes: ''
        }
      };
      setCurrentOrder(consolidatedOrder);
    } else {
      // É um pedido individual
      setCurrentOrder({
        ...order,
        items: [...(order.items || [])]
      });
    }
    setIsEditModalOpen(true);
  };

  const addItemToOrder = (menuItem) => {
    if (!currentOrder) return;
    
    const newItemId = push(ref(database, `orders/${currentOrder.id}/items`)).key;
    const newItem = { 
      ...menuItem,
      id: newItemId,
      quantity: 1,
      printedTimestamp: null,
      addedByStaff: true
    };
    
    setCurrentOrder(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      total: prev.total + menuItem.price
    }));
    
    setLocalChanges(prev => ({
      ...prev,
      addedItems: [...prev.addedItems, newItem]
    }));
  };

  const removeItemFromOrder = (itemId) => {
    const itemToRemove = currentOrder.items.find(item => item.id === itemId);
    if (!itemToRemove) return;
    
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId),
      total: prev.total - (itemToRemove.price * itemToRemove.quantity)
    }));
    
    setLocalChanges(prev => {
      if (prev.addedItems.some(item => item.id === itemId)) {
        return {
          ...prev,
          addedItems: prev.addedItems.filter(item => item.id !== itemId)
        };
      }
      
      return {
        ...prev,
        removedItems: [...prev.removedItems, itemId]
      };
    });
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return removeItemFromOrder(itemId);
    
    const itemIndex = currentOrder.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const oldItem = currentOrder.items[itemIndex];
    const quantityDifference = newQuantity - oldItem.quantity;
    
    const updatedItem = {
      ...oldItem,
      quantity: newQuantity
    };
    
    const updatedItems = [...currentOrder.items];
    updatedItems[itemIndex] = updatedItem;
    
    setCurrentOrder(prev => ({
      ...prev,
      items: updatedItems,
      total: prev.total + (quantityDifference * oldItem.price)
    }));
    
    setLocalChanges(prev => {
      const existingUpdateIndex = prev.updatedItems.findIndex(u => u.id === itemId);
      
      if (existingUpdateIndex !== -1) {
        const updatedUpdates = [...prev.updatedItems];
        updatedUpdates[existingUpdateIndex] = updatedItem;
        return {
          ...prev,
          updatedItems: updatedUpdates
        };
      }
      
      const addedItemIndex = prev.addedItems.findIndex(item => item.id === itemId);
      if (addedItemIndex !== -1) {
        const updatedAdditions = [...prev.addedItems];
        updatedAdditions[addedItemIndex] = updatedItem;
        return {
          ...prev,
          addedItems: updatedAdditions
        };
      }
      
      return {
        ...prev,
        updatedItems: [...prev.updatedItems, updatedItem]
      };
    });
  };

  const saveOrderChanges = async () => {
    if (!currentOrder) return;
    
    try {
      setIsSavingChanges(true);
      toast.info('Salvando alterações...');
      
      const updates = {};
      
      // Adicionar novos itens
      localChanges.addedItems.forEach(item => {
        updates[`orders/${currentOrder.id}/items/${item.id}`] = {
          ...item,
          printedTimestamp: null
        };
      });
      
      // Remover itens
      localChanges.removedItems.forEach(itemId => {
        updates[`orders/${currentOrder.id}/items/${itemId}`] = null;
      });
      
      // Atualizar itens modificados
      localChanges.updatedItems.forEach(item => {
        updates[`orders/${currentOrder.id}/items/${item.id}`] = item;
      });
      
      // Atualizar total
      updates[`orders/${currentOrder.id}/total`] = currentOrder.total;
      
      // Se for uma mesa consolidada, aplicar as mesmas alterações em todos os pedidos da mesa
      if (currentOrder.originalIds && currentOrder.originalIds.length > 1) {
        currentOrder.originalIds.slice(1).forEach(id => {
          localChanges.addedItems.forEach(item => {
            const newItemId = push(ref(database)).key;
            updates[`orders/${id}/items/${newItemId}`] = {
              ...item,
              id: newItemId,
              printedTimestamp: null
            };
          });
          
          localChanges.removedItems.forEach(itemId => {
            updates[`orders/${id}/items/${itemId}`] = null;
          });
          
          localChanges.updatedItems.forEach(item => {
            updates[`orders/${id}/items/${item.id}`] = item;
          });
          
          updates[`orders/${id}/total`] = currentOrder.total;
        });
      }
      
      await update(ref(database), updates);
      
      toast.success('✅ Alterações salvas com sucesso!');
      setIsEditModalOpen(false);
      setIsEditingOrder(false);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast.error('❌ Erro ao salvar alterações');
    } finally {
      setIsSavingChanges(false);
    }
  };

  const closeTable = async () => {
    try {
      setIsSavingChanges(true);
      toast.info('Fechando mesa...');
      
      if (currentOrder.originalIds && currentOrder.originalIds.length > 0) {
        const updates = {};
        currentOrder.originalIds.forEach(id => {
          updates[`orders/${id}/status`] = 'completed';
        });
        await update(ref(database), updates);
      } else {
        await update(ref(database, `orders/${currentOrder.id}/status`), 'completed');
      }
      
      toast.success('✅ Mesa fechada com sucesso!');
      setIsEditModalOpen(false);
      setIsConfirmingClose(false);
    } catch (error) {
      toast.error('❌ Erro ao fechar mesa');
    } finally {
      setIsSavingChanges(false);
    }
  };

  const toggleTableExpand = (tableKey) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableKey]: !prev[tableKey]
    }));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (activeOrderType !== 'all' && order.orderType !== activeOrderType) return false;
      if (filter !== 'all' && order.status !== filter) return false;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesId = order.id?.toLowerCase().includes(searchLower);
        const matchesCustomer = order.customer?.name?.toLowerCase().includes(searchLower);
        return matchesId || matchesCustomer;
      }
      return true;
    });
  }, [orders, activeOrderType, filter, searchQuery]);

  const filteredTableOrders = useMemo(() => {
    return Object.entries(tableOrders)
      .filter(([key, order]) => {
        if (activeOrderType !== 'all' && activeOrderType !== 'dine-in') return false;
        if (filter !== 'all' && order.status !== filter) return false;
        if (searchQuery) {
          return order.tableNumber?.toString().includes(searchQuery);
        }
        return true;
      })
      .map(([key, order]) => ({
        key,
        ...order
      }));
  }, [tableOrders, activeOrderType, filter, searchQuery]);

  const stats = {
    totalOrders: orders.length + Object.keys(tableOrders).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length + 
                 Object.values(tableOrders).filter(o => o.status === 'pending').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length + 
                   Object.values(tableOrders).filter(o => o.status === 'preparing').length,
    readyOrders: orders.filter(o => o.status === 'ready').length + 
               Object.values(tableOrders).filter(o => o.status === 'ready').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4 shadow sticky top-0 z-20">
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
          <div className="flex p-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'dashboard' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'orders' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
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
             
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Pedidos Recentes</h3>
              </div>
              
              {filteredTableOrders.slice(0, 3).map(({key, ...tableOrder}) => (
                <TableOrderView
                  key={key}
                  tableOrder={tableOrder}
                  onEdit={openEditModal}
                  isExpanded={expandedTables[key]}
                  onToggleExpand={() => toggleTableExpand(key)}
                />
              ))}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm">#{order.id?.slice(0, 6)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {order.orderType === 'delivery' ? 'Entrega' : 'Retirada'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{order.items?.length || 0}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails(order);
                                setIsOrderDetailsOpen(true);
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                            >
                              Ver
                            </button>
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                              >
                                Pronto
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              <h2 className="text-xl font-bold">Todos os Pedidos</h2>
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
                  value={activeOrderType}
                  onChange={(e) => setActiveOrderType(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="all">Todos</option>
                  <option value="dine-in">Mesas</option>
                  <option value="delivery">Entregas</option>
                  <option value="takeaway">Retiradas</option>
                </select>
              </div>
            </div>

            {(activeOrderType === 'all' || activeOrderType === 'dine-in') && (
              <div className="mb-6">
                {filteredTableOrders.length > 0 ? (
                  filteredTableOrders.map(({key, ...tableOrder}) => (
                    <TableOrderView
                      key={key}
                      tableOrder={tableOrder}
                      onEdit={openEditModal}
                      onDelete={(order) => {
                        setOrderToDelete(order);
                        setIsConfirmDelete(true);
                      }}
                      isExpanded={expandedTables[key]}
                      onToggleExpand={() => toggleTableExpand(key)}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                    Nenhuma mesa com pedidos encontrada
                  </div>
                )}
              </div>
            )}

            {(activeOrderType === 'all' || activeOrderType === 'delivery' || activeOrderType === 'takeaway') && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">#{order.id?.slice(0, 6)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {new Date(order.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {order.customer?.name || 'Não informado'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {order.items?.length || 0}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              €{(order.total || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setSelectedOrderDetails(order);
                                    setIsOrderDetailsOpen(true);
                                  }}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                                >
                                  Ver
                                </button>
                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'ready')}
                                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs text-white"
                                  >
                                    Pronto
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 py-3 text-center text-sm text-gray-500">
                            Nenhum pedido encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOrderDetailsOpen ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">Detalhes do Pedido #{selectedOrderDetails?.id?.slice(0, 6)}</h3>
            <button onClick={() => setIsOrderDetailsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
          
          {selectedOrderDetails && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium mb-2">Informações do Pedido</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Tipo:</span> {selectedOrderDetails.orderType === 'dine-in' ? 'Mesa' : selectedOrderDetails.orderType === 'delivery' ? 'Entrega' : 'Retirada'}</div>
                    <div><span className="text-gray-600">Data/Hora:</span> {new Date(selectedOrderDetails.timestamp).toLocaleString()}</div>
                    <div><span className="text-gray-600">Status:</span> <StatusBadge status={selectedOrderDetails.status} /></div>
                    <div><span className="text-gray-600">Total:</span> €{(selectedOrderDetails.total || 0).toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium mb-2">Informações do Cliente</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Nome:</span> {selectedOrderDetails.customer?.name || 'Não informado'}</div>
                    {selectedOrderDetails.customer?.phone && (
                      <div className="flex items-center"><FiPhone className="mr-1" /> {selectedOrderDetails.customer.phone}</div>
                    )}
                    {selectedOrderDetails.orderType === 'delivery' && selectedOrderDetails.customer?.address && (
                      <div className="flex items-start"><FiMapPin className="mr-1 mt-1 flex-shrink-0" /> {selectedOrderDetails.customer.address}</div>
                    )}
                    {selectedOrderDetails.customer?.notes && (
                      <div><span className="text-gray-600">Observações:</span> {selectedOrderDetails.customer.notes}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                <div className="border border-gray-200 rounded divide-y divide-gray-200">
                  {selectedOrderDetails.items?.length > 0 ? (
                    selectedOrderDetails.items.map((item, idx) => (
                      <OrderItem
                        key={`${item.id}-${idx}`}
                        item={item}
                        showStatus={!item.printedTimestamp}
                        showCustomer={!!item.customerName}
                        showNotes={!!item.notes}
                      />
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">Nenhum item encontrado</div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsOrderDetailsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setIsOrderDetailsOpen(false);
                    openEditModal(selectedOrderDetails);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Editar Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição de Pedido */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isEditModalOpen ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">
              {currentOrder?.orderType === 'dine-in' ? `Comanda - Mesa ${currentOrder?.tableNumber}` : `Editar Pedido #${currentOrder?.id?.slice(0, 6)}`}
            </h3>
            <button 
              onClick={() => {
                setIsEditModalOpen(false);
                setIsEditingOrder(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          {currentOrder && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-4 flex justify-between items-center">
                    <h4 className="font-medium">Itens da Comanda</h4>
                    <button
                      onClick={() => setIsEditingOrder(!isEditingOrder)}
                      className={`px-3 py-1 rounded text-sm ${isEditingOrder ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {isEditingOrder ? 'Parar Edição' : 'Editar Comanda'}
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {currentOrder.items?.length > 0 ? (
                      currentOrder.items.map((item, idx) => (
                        <OrderItem
                          key={`${item.id}-${idx}`}
                          item={item}
                          onQuantityChange={isEditingOrder ? updateItemQuantity : null}
                          onRemove={isEditingOrder ? removeItemFromOrder : null}
                          showStatus={!item.printedTimestamp}
                          showCustomer={!!item.customerName}
                          showNotes={!!item.notes}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">Nenhum item adicionado</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {isEditingOrder && (
                    <MenuItemAdder onAddItem={addItemToOrder} />
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium mb-3">Resumo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <StatusBadge status={currentOrder.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Itens:</span>
                        <span>{currentOrder.items?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold">€{(currentOrder.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {isEditingOrder && (
                      <>
                        <button
                          onClick={saveOrderChanges}
                          disabled={isSavingChanges}
                          className={`w-full py-2 rounded text-white flex items-center justify-center ${isSavingChanges ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {isSavingChanges ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingOrder(false);
                          }}
                          className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          Cancelar Edição
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => printOrder(currentOrder)}
                      disabled={isPrinting}
                      className={`w-full py-2 rounded text-white flex items-center justify-center ${isPrinting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {isPrinting ? 'Enviando...' : 'Enviar para Cozinha'}
                    </button>
                    
                    {currentOrder.status !== 'completed' && (
                      <button
                        onClick={() => setIsConfirmingClose(true)}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center"
                      >
                        <FiLock className="mr-2" /> Fechar Mesa
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium mb-2">Status do Pedido</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateOrderStatus(currentOrder.id, 'pending')}
                        className={`py-1 px-2 rounded text-xs ${currentOrder.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                      >
                        Pendente
                      </button>
                      <button
                        onClick={() => updateOrderStatus(currentOrder.id, 'preparing')}
                        className={`py-1 px-2 rounded text-xs ${currentOrder.status === 'preparing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        Em Preparo
                      </button>
                      <button
                        onClick={() => updateOrderStatus(currentOrder.id, 'ready')}
                        className={`py-1 px-2 rounded text-xs ${currentOrder.status === 'ready' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                      >
                        Pronto
                      </button>
                      <button
                        onClick={() => updateOrderStatus(currentOrder.id, 'completed')}
                        className={`py-1 px-2 rounded text-xs ${currentOrder.status === 'completed' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                      >
                        Finalizado
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação para Fechar Mesa */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isConfirmingClose ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fechar Mesa</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja fechar esta mesa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsConfirmingClose(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={closeTable}
                disabled={isSavingChanges}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-red-400"
              >
                {isSavingChanges ? 'Fechando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação para Excluir Pedido */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isConfirmDelete ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir {orderToDelete?.originalIds?.length > 1 ? 'todos os pedidos desta mesa?' : 'este pedido?'}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (orderToDelete.originalIds?.length > 0) {
                    const deletePromises = orderToDelete.originalIds.map(id => 
                      remove(ref(database, `orders/${id}`))
                    );
                    Promise.all(deletePromises)
                      .then(() => toast.success('Pedidos excluídos!'))
                      .catch(() => toast.error('Erro ao excluir'));
                  } else {
                    remove(ref(database, `orders/${orderToDelete.id}`))
                      .then(() => toast.success('Pedido excluído!'))
                      .catch(() => toast.error('Erro ao excluir'));
                  }
                  setIsConfirmDelete(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;