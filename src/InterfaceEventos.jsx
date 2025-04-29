import React, { useState, useEffect } from 'react';
import { FiUser, FiPlus, FiTrash2, FiUsers, FiGrid, FiArrowLeft, FiDownload, FiChevronRight } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';


const InterfaceEventos = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('Meu Evento Premium');
  const [guests, setGuests] = useState([]);
  const [currentGuest, setCurrentGuest] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState('mesas');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Generate 50 unique QR Codes for tables
  const generateQRCodes = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: `qr-${i + 1}`,
      tableNumber: i + 1,
      url: `${window.location.origin}/order?table=${i + 1}&event=${encodeURIComponent(eventName)}`
    }));
  };

  const qrCodes = generateQRCodes();

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Add guest
  const addGuest = () => {
    if (currentGuest.trim()) {
      setGuests([...guests, { id: Date.now(), name: currentGuest }]);
      setCurrentGuest('');
      showNotification('Convidado adicionado com sucesso!');
    }
  };

  // Remove guest
  const removeGuest = (id) => {
    setGuests(guests.filter(guest => guest.id !== id));
    showNotification('Convidado removido!', 'info');
  };

  // Create table
  const createTable = () => {
    if (guests.length > 0) {
      const newTable = {
        id: Date.now(),
        name: `Mesa ${tables.length + 1}`,
        guests: [...guests],
        qrCodeId: `qr-${tables.length + 1}`
      };
      setTables([...tables, newTable]);
      setGuests([]);
      showNotification(`Mesa ${tables.length + 1} criada com sucesso!`);
    }
  };

  // Open table details
  const openTable = (table) => {
    setSelectedTable(table);
  };

  // Close table details
  const closeTable = () => {
    setSelectedTable(null);
  };

  // Back to dashboard
  const handleBackToDashboard = () => {
    navigate('/restricted');
  };

  // Download single QR Code
  const downloadQRCode = async (qrId) => {
    try {
      setIsLoading(true);
      const qrElement = document.getElementById(qrId);
      const canvas = await html2canvas(qrElement);
      canvas.toBlob((blob) => {
        saveAs(blob, `qr-mesa-${qrId.split('-')[1]}.png`);
      });
      showNotification(`QR Code da ${qrId.replace('-', ' ')} baixado!`);
    } catch (error) {
      showNotification('Erro ao baixar QR Code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Download all QR Codes
  const downloadAllQRCodes = async () => {
    try {
      setIsLoading(true);
      const zip = new JSZip();
      const qrFolder = zip.folder('qr-codes');
      
      for (const qr of qrCodes) {
        const qrElement = document.getElementById(qr.id);
        const canvas = await html2canvas(qrElement);
        canvas.toBlob((blob) => {
          qrFolder.file(`mesa-${qr.tableNumber}.png`, blob);
        });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'todos-qr-codes.zip');
      showNotification('Todos QR Codes baixados com sucesso!');
    } catch (error) {
      showNotification('Erro ao baixar QR Codes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add sample data for demonstration
  useEffect(() => {
    if (tables.length === 0 && guests.length === 0) {
      setGuests([
        { id: 1, name: 'Ana Silva' },
        { id: 2, name: 'Carlos Oliveira' },
        { id: 3, name: 'Mariana Santos' }
      ]);
    }
  }, []);

  if (selectedTable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
            notification.type === 'error' ? 'bg-red-500' : 
            notification.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
          }`}>
            {notification.message}
          </div>
        )}
        
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{selectedTable.name}</h2>
                <p className="text-indigo-100 opacity-90">{eventName}</p>
              </div>
              <button 
                onClick={closeTable}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all backdrop-blur-sm"
              >
                <FiArrowLeft className="text-white" />
                <span>Voltar</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Guests */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <FiUsers className="text-indigo-600" />
                  </span>
                  Convidados nesta mesa
                </h3>
                <div className="space-y-3 mb-6">
                  {selectedTable.guests.length > 0 ? (
                    selectedTable.guests.map(guest => (
                      <div key={guest.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mr-3">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-800">{guest.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">Nenhum convidado nesta mesa</p>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <FiGrid className="text-indigo-600" />
                  </span>
                  QR Code da Mesa
                </h3>
                <div className="flex flex-col items-center">
                  <div className="p-5 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm mb-6">
                    <QRCodeSVG 
                      value={`${window.location.origin}/order?table=${selectedTable.name.replace('Mesa ', '')}&event=${encodeURIComponent(eventName)}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                      fgColor="#4f46e5"
                    />
                  </div>
                  <p className="text-center text-gray-600 mb-6">
                    Os clientes podem escanear este código para fazer pedidos diretamente
                  </p>
                  <button 
                    onClick={() => downloadQRCode(selectedTable.qrCodeId)}
                    disabled={isLoading}
                    className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl transition-all disabled:opacity-70"
                  >
                    <FiDownload className="mr-2" />
                    {isLoading ? 'Baixando...' : 'Baixar QR Code'}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <button className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl transition-all">
                <FiPlus />
                <span>Adicionar Pedido</span>
                <FiChevronRight />
              </button>
              <button className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl transition-all">
                <span>Fechar Conta</span>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
          notification.type === 'error' ? 'bg-red-500' : 
          notification.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gestão de Eventos</h1>
            <p className="text-gray-600 mt-1">Sistema premium para gerenciamento completo</p>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all shadow-md"
          >
            <FiGrid />
            <span>Voltar para Dashboard</span>
            <FiChevronRight />
          </button>
        </div>
        
        {/* Event Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FiGrid className="text-indigo-600" />
            </span>
            Configurações do Evento
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">Nome do Evento</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Ex: Aniversário Premium"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => showNotification('Configurações salvas!')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all shadow-md"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all ${
                activeTab === 'mesas' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mesas')}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiUsers />
                <span>Mesas e Convidados</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all ${
                activeTab === 'qrcodes' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('qrcodes')}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiGrid />
                <span>QR Codes</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'mesas' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Guests */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FiUser className="text-indigo-600" />
                </span>
                Adicionar Convidados
              </h2>
              <div className="flex mb-6 shadow-sm">
                <input
                  type="text"
                  value={currentGuest}
                  onChange={(e) => setCurrentGuest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGuest()}
                  className="flex-1 p-4 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Nome do convidado"
                />
                <button
                  onClick={addGuest}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 rounded-r-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <FiPlus size={22} />
                </button>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto pr-2">
                {guests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiUser className="text-gray-400" size={28} />
                    </div>
                    <p className="text-gray-500 text-lg">Nenhum convidado adicionado</p>
                    <p className="text-gray-400 mt-1">Adicione nomes para começar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guests.map(guest => (
                      <div key={guest.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mr-3">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-800">{guest.name}</span>
                        </div>
                        <button
                          onClick={() => removeGuest(guest.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={createTable}
                disabled={guests.length === 0}
                className={`mt-6 w-full py-4 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                  guests.length > 0 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FiUsers size={20} />
                <span>Criar Mesa com {guests.length} Convidado{guests.length !== 1 ? 's' : ''}</span>
                <FiChevronRight />
              </button>
            </div>

            {/* Tables */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FiGrid className="text-indigo-600" />
                </span>
                Mesas do Evento
              </h2>
              {tables.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiUsers className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-500 text-lg">Nenhuma mesa criada</p>
                  <p className="text-gray-400 mt-1">Adicione convidados e crie sua primeira mesa</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {tables.map(table => (
                    <div 
                      key={table.id} 
                      onClick={() => openTable(table)}
                      className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-indigo-700 group-hover:text-indigo-800">{table.name}</h3>
                        <span className="flex items-center text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
                          <FiUsers className="mr-1" />
                          {table.guests.length}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2"></div>
                        Mesa ativa
                      </div>
                      <div className="mt-2 flex justify-end">
                        <span className="text-xs text-indigo-500 flex items-center">
                          Ver detalhes <FiChevronRight className="ml-1" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* QR Codes Tab */
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <FiGrid className="text-indigo-600" />
              </span>
              QR Codes para Pedidos
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 max-w-3xl">
                Cada QR Code abaixo é único para uma mesa específica. Quando escaneado, levará os clientes diretamente à página de pedidos daquela mesa. 
                Você pode baixar individualmente ou todos de uma vez.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {qrCodes.map(qr => (
                <div key={qr.id} className="flex flex-col items-center">
                  <div 
                    id={qr.id}
                    className="p-3 bg-white border-2 border-gray-100 rounded-xl mb-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <QRCodeSVG 
                      value={qr.url}
                      size={120}
                      level="H"
                      includeMargin={false}
                      fgColor="#4f46e5"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Mesa {qr.tableNumber}</span>
                  <button 
                    onClick={() => downloadQRCode(qr.id)}
                    disabled={isLoading}
                    className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <FiDownload className="mr-1" />
                    {isLoading ? 'Baixando...' : 'Baixar'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button 
                onClick={downloadAllQRCodes}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-70"
              >
                <FiDownload />
                <span>{isLoading ? 'Preparando arquivo...' : 'Baixar Todos os QR Codes (ZIP)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterfaceEventos;