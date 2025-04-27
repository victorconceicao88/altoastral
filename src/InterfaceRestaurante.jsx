import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiUsers, FiPlus, FiMinus, FiTrash2, 
  FiCoffee, FiMenu, FiClock, FiUser,
  FiDollarSign, FiPrinter, FiSend, FiShoppingCart,
  FiChevronRight, FiMaximize2, FiGrid, FiExternalLink,
  FiStar, FiHeart, FiAward, FiZap, FiSun, FiMapPin,
  FiCheckCircle, FiXCircle, FiPhone, FiAlertCircle,
  FiChevronDown, FiCreditCard, FiEdit2, FiLock, FiUnlock,
  FiLogOut, FiSettings, FiBell, FiPieChart, FiCalendar
} from 'react-icons/fi';
import { FaChair, FaQrcode, FaReceipt, FaUtensils, FaGlassCheers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, update, remove, get } from 'firebase/database';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPGwoIF7ReMQsjXGngZ86vuC1P2X0iV0E",
  authDomain: "auto-astral-b5295.firebaseapp.com",
  databaseURL: "https://auto-astral-b5295-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "auto-astral-b5295",
  storageBucket: "auto-astral-b5295.firebasestorage.app",
  messagingSenderId: "865984431676",
  appId: "1:865984431676:web:1202dc70df895259c46539"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const MesaSystem = () => {
  const [painelAtivo, setPainelAtivo] = useState('mesas');
  const [mesas, setMesas] = useState([]);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [itensConsumo, setItensConsumo] = useState([]);
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [novaMesa, setNovaMesa] = useState({ nome: '', area: 'Sala Interna', capacidade: 4 });
  const [mostrarModalMesa, setMostrarModalMesa] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  const [abaCardapio, setAbaCardapio] = useState('cozinha');
  const [garcons, setGarcons] = useState([]);

  // Static menu (can be moved to Firebase if needed)
  const cardapio = {
    cozinha: [
      { id: 1, nome: 'Prato do Dia', preco: 35.00, categoria: 'principais', tempoPreparo: 20 },
      { id: 2, nome: 'Filé Mignon', preco: 65.00, categoria: 'principais', tempoPreparo: 25 },
      { id: 3, nome: 'Risoto de Cogumelos', preco: 45.00, categoria: 'principais', tempoPreparo: 30 },
      { id: 4, nome: 'Salada Caesar', preco: 28.00, categoria: 'entradas', tempoPreparo: 10 },
      { id: 5, nome: 'Bruschetta', preco: 22.00, categoria: 'entradas', tempoPreparo: 15 },
      { id: 6, nome: 'Tiramisu', preco: 25.00, categoria: 'sobremesas', tempoPreparo: 5 },
      { id: 7, nome: 'Brownie', preco: 18.00, categoria: 'sobremesas', tempoPreparo: 5 }
    ],
    bar: [
      { id: 8, nome: 'Cerveja Artesanal', preco: 15.00, categoria: 'bebidas', tempoPreparo: 2 },
      { id: 9, nome: 'Vinho Tinto', preco: 35.00, categoria: 'bebidas', tempoPreparo: 2 },
      { id: 10, nome: 'Whisky', preco: 45.00, categoria: 'bebidas', tempoPreparo: 2 },
      { id: 11, nome: 'Caipirinha', preco: 22.00, categoria: 'drinks', tempoPreparo: 8 },
      { id: 12, nome: 'Mojito', preco: 25.00, categoria: 'drinks', tempoPreparo: 10 },
      { id: 13, nome: 'Água Mineral', preco: 5.00, categoria: 'bebidas', tempoPreparo: 1 },
      { id: 14, nome: 'Refrigerante', preco: 8.00, categoria: 'bebidas', tempoPreparo: 1 }
    ]
  };

  // Load data from Firebase when component mounts
  useEffect(() => {
    // Listen for table changes
    const mesasRef = ref(database, 'restaurante/mesas');
    onValue(mesasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mesasArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMesas(mesasArray);
        
        // Update selected table if open
        if (mesaSelecionada) {
          const mesaAtualizada = mesasArray.find(m => m.id === mesaSelecionada.id);
          if (mesaAtualizada) {
            setMesaSelecionada(mesaAtualizada);
            setItensConsumo(mesaAtualizada.itensConsumo ? Object.values(mesaAtualizada.itensConsumo) : []);
          }
        }
      } else {
        setMesas([]);
      }
    });

    // Load waiters
    const garconsRef = ref(database, 'restaurante/garcons');
    onValue(garconsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const garconsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setGarcons(garconsArray);
      }
    });
  }, [mesaSelecionada]);

  // Open table (update in Firebase)
  const abrirMesa = async (mesa) => {
    if (mesa.status === 'ocupada') {
      setMesaSelecionada(mesa);
      return;
    }
    
    try {
      const updates = {
        status: 'ocupada',
        horaAbertura: new Date().toISOString(),
        itensConsumo: {} // Initialize empty consumption items
      };
      
      await update(ref(database, `restaurante/mesas/${mesa.id}`), updates);
      
      toast.success(`Mesa ${mesa.nome} aberta com sucesso!`);
    } catch (error) {
      console.error('Erro ao abrir mesa:', error);
      toast.error('Erro ao abrir mesa!');
    }
  };

  // Add item to consumption (update in Firebase)
  const adicionarItem = async (item) => {
    if (!mesaSelecionada) return;
    
    try {
      const novoItem = {
        ...item,
        id: Date.now().toString(),
        quantidade: 1,
        hora: new Date().toLocaleTimeString(),
        categoriaCardapio: abaCardapio
      };
      
      // Add item to table in Firebase
      const newItemRef = push(ref(database, `restaurante/mesas/${mesaSelecionada.id}/itensConsumo`));
      await set(newItemRef, novoItem);
      
      // Update total consumption
      const novoConsumo = (mesaSelecionada.consumo || 0) + novoItem.preco;
      await update(ref(database, `restaurante/mesas/${mesaSelecionada.id}`), {
        consumo: novoConsumo
      });
      
      toast.success(`${item.nome} adicionado à mesa!`);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast.error('Erro ao adicionar item!');
    }
  };

  // Remove item from consumption (update in Firebase)
  const removerItem = async (itemId) => {
    if (!mesaSelecionada) return;
    
    try {
      // Find item to calculate value to be removed
      const itemRemovido = itensConsumo.find(item => item.id === itemId);
      if (!itemRemovido) return;
      
      // Remove item from Firebase
      await remove(ref(database, `restaurante/mesas/${mesaSelecionada.id}/itensConsumo/${itemId}`));
      
      // Update total consumption
      const novoConsumo = (mesaSelecionada.consumo || 0) - (itemRemovido.preco * itemRemovido.quantidade);
      await update(ref(database, `restaurante/mesas/${mesaSelecionada.id}`), {
        consumo: novoConsumo
      });
      
      toast.error('Item removido da comanda!');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover item!');
    }
  };

  // Update item quantity (update in Firebase)
  const atualizarQuantidade = async (itemId, novaQuantidade) => {
    if (novaQuantidade < 1) {
      removerItem(itemId);
      return;
    }
    
    try {
      const itemAtualizado = itensConsumo.find(item => item.id === itemId);
      if (!itemAtualizado) return;
      
      // Update quantity in Firebase
      await update(ref(database, `restaurante/mesas/${mesaSelecionada.id}/itensConsumo/${itemId}`), {
        quantidade: novaQuantidade
      });
      
      // Recalculate total consumption (optional, can be done via Firebase rules)
      const itensAtualizados = itensConsumo.map(item => 
        item.id === itemId ? { ...item, quantidade: novaQuantidade } : item
      );
      const novoConsumo = itensAtualizados.reduce((total, item) => total + (item.preco * item.quantidade), 0);
      
      await update(ref(database, `restaurante/mesas/${mesaSelecionada.id}`), {
        consumo: novoConsumo
      });
      
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast.error('Erro ao atualizar quantidade!');
    }
  };

  // Close table (show payment modal)
  const fecharMesa = () => {
    setMostrarModalPagamento(true);
  };

  // Confirm table closure (update in Firebase)
  const confirmarFechamentoMesa = async () => {
    if (!mesaSelecionada) return;
    
    try {
      const updates = {
        status: 'livre',
        consumo: 0,
        horaAbertura: null,
        itensConsumo: {} // Clear consumption items
      };
      
      await update(ref(database, `restaurante/mesas/${mesaSelecionada.id}`), updates);
      
      // Register closure in history
      const pagamentoRef = push(ref(database, 'restaurante/historico'));
      await set(pagamentoRef, {
        mesa: mesaSelecionada.nome,
        total: mesaSelecionada.consumo,
        data: new Date().toISOString()
      });
      
      setMesaSelecionada(null);
      setItensConsumo([]);
      setMostrarModalPagamento(false);
      
      toast.success(`Mesa ${mesaSelecionada.nome} fechada com sucesso!`);
    } catch (error) {
      console.error('Erro ao fechar mesa:', error);
      toast.error('Erro ao fechar mesa!');
    }
  };

  // Add new table (update in Firebase)
  const adicionarNovaMesa = async () => {
    try {
      const novaMesaObj = {
        nome: novaMesa.nome || `Mesa ${mesas.length + 1}`,
        area: novaMesa.area,
        status: 'livre',
        capacidade: novaMesa.capacidade,
        consumo: 0,
        qrCode: `mesa-${mesas.length + 1}`,
      };
      
      const newMesaRef = push(ref(database, 'restaurante/mesas'));
      await set(newMesaRef, novaMesaObj);
      
      setMostrarModalMesa(false);
      setNovaMesa({ nome: '', area: 'Sala Interna', capacidade: 4 });
      
      toast.success('Nova mesa adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar mesa:', error);
      toast.error('Erro ao adicionar mesa!');
    }
  };

  // Filter tables
  const mesasFiltradas = mesas.filter(mesa => {
    if (filtro === 'todas') return true;
    if (filtro === 'livres') return mesa.status === 'livre';
    if (filtro === 'ocupadas') return mesa.status === 'ocupada';
    return mesa.area === filtro;
  });

  // QR Code View
  if (mesaSelecionada && mesaSelecionada.status === 'livre') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">QR Code da Mesa</h2>
            <p className="text-gray-600">{mesaSelecionada.nome} - {mesaSelecionada.area}</p>
            <p className="text-sm text-gray-500 mt-1">Capacidade: {mesaSelecionada.capacidade} lugares</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <QRCode 
              value={`${window.location.origin}/mesa/${mesaSelecionada.qrCode}`}
              size={200}
              level="H"
              fgColor="#4f46e5"
              includeMargin={true}
            />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Escaneie este QR code para acessar o cardápio digital
            </p>
            <p className="text-sm text-gray-500">
              Os pedidos serão registrados automaticamente nesta mesa
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <FiPrinter size={16} /> Imprimir
            </button>
            
            <button
              onClick={() => setMesaSelecionada(null)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Selected table view
  if (mesaSelecionada) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        
        {/* Header */}
        <header className="bg-indigo-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{mesaSelecionada.nome}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {mesaSelecionada.area}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FiUser size={14} />
                    {mesaSelecionada.capacidade} lugares
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMesaSelecionada(null);
                    setPainelAtivo('dashboard');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <FiChevronRight className="transform rotate-180" />
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="container mx-auto p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Menu */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-bold text-xl text-gray-800">Cardápio</h2>
                  
                  {/* Kitchen/Bar tabs */}
                  <div className="flex mt-3 border-b border-gray-200 -mb-px">
                    <button
                      onClick={() => setAbaCardapio('cozinha')}
                      className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
                        abaCardapio === 'cozinha'
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FaUtensils size={14} /> Cozinha
                    </button>
                    
                    <button
                      onClick={() => setAbaCardapio('bar')}
                      className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
                        abaCardapio === 'bar'
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FaGlassCheers size={14} /> Bar
                    </button>
                  </div>
                </div>
                
                {/* Subcategories */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {['todas', ...new Set(cardapio[abaCardapio].map(item => item.categoria))].map(categoria => (
                      <button
                        key={categoria}
                        onClick={() => setFiltro(categoria)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                          filtro === categoria
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {categoria === 'todas' ? 'Todos Itens' : categoria}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cardapio[abaCardapio]
                    .filter(item => filtro === 'todas' || item.categoria === filtro)
                    .map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{item.nome}</h3>
                            <p className="text-sm text-gray-500">{item.categoria}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Preparo: ~{item.tempoPreparo} min
                            </p>
                          </div>
                          <span className="font-bold text-indigo-600">R${item.preco.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => adicionarItem(item)}
                          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium"
                        >
                          Adicionar
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Consumption */}
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-xl text-gray-800">Consumo</h2>
                    <span className="bg-indigo-600 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {itensConsumo.length}
                    </span>
                  </div>
                </div>
                
                {/* Consumption items */}
                <div className="p-4 max-h-[400px] overflow-y-auto">
                  {itensConsumo.length === 0 ? (
                    <div className="text-center py-8">
                      <FiShoppingCart className="mx-auto text-gray-300 text-4xl mb-3" />
                      <p className="text-gray-500">Nenhum item consumido</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {itensConsumo.map(item => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800">{item.nome}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                {item.categoriaCardapio === 'cozinha' ? 'Cozinha' : 'Bar'}
                              </span>
                              <span className="text-xs text-gray-500">{item.hora}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <button 
                                onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="px-2 text-sm font-medium">{item.quantidade}</span>
                              <button 
                                onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                            <span className="font-semibold text-indigo-600 whitespace-nowrap">
                              R${(item.preco * item.quantidade).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removerItem(item.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Summary */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-800">
                        R${mesaSelecionada.consumo.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-700">Total:</span>
                      <span className="font-bold text-xl text-indigo-600">
                        R${mesaSelecionada.consumo.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={fecharMesa}
                    disabled={itensConsumo.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium ${
                      itensConsumo.length === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <FaReceipt className="inline mr-2" />
                    Fechar Conta (R${mesaSelecionada.consumo.toFixed(2)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Closing Modal */}
        <AnimatePresence>
          {mostrarModalPagamento && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                <div className="bg-indigo-600 text-white p-6">
                  <h2 className="text-xl font-bold">Resumo do Consumo</h2>
                  <p className="text-sm opacity-90">{mesaSelecionada.nome}</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-lg text-indigo-600">
                        R${mesaSelecionada.consumo.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium text-gray-700 mb-3">Itens Consumidos</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {itensConsumo.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantidade}x {item.nome}
                            </span>
                            <span className="font-medium">
                              R${(item.preco * item.quantidade).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMostrarModalPagamento(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium"
                    >
                      Voltar
                    </button>
                    
                    <button
                      onClick={confirmarFechamentoMesa}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium"
                    >
                      Confirmar Fechamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Admin panel
  if (painelAtivo !== 'mesas') {
    const mesasOcupadas = mesas.filter(mesa => mesa.status === 'ocupada');
    const totalVendas = mesasOcupadas.reduce((total, mesa) => total + mesa.consumo, 0);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        
        {/* Header */}
        <header className="bg-indigo-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    Sistema de Mesas
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPainelAtivo('mesas')}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <FaChair /> Mesas
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="container mx-auto px-4 pt-4">
          <div className="flex space-x-2 overflow-x-auto pb-3">
            {['dashboard', 'historico'].map(item => (
              <button
                key={item}
                onClick={() => setPainelAtivo(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  painelAtivo === item
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {item === 'dashboard' ? 'Dashboard' : 'Histórico'}
              </button>
            ))}
          </div>
        </div>

        {/* Panel content */}
        <div className="container mx-auto p-4">
          {painelAtivo === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Summary cards */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Mesas Ativas</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{mesasOcupadas.length}</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FaChair className="text-indigo-600 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Vendas Hoje</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-1">R${totalVendas.toFixed(2)}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <FiDollarSign className="text-emerald-600 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Média por Mesa</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      R${mesasOcupadas.length > 0 ? (totalVendas / mesasOcupadas.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FiPieChart className="text-purple-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {painelAtivo === 'historico' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-bold text-xl text-gray-800">Histórico de Atendimentos</h2>
                <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
              </div>
              
              <div className="p-4">
                <div className="text-center py-8">
                  <FiCalendar className="mx-auto text-gray-300 text-4xl mb-3" />
                  <p className="text-gray-500">Histórico em desenvolvimento</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Em breve você poderá acompanhar o histórico completo de atendimentos
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setPainelAtivo('mesas')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <FaChair /> Voltar para Mesas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main table view
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sistema de Mesas</h1>
            <p className="text-sm opacity-90">Controle de mesas em tempo real</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPainelAtivo('dashboard')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <FiPieChart size={16} />
              Painel
            </button>
            
            <button
              onClick={() => setMostrarModalMesa(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <FiPlus size={16} />
              Nova Mesa
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-3">
            {['todas', 'livres', 'ocupadas', 'Sala Interna', 'Esplanada'].map(filtroItem => (
              <button
                key={filtroItem}
                onClick={() => setFiltro(filtroItem)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  filtro === filtroItem
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filtroItem === 'todas' ? 'Todas Mesas' : 
                 filtroItem === 'livres' ? 'Mesas Livres' : 
                 filtroItem === 'ocupadas' ? 'Mesas Ocupadas' : filtroItem}
              </button>
            ))}
          </div>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mesasFiltradas.map(mesa => (
            <div 
              key={mesa.id}
              onClick={() => abrirMesa(mesa)}
              className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                mesa.status === 'livre' 
                  ? 'border-emerald-400' 
                  : 'border-rose-400'
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                      <FaChair className="text-indigo-600" />
                      <span>{mesa.nome}</span>
                    </h3>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                      mesa.area === 'Sala Interna' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {mesa.area}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      mesa.status === 'livre' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {mesa.status === 'ocupada' ? 'Ocupada' : 'Livre'}
                    </span>
                    <div className="flex items-center mt-3 text-sm text-gray-600">
                      <FiUser className="mr-2" size={14} />
                      {mesa.capacidade} lugares
                    </div>
                  </div>
                </div>
                
                {mesa.status === 'ocupada' && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-800">
                        Consumo:
                      </div>
                      <div className="font-bold text-indigo-600">
                        R${mesa.consumo.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <FiClock className="mr-2" size={14} />
                      {Math.floor((new Date() - new Date(mesa.horaAbertura)) / (1000 * 60))} min
                    </div>
                  </div>
                )}
              </div>
              
              {mesa.status === 'livre' ? (
                <div className="bg-emerald-50 p-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMesaSelecionada(mesa);
                    }}
                    className="text-sm font-medium text-emerald-700 flex items-center justify-center gap-2 w-full"
                  >
                    <FaQrcode size={16} /> QR Code
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50 p-4 text-center">
                  <span className="text-sm font-medium text-rose-700 flex items-center justify-center gap-2">
                    <FiEdit2 size={16} /> Ver Consumo
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New Table Modal */}
      <AnimatePresence>
        {mostrarModalMesa && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="bg-indigo-600 text-white p-6">
                <h2 className="text-xl font-bold">Adicionar Nova Mesa</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Nome da Mesa:</label>
                    <input
                      type="text"
                      value={novaMesa.nome}
                      onChange={(e) => setNovaMesa({...novaMesa, nome: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Mesa VIP 1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Área:</label>
                    <select
                      value={novaMesa.area}
                      onChange={(e) => setNovaMesa({...novaMesa, area: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Sala Interna">Sala Interna</option>
                      <option value="Esplanada">Esplanada</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Capacidade:</label>
                    <select
                      value={novaMesa.capacidade}
                      onChange={(e) => setNovaMesa({...novaMesa, capacidade: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {[2, 4, 6, 8, 10, 12].map(num => (
                        <option key={num} value={num}>{num} lugares</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setMostrarModalMesa(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={adicionarNovaMesa}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    Adicionar Mesa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MesaSystem;