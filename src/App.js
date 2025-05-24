// App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import InterfaceCliente from './InterfaceCliente';
import AdminPanel from './AdminPanel';
import Login from './Login';
import RestrictedArea from './restricted';
import QRCodeGenerator from './QRCodeGenerator';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const showFooterOnlyOnHome = location.pathname === '/';

  return (
    <>
      <Routes>
        <Route path="/" element={<InterfaceCliente />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            localStorage.getItem('adminLoggedIn') === 'true' 
              ? <AdminPanel /> 
              : <Navigate to="/login" state={{ from: '/admin' }} replace />
          } 
        />
        <Route path="/qrcodes" element={<QRCodeGenerator />} />
        <Route path="/restricted" element={<RestrictedArea />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Footer visível somente na rota '/' */}
      {showFooterOnlyOnHome && <Footer />}
    </>
  );
}

export default App;
