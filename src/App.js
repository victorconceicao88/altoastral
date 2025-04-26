import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InterfaceCliente from './InterfaceCliente';
import InterfaceRestaurante from './InterfaceRestaurante';
import InterfaceEventos from './InterfaceEventos';
import AdminPanel from './AdminPanel';
import Login from './Login';
import RestrictedArea from './restricted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterfaceCliente />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restricted" element={<RestrictedArea />} />
        <Route path="/mesas" element={<InterfaceRestaurante />} />
        <Route path="/eventos" element={<InterfaceEventos />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;