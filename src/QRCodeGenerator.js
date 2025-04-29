import React, { useState, useEffect } from 'react';
import { FiPrinter, FiCopy, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from './assets/logo-alto-astral.png';

const QRCodeGenerator = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Obter a URL base do site
    const url = window.location.origin;
    setBaseUrl(url);
    
    // Gerar URLs únicas para cada mesa (16 mesas internas + 8 na esplanada)
    const codes = Array.from({ length: 24 }, (_, i) => ({
      tableNumber: i + 1,
      area: i < 16 ? 'Interna' : 'Esplanada',
      url: `${url}?table=${i + 1}`,
      qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(`${url}?table=${i + 1}`)}`
    }));
    
    setQrCodes(codes);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copiada para a área de transferência!');
  };

  const printQRCodes = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="flex items-center text-astral hover:text-astral-dark">
            <FiArrowLeft className="mr-2" /> Voltar
          </Link>
          <div className="flex items-center">
            <img src={logo} alt="Alto Astral" className="h-10 mr-3" />
            <h1 className="text-2xl font-bold">QR Codes para Mesas</h1>
          </div>
          <button 
            onClick={printQRCodes}
            className="flex items-center bg-astral text-white px-4 py-2 rounded-lg hover:bg-astral-dark"
          >
            <FiPrinter className="mr-2" /> Imprimir Todos
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Instruções</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Imprima os QR codes abaixo</li>
            <li>Cole cada QR code na mesa correspondente</li>
            <li>Os clientes podem escanear para acessar o cardápio digital</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {qrCodes.map((code) => (
            <div key={code.tableNumber} className="bg-white p-4 rounded-xl shadow-md text-center border border-gray-200">
              <div className="font-bold text-lg mb-2">
                Mesa {code.tableNumber} <span className="text-sm font-normal">({code.area})</span>
              </div>
              <img 
                src={code.qrImage} 
                alt={`QR Code Mesa ${code.tableNumber}`} 
                className="w-full h-auto mx-auto mb-3 border border-gray-200"
              />
              <div className="text-xs text-gray-500 mb-3 overflow-hidden overflow-ellipsis">
                {code.url}
              </div>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(code.url)}
                  className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                >
                  <FiCopy className="mr-1" /> Copiar
                </button>
                <button 
                  onClick={() => window.open(code.url, '_blank')}
                  className="flex items-center text-sm bg-astral/10 hover:bg-astral/20 text-astral px-3 py-1 rounded"
                >
                  Testar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;