import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InterfaceCliente from './InterfaceCliente';
import AdminPanel from './AdminPanel';
import Login from './Login';
import RestrictedArea from './restricted';
import QRCodeGenerator from './QRCodeGenerator'; // Importe o componente QRCodeGenerator

function App() {
  return (
    <Routes>
      <Route path="/" element={<InterfaceCliente />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPanel />} />
      
      {/* Nova rota para o gerador de QR Codes */}
      <Route path="/qrcodes" element={<QRCodeGenerator />} />
      
      {/* Rota para área restrita */}
      <Route path="/restricted/dashboard" element={<RestrictedArea />} />
   
      {/* Rota de fallback - deve ser a última */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;