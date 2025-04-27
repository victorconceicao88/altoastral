import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InterfaceCliente from './InterfaceCliente';
import InterfaceRestaurante from './InterfaceRestaurante';
import InterfaceEventos from './InterfaceEventos';
import AdminPanel from './AdminPanel';
import Login from './Login';
import RestrictedArea from './restricted';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InterfaceCliente />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mesas" element={<InterfaceRestaurante />} />
      <Route path="/eventos" element={<InterfaceEventos />} />
      <Route path="/admin" element={<AdminPanel />} />
      
      {/* Rota para área restrita */}
      <Route path="/restricted/*" element={<RestrictedArea />} />
      
      {/* Rota de fallback - deve ser a última */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
