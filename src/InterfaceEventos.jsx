import React, { useState } from 'react';
import { 
  FiMessageSquare, FiPhone, FiArrowRight, FiCheck,
  FiX, FiDownload, FiChevronRight, FiUser,FiGrid
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

const InterfaceEventos = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Gerar 50 mesas fixas
  const tables = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Mesa ${i + 1}`,
    qrCodeId: `qr-mesa-${i + 1}`
  }));

  // Mostrar notificação com animação
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Formatador de telefone para Portugal
  const formatPhone = (phone) => {
    return phone.replace(/\D/g, '');
  };

  // Enviar mensagem WhatsApp
  const sendWhatsApp = () => {
    if (!phoneNumber) {
      showNotification('Por favor, insira um número válido', 'error');
      return;
    }

    const formattedNumber = formatPhone(phoneNumber);
    const tableNum = selectedTable ? selectedTable.id : '';
    
    const message = `*Olá! Aqui está seu acesso ao cardápio digital* 🍽️\n\n` +
      `Clique no link abaixo para fazer seus pedidos:\n` +
      `${window.location.origin}?mesa=${tableNum}\n\n` +
      `*Restaurante Premium*\n` +
      `Agradecemos sua preferência!`;
    
    window.open(`https://wa.me/351${formattedNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    showNotification('Link enviado com sucesso!', 'success');
    setPhoneNumber('');
  };

  // Download QR Code individual
  const downloadQRCode = async (qrId) => {
    try {
      setIsLoading(true);
      const qrElement = document.getElementById(qrId);
      const canvas = await html2canvas(qrElement);
      canvas.toBlob((blob) => {
        saveAs(blob, `${qrId}.png`);
      });
      showNotification('QR Code baixado!');
    } catch (error) {
      showNotification('Erro ao baixar', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Download todos QR Codes
  const downloadAllQRCodes = async () => {
    try {
      setIsLoading(true);
      const zip = new JSZip();
      const qrFolder = zip.folder('qr-codes');
      
      for (const table of tables) {
        const qrElement = document.getElementById(table.qrCodeId);
        const canvas = await html2canvas(qrElement);
        canvas.toBlob((blob) => {
          qrFolder.file(`mesa-${table.id}.png`, blob);
        });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'qr-codes-mesas.zip');
      showNotification('Todos QR Codes baixados!');
    } catch (error) {
      showNotification('Erro ao baixar', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 p-4 md:p-8">
      {/* Notificação animada */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium ${
              notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          >
            <div className="flex items-center">
              <FiCheck className="mr-2" />
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Sistema de Pedidos Premium
          </h1>
          <p className="text-gray-600">
            Experiência digital exclusiva para seus clientes
          </p>
        </motion.div>

        {/* Abas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex bg-white rounded-xl shadow-sm p-1 mb-8 max-w-md mx-auto"
        >
          <button
            className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all flex items-center justify-center ${
              activeTab === 'whatsapp' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <FiMessageSquare className="mr-2" />
            WhatsApp
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all flex items-center justify-center ${
              activeTab === 'qrcodes' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('qrcodes')}
          >
            <FiGrid className="mr-2" />
            QR Codes
          </button>
        </motion.div>

        {activeTab === 'whatsapp' ? (
          /* Aba WhatsApp */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageSquare className="text-emerald-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Enviar Acesso via WhatsApp
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Envie um link direto para o cliente fazer pedidos
                </p>
              </div>

              <div className="max-w-sm mx-auto">
                {/* Seleção de Mesa */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Selecione a Mesa
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTable?.id || ''}
                      onChange={(e) => {
                        const table = tables.find(t => t.id === parseInt(e.target.value));
                        setSelectedTable(table || null);
                      }}
                      className="w-full p-4 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                    >
                      <option value="">Selecione...</option>
                      {tables.map(table => (
                        <option key={table.id} value={table.id}>
                          {table.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronRight className="text-gray-400 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Campo de Telefone */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-2">
                    Número do Cliente (Portugal)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                    <span className="px-4 py-4 bg-gray-100 text-gray-700">
                      +351
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 p-4 focus:outline-none"
                      placeholder="9XXXXXXXX"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Exemplo: 912345678
                  </p>
                </div>

                {/* Botão Enviar */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendWhatsApp}
                  disabled={!phoneNumber || !selectedTable}
                  className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 ${
                    !phoneNumber || !selectedTable
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg'
                  }`}
                >
                  <FiMessageSquare size={20} />
                  <span>Enviar para WhatsApp</span>
                  <FiArrowRight />
                </motion.button>

                {/* Divisor */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-4 text-gray-400">ou</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Mostrar QR Code */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowQRCodeModal(true)}
                  disabled={!selectedTable}
                  className={`w-full py-3 px-6 border-2 rounded-xl font-medium flex items-center justify-center space-x-2 ${
                    !selectedTable
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-indigo-500 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <FiGrid size={18} />
                  <span>Mostrar QR Code</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Aba QR Codes */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiGrid className="text-indigo-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  QR Codes Personalizados
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Cada mesa possui um QR Code único para acesso direto
                </p>
              </div>

              {/* Seleção de Mesa */}
              <div className="mb-8 max-w-sm mx-auto">
                <label className="block text-gray-700 font-medium mb-2">
                  Selecione a Mesa
                </label>
                <div className="relative">
                  <select
                    value={selectedTable?.id || ''}
                    onChange={(e) => {
                      const table = tables.find(t => t.id === parseInt(e.target.value));
                      setSelectedTable(table || null);
                    }}
                    className="w-full p-4 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                  >
                    <option value="">Selecione uma mesa...</option>
                    {tables.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronRight className="text-gray-400 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Visualização do QR Code */}
              {selectedTable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center mb-8"
                >
                  <div 
                    id={selectedTable.qrCodeId}
                    className="p-4 bg-white border-2 border-indigo-100 rounded-xl shadow-sm mb-4"
                  >
                    <QRCodeSVG 
                      value={`${window.location.origin}?mesa=${selectedTable.id}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                      fgColor="#4f46e5"
                    />
                  </div>
                  <p className="text-center text-gray-600 mb-6">
                    {selectedTable.name}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadQRCode(selectedTable.qrCodeId)}
                    disabled={isLoading}
                    className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl transition-all disabled:opacity-70"
                  >
                    <FiDownload className="mr-2" />
                    {isLoading ? 'Baixando...' : 'Baixar QR Code'}
                  </motion.button>
                </motion.div>
              )}

              {/* Download Todos */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadAllQRCodes}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 py-3 px-6 rounded-xl transition-all disabled:opacity-70"
                >
                  <FiDownload className="mr-2" />
                  {isLoading ? 'Preparando...' : 'Baixar Todos (ZIP)'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Modal QR Code */}
        <AnimatePresence>
          {showQRCodeModal && selectedTable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative"
              >
                <button
                  onClick={() => setShowQRCodeModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                >
                  <FiX size={24} />
                </button>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  QR Code da {selectedTable.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  O cliente pode escanear para acessar o cardápio
                </p>

                <div className="p-4 bg-white border-2 border-indigo-100 rounded-xl inline-block mb-6">
                  <QRCodeSVG 
                    value={`${window.location.origin}?mesa=${selectedTable.id}`}
                    size={180}
                    level="H"
                    includeMargin={false}
                    fgColor="#4f46e5"
                  />
                </div>

                <div className="flex justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      downloadQRCode(selectedTable.qrCodeId);
                      setShowQRCodeModal(false);
                    }}
                    className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl transition-all"
                  >
                    <FiDownload className="mr-2" />
                    Baixar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterfaceEventos;