import React, { useState } from 'react';
import { FiUser, FiPlus, FiMinus, FiTrash2, FiUsers } from 'react-icons/fi';

const InterfaceEventos = () => {
  const [eventName, setEventName] = useState('');
  const [guests, setGuests] = useState([]);
  const [currentGuest, setCurrentGuest] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const addGuest = () => {
    if (currentGuest.trim()) {
      setGuests([...guests, { id: Date.now(), name: currentGuest }]);
      setCurrentGuest('');
    }
  };

  const removeGuest = (id) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const createTable = () => {
    if (guests.length > 0) {
      const newTable = {
        id: Date.now(),
        name: `Mesa ${tables.length + 1}`,
        guests: [...guests]
      };
      setTables([...tables, newTable]);
      setGuests([]);
    }
  };

  const openTable = (table) => {
    setSelectedTable(table);
  };

  const closeTable = () => {
    setSelectedTable(null);
  };

  if (selectedTable) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-astral text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedTable.name} - Evento: {eventName}</h2>
              <button 
                onClick={closeTable}
                className="bg-white text-astral px-3 py-1 rounded"
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold mb-3">Convidados nesta mesa:</h3>
            <div className="space-y-2 mb-4">
              {selectedTable.guests.map(guest => (
                <div key={guest.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FiUser className="mr-2 text-gray-500" />
                    <span>{guest.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Adicionar Pedido
              </button>
              <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                Fechar Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Eventos</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Criar Novo Evento</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Nome do Evento</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ex: Aniversário João"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Adicionar Convidados</h2>
            <div className="flex mb-3">
              <input
                type="text"
                value={currentGuest}
                onChange={(e) => setCurrentGuest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGuest()}
                className="flex-1 p-2 border border-gray-300 rounded-l"
                placeholder="Nome do convidado"
              />
              <button
                onClick={addGuest}
                className="bg-astral text-white px-3 rounded-r hover:bg-astral-dark transition"
              >
                <FiPlus />
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {guests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum convidado adicionado</p>
              ) : (
                <div className="space-y-2">
                  {guests.map(guest => (
                    <div key={guest.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-500" />
                        <span>{guest.name}</span>
                      </div>
                      <button
                        onClick={() => removeGuest(guest.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={createTable}
              disabled={guests.length === 0}
              className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              Criar Mesa com {guests.length} Convidados
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Mesas do Evento</h2>
            {tables.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma mesa criada ainda</p>
            ) : (
              <div className="space-y-3">
                {tables.map(table => (
                  <div 
                    key={table.id} 
                    onClick={() => openTable(table)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{table.name}</h3>
                      <span className="flex items-center text-sm text-gray-600">
                        <FiUsers className="mr-1" />
                        {table.guests.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceEventos;