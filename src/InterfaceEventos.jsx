import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMessageSquare, FiPhone, FiArrowRight, FiCheck, FiX, 
  FiDownload, FiChevronRight, FiShare2, FiImage,
  FiPrinter, FiGrid, FiSettings,FiMail
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence, useTransform, useViewportScroll } from 'framer-motion';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import emailjs from 'emailjs-com';

const PremiumQRInterface = () => {
  // Estados principais
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('PT');
  const [showClientForm, setShowClientForm] = useState(false);
  const [restaurantConfig, setRestaurantConfig] = useState({
    name: 'Restaurante Premium',
    logo: '',
    primaryColor: '#4f46e5',
    secondaryColor: '#10b981',
    whatsappMessage: 'Olá! Aqui está seu acesso ao cardápio digital 🍽️\n\nClique no link abaixo para fazer seus pedidos:\n{link}\n\n{restaurantName}\nAgradecemos sua preferência!',
    emailSubject: 'Acesso ao Cardápio Digital - {restaurantName}',
    emailMessage: 'Prezado cliente,\n\nAqui está seu acesso exclusivo ao nosso cardápio digital. Basta escanear o QR Code abaixo ou clicar no link:\n\n{link}\n\nAgradecemos sua preferência!\n\n{restaurantName}'
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isHoveringShare, setIsHoveringShare] = useState(false);
  const qrRefs = useRef({});
  const containerRef = useRef();
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Efeito de partículas 3D (simulado com divs animadas)
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  // Países europeus com códigos e prefixos
  const europeanCountries = [
    { code: 'PT', name: 'Portugal', prefix: '351', example: '912345678' },
    { code: 'ES', name: 'Espanha', prefix: '34', example: '612345678' },
    { code: 'FR', name: 'França', prefix: '33', example: '612345678' },
    { code: 'IT', name: 'Itália', prefix: '39', example: '3123456789' },
    { code: 'DE', name: 'Alemanha', prefix: '49', example: '15123456789' },
    { code: 'NL', name: 'Holanda', prefix: '31', example: '612345678' },
    { code: 'BE', name: 'Bélgica', prefix: '32', example: '471234567' },
    { code: 'UK', name: 'Reino Unido', prefix: '44', example: '7123456789' },
    { code: 'IE', name: 'Irlanda', prefix: '353', example: '831234567' },
    { code: 'CH', name: 'Suíça', prefix: '41', example: '781234567' },
    { code: 'AT', name: 'Áustria', prefix: '43', example: '6641234567' },
  ];

  // Gerar 50 mesas fixas
  const tables = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Mesa ${i + 1}`,
    qrCodeId: `qr-mesa-${i + 1}`,
  }));

  // Mostrar notificação com animação
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Validar e-mail
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Formatador de telefone
  const formatPhone = (phone) => {
    return phone.replace(/\D/g, '');
  };

  // Obter país selecionado
  const getSelectedCountry = () => {
    return europeanCountries.find(c => c.code === selectedCountry) || europeanCountries[0];
  };

  // Gerar link da mesa
  const generateTableLink = (tableId) => {
    return `${window.location.origin}?mesa=${tableId}`;
  };

  // Enviar mensagem WhatsApp
  const sendWhatsApp = async (sendAsImage = false) => {
    if (!phoneNumber) {
      showNotification('Por favor, insira um número válido', 'error');
      return;
    }

    const formattedNumber = formatPhone(phoneNumber);
    const tableNum = selectedTable ? selectedTable.id : '';
    const country = getSelectedCountry();
    
    let message = restaurantConfig.whatsappMessage
      .replace('{link}', generateTableLink(tableNum))
      .replace('{restaurantName}', restaurantConfig.name);
    
    if (sendAsImage) {
      try {
        setIsLoading(true);
        const qrElement = document.getElementById(selectedTable.qrCodeId);
        const canvas = await html2canvas(qrElement);
        const image = canvas.toDataURL('image/png');
        
        // Em produção, você precisaria enviar a imagem para um servidor primeiro
        // Esta é uma solução simplificada que usa o WhatsApp Web
        message += `\n\n![QR Code](${image})`;
      } catch (error) {
        showNotification('Erro ao gerar imagem do QR Code', 'error');
        setIsLoading(false);
        return;
      }
    }
    
    window.open(`https://wa.me/${country.prefix}${formattedNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    showNotification('Link enviado com sucesso!', 'success');
    setPhoneNumber('');
    setIsLoading(false);
  };

  // Enviar e-mail com QR Code
  const sendEmail = async () => {
    if (!email || !validateEmail(email)) {
      showNotification('Por favor, insira um e-mail válido', 'error');
      return;
    }

    if (!selectedTable) {
      showNotification('Por favor, selecione uma mesa', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      // Gerar imagem do QR Code
      const qrElement = document.getElementById(selectedTable.qrCodeId);
      const canvas = await html2canvas(qrElement);
      const image = canvas.toDataURL('image/png');
      
      // Configurar parâmetros do e-mail
      const templateParams = {
        to_email: email,
        from_name: restaurantConfig.name,
        subject: restaurantConfig.emailSubject.replace('{restaurantName}', restaurantConfig.name),
        message: restaurantConfig.emailMessage
          .replace('{link}', generateTableLink(selectedTable.id))
          .replace('{restaurantName}', restaurantConfig.name),
        qr_code: image,
        table_number: selectedTable.id
      };

      // Enviar e-mail usando EmailJS (você precisa configurar seu serviço)
      await emailjs.send(
        'service_your_service_id',
        'template_your_template_id',
        templateParams,
        'user_your_user_id'
      );
      
      showNotification('E-mail enviado com sucesso!', 'success');
      setEmail('');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      showNotification('Erro ao enviar e-mail', 'error');
    } finally {
      setIsLoading(false);
    }
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
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        qrFolder.file(`mesa-${table.id}.png`, blob);
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

  // Imprimir QR Code
  const printQRCode = (qrId) => {
    const qrElement = document.getElementById(qrId);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir QR Code</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .qr-container { text-align: center; }
            .qr-title { font-size: 18px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-title">${selectedTable.name}</div>
            ${qrElement.outerHTML}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Efeito de partículas flutuantes
  useEffect(() => {
    // Inicializar refs para QR Codes
    tables.forEach(table => {
      qrRefs.current[table.qrCodeId] = React.createRef();
    });
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 overflow-x-hidden"
      ref={containerRef}
    >
      {/* Efeito de partículas 3D */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [particle.y, particle.y + 10, particle.y + 20],
              x: [particle.x, particle.x + (Math.random() * 10 - 5), particle.x + (Math.random() * 10 - 5)]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
              background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(79,70,229,0) 70%)`,
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabeçalho Premium */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="flex justify-between items-center mb-16 pt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mr-4">
              <FiGrid className="text-white text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              {restaurantConfig.name}
            </h1>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowConfigModal(true)}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl transition-all"
            title="Configurações"
          >
            <FiSettings className="text-white" />
          </motion.button>
        </motion.div>

        {/* Conteúdo Principal */}
        <motion.div
          style={{ scale }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden mb-16 border border-gray-700"
        >
          <div className="p-8 md:p-12">
            {/* Título com animação */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <FiGrid className="text-white text-4xl" />
                </div>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-4">
                QR Codes Premium
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Gere e compartilhe QR Codes exclusivos para cada mesa do seu restaurante
              </p>
            </motion.div>

            {/* Grade de Mesas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {tables.map((table) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.1 + (table.id * 0.02),
                    type: 'spring',
                    stiffness: 200
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.05,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTable(table)}
                  className={`bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 cursor-pointer transition-all border-2 ${
                    selectedTable?.id === table.id 
                      ? 'border-indigo-500 shadow-lg' 
                      : 'border-gray-600 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-white">
                      {table.name}
                    </h3>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadQRCode(table.qrCodeId);
                        }}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <FiDownload size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTable(table);
                          setShowQRCodeModal(true);
                        }}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <FiShare2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div 
                    id={table.qrCodeId}
                    className="p-2 bg-white rounded-lg mx-auto"
                  >
                    <QRCodeSVG 
                      value={generateTableLink(table.id)}
                      size={120}
                      level="H"
                      includeMargin={false}
                      fgColor={restaurantConfig.primaryColor}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Painel de Controle */}
            {selectedTable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 md:p-8 border border-gray-600 shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Visualização do QR Code */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div 
                      id={selectedTable.qrCodeId}
                      className="p-4 bg-white rounded-xl shadow-lg mb-6 border-2 border-indigo-100"
                    >
                      <QRCodeSVG 
                        value={generateTableLink(selectedTable.id)}
                        size={200}
                        level="H"
                        includeMargin={true}
                        fgColor={restaurantConfig.primaryColor}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {selectedTable.name}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Link: {generateTableLink(selectedTable.id)}
                    </p>
                  </motion.div>

                  {/* Opções de Compartilhamento */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Compartilhar QR Code
                    </h3>
                    
                    {/* Abas de envio */}
                    <div className="flex bg-gray-900 rounded-xl shadow-sm p-1 mb-6">
                      <button
                        className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all flex items-center justify-center ${
                          !showClientForm 
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={() => setShowClientForm(false)}
                      >
                        <FiMessageSquare className="mr-2" />
                        WhatsApp
                      </button>
                      <button
                        className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all flex items-center justify-center ${
                          showClientForm 
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={() => setShowClientForm(true)}
                      >
                        <FiMail className="mr-2" />
                        E-mail
                      </button>
                    </div>

                    {!showClientForm ? (
                      /* Formulário WhatsApp */
                      <>
                        {/* Seleção de País */}
                        <div className="mb-6">
                          <label className="block text-gray-300 font-medium mb-2">
                            País do Número
                          </label>
                          <div className="relative">
                            <select
                              value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value)}
                              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10 text-white"
                            >
                              {europeanCountries.map(country => (
                                <option key={country.code} value={country.code} className="bg-gray-800">
                                  {country.name} (+{country.prefix})
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <FiChevronRight className="text-gray-400 rotate-90" />
                            </div>
                          </div>
                        </div>

                        {/* Campo de Telefone */}
                        <div className="mb-6">
                          <label className="block text-gray-300 font-medium mb-2">
                            Número do Cliente
                          </label>
                          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                            <span className="px-4 py-4 bg-gray-700 text-gray-300">
                              +{getSelectedCountry().prefix}
                            </span>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="flex-1 p-4 bg-gray-800 text-white focus:outline-none"
                              placeholder={getSelectedCountry().example}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Exemplo: {getSelectedCountry().example}
                          </p>
                        </div>

                        {/* Botões de envio WhatsApp */}
                        <div className="space-y-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => sendWhatsApp(false)}
                            disabled={!phoneNumber || !selectedTable}
                            className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 ${
                              !phoneNumber || !selectedTable
                                ? 'bg-gray-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg'
                            }`}
                          >
                            <FiMessageSquare size={18} />
                            <span>Enviar Link</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => sendWhatsApp(true)}
                            disabled={!phoneNumber || !selectedTable || isLoading}
                            className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 ${
                              !phoneNumber || !selectedTable || isLoading
                                ? 'bg-gray-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                            }`}
                          >
                            <FiImage size={18} />
                            <span>{isLoading ? 'Enviando...' : 'Enviar QR Code'}</span>
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      /* Formulário E-mail */
                      <>
                        <div className="mb-6">
                          <label className="block text-gray-300 font-medium mb-2">
                            E-mail do Cliente
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white"
                            placeholder="cliente@exemplo.com"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={sendEmail}
                          disabled={!email || !selectedTable || isLoading}
                          className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 ${
                            !email || !selectedTable || isLoading
                              ? 'bg-gray-700 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg'
                          }`}
                        >
                          <FiMail size={18} />
                          <span>{isLoading ? 'Enviando...' : 'Enviar E-mail'}</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Ações do QR Code */}
                <div className="mt-8 pt-6 border-t border-gray-700 flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadQRCode(selectedTable.qrCodeId)}
                    disabled={isLoading}
                    className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-70"
                  >
                    <FiDownload className="mr-2" />
                    Baixar QR Code
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => printQRCode(selectedTable.qrCodeId)}
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    <FiPrinter className="mr-2" />
                    Imprimir
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setIsHoveringShare(true)}
                    onHoverEnd={() => setIsHoveringShare(false)}
                    onClick={() => setShowQRCodeModal(true)}
                    className="flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all relative overflow-hidden"
                  >
                    <motion.span
                      animate={{ 
                        x: isHoveringShare ? [0, 5, 0] : 0,
                        transition: { repeat: isHoveringShare ? Infinity : 0, duration: 1.5 }
                      }}
                      className="flex items-center"
                    >
                      <FiShare2 className="mr-2" />
                      Compartilhar
                    </motion.span>
                    {isHoveringShare && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1.5, 2] }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-white rounded-full"
                        style={{ mixBlendMode: 'overlay' }}
                      />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Download Todos */}
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadAllQRCodes}
                disabled={isLoading}
                className="inline-flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl border border-gray-600 shadow-lg transition-all disabled:opacity-70"
              >
                <FiDownload className="mr-2" />
                {isLoading ? 'Preparando...' : 'Baixar Todos os QR Codes (ZIP)'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal QR Code */}
      <AnimatePresence>
        {showQRCodeModal && selectedTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-sm w-full text-center relative border border-gray-700 shadow-2xl"
            >
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowQRCodeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
              >
                <FiX size={24} />
              </motion.button>

              <motion.h3 
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                QR Code da {selectedTable.name}
              </motion.h3>
              
              <motion.p 
                className="text-gray-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                O cliente pode escanear para acessar o cardápio digital
              </motion.p>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="p-4 bg-white rounded-xl inline-block mb-8 border-2 border-indigo-100 shadow-lg"
              >
                <QRCodeSVG 
                  value={generateTableLink(selectedTable.id)}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor={restaurantConfig.primaryColor}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    downloadQRCode(selectedTable.qrCodeId);
                    setShowQRCodeModal(false);
                  }}
                  className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  <FiDownload className="mr-2" />
                  Baixar QR Code
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowQRCodeModal(false);
                    setShowClientForm(false);
                  }}
                  className="flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  <FiShare2 className="mr-2" />
                  Compartilhar via WhatsApp
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Configurações */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
            >
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
              >
                <FiX size={24} />
              </motion.button>

              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-6">
                Configurações Premium
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Nome do Restaurante
                  </label>
                  <input
                    type="text"
                    value={restaurantConfig.name}
                    onChange={(e) => setRestaurantConfig({...restaurantConfig, name: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white"
                    placeholder="Nome do restaurante"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Cor Primária
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={restaurantConfig.primaryColor}
                        onChange={(e) => setRestaurantConfig({...restaurantConfig, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded cursor-pointer bg-gray-800 border border-gray-700"
                      />
                      <span className="ml-3 text-gray-400">{restaurantConfig.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Cor Secundária
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={restaurantConfig.secondaryColor}
                        onChange={(e) => setRestaurantConfig({...restaurantConfig, secondaryColor: e.target.value})}
                        className="w-12 h-12 rounded cursor-pointer bg-gray-800 border border-gray-700"
                      />
                      <span className="ml-3 text-gray-400">{restaurantConfig.secondaryColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Mensagem do WhatsApp
                  </label>
                  <textarea
                    value={restaurantConfig.whatsappMessage}
                    onChange={(e) => setRestaurantConfig({...restaurantConfig, whatsappMessage: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-32 text-white"
                    placeholder="Mensagem padrão para WhatsApp"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use <code className="bg-gray-700 px-1 py-0.5 rounded">{'{link}'}</code> para o link da mesa e <code className="bg-gray-700 px-1 py-0.5 rounded">{'{restaurantName}'}</code> para o nome do restaurante
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Assunto do E-mail
                  </label>
                  <input
                    type="text"
                    value={restaurantConfig.emailSubject}
                    onChange={(e) => setRestaurantConfig({...restaurantConfig, emailSubject: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white"
                    placeholder="Assunto do e-mail"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Mensagem do E-mail
                  </label>
                  <textarea
                    value={restaurantConfig.emailMessage}
                    onChange={(e) => setRestaurantConfig({...restaurantConfig, emailMessage: e.target.value})}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-32 text-white"
                    placeholder="Mensagem padrão para e-mail"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use <code className="bg-gray-700 px-1 py-0.5 rounded">{'{link}'}</code> para o link da mesa e <code className="bg-gray-700 px-1 py-0.5 rounded">{'{restaurantName}'}</code> para o nome do restaurante
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfigModal(false)}
                    className="px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
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

export default PremiumQRInterface;