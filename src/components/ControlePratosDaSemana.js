import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../firebase';



const ControlePratosDaSemana = () => {
  const [aberto, setAberto] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    const docRef = doc(database, 'configuracoes', 'controle_site');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setAberto(docSnap.data().pratos_da_semana_aberto);
    } else {
      console.log('Documento não encontrado!');
    }
    setLoading(false);
  };

  const toggleStatus = async () => {
    const docRef = doc(database, 'configuracoes', 'controle_site');
    await updateDoc(docRef, { pratos_da_semana_aberto: !aberto });
    setAberto(!aberto);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <p>Carregando status...</p>;

  return (
    <div>
      <h2>Controle Pratos da Semana</h2>
      <p>Status atual: <strong>{aberto ? 'Aberto' : 'Fechado'}</strong></p>
      <button onClick={toggleStatus}>
        {aberto ? 'Fechar Seção' : 'Abrir Seção'}
      </button>
    </div>
  );
};

export default ControlePratosDaSemana;
