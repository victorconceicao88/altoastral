import React, { useState, useEffect } from 'react';
import { FiPrinter, FiCopy, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from './assets/logo-alto-astral.png';

const QRCodeGenerator = () => {
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    const baseUrl = window.location.origin;
    const codes = Array.from({ length: 16 }, (_, i) => {
      const tableNumber = i + 1;
      const mesaUrl = `${baseUrl}/cardapio?table=${tableNumber}&orderType=dine-in&source=qr`;
      return {
        tableNumber,
        area: i < 8 ? 'Área Interna' : 'Área Externa',
        url: mesaUrl,
        qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(mesaUrl)}`
      };
    });
    setQrCodes(codes);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copiada para a área de transferência!');
  };

  const printQRCodes = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Comandas QR Code - Alto Astral</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #fff;
              padding: 20px;
              margin: 0;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .header img {
              height: 70px;
              margin-bottom: 10px;
            }
            .header h1 {
              font-size: 28px;
              color: #111;
              margin: 0;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 25px;
            }
            .card {
              border: 2px solid #222;
              border-radius: 12px;
              padding: 16px;
              background-color: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: 0 3px 8px rgba(0,0,0,0.1);
            }
            .mesa-numero {
              font-size: 34px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 6px;
            }
            .area {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            .qr-img {
              max-width: 200px;
              margin-bottom: 12px;
            }
            .url {
              font-size: 10px;
              word-break: break-all;
              color: #888;
              text-align: center;
            }
            @media print {
              .grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
              .card { page-break-inside: avoid; break-inside: avoid; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logo}" alt="Alto Astral" />
            <h1>Comandas QR Code - Alto Astral</h1>
          </div>
          <div class="grid">
            ${qrCodes.map(code => `
              <div class="card">
                <div class="mesa-numero">MESA ${code.tableNumber}</div>
                <div class="area">${code.area}</div>
                <img class="qr-img" src="${code.qrImage}" alt="QR Mesa ${code.tableNumber}" />
                <div class="url">${code.url}</div>
              </div>
            `).join('')}
          </div>
          <script>window.onload = () => setTimeout(() => { window.print(); window.close(); }, 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 no-print">
          <Link to="/admin" className="flex items-center text-blue-600 hover:underline">
            <FiArrowLeft className="mr-2" /> Voltar
          </Link>
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-10" />
            <h1 className="text-3xl font-bold text-gray-800">Painel de Comandas QR Code</h1>
          </div>
          <button onClick={printQRCodes} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700">
            <FiPrinter className="mr-2" /> Imprimir Tudo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 no-print">
          {qrCodes.map((code) => (
            <div key={code.tableNumber} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center transition-transform hover:scale-105">
              <div className="text-3xl font-extrabold text-blue-700 mb-2">MESA {code.tableNumber}</div>
              <div className="text-sm text-gray-600 mb-3 font-medium">{code.area}</div>
              <img src={code.qrImage} alt={`QR Code Mesa ${code.tableNumber}`} className="w-full max-w-xs mx-auto mb-4 border border-gray-300 rounded-md" />
              <div className="text-xs text-gray-400 truncate">{code.url}</div>
              <div className="flex justify-center mt-4 space-x-3">
                <button onClick={() => copyToClipboard(code.url)} className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
                  <FiCopy className="mr-1" /> Copiar
                </button>
                <button onClick={() => window.open(code.url, '_blank')} className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded">
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
