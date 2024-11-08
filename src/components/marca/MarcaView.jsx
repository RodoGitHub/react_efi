import React, { useState, useEffect } from 'react';

const MarcaView = () => {
  const [marcas, setMarcas] = useState([]);
  const [message, setMessage] = useState('');
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    // Función para obtener todas las marcas
    const fetchMarcas = async () => {
      try {
        const response = await fetch('http://localhost:5000/marca', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las marcas');
        }

        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchMarcas();
  }, [token]);

  // Función para activar una marca (cambiar 'activo' a true)
  const activarMarca = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/marca/activar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ id, activo: true }),  // Enviar 'activo' como true
      });

      if (!response.ok) {
        throw new Error('Error al activar la marca');
      }

      // Actualizar el estado para reflejar el cambio
      setMarcas(marcas.map((marca) => 
        marca.id === id ? { ...marca, activo: true } : marca
      ));
      setMessage('Marca activada exitosamente');
    } catch (error) {
      setMessage(`Error al activar la marca: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Lista de Marcas</h1>
      {message && <div style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</div>}
      <ul>
        {marcas.map((marca) => (
          <li key={marca.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ flex: 1 }}>{marca.nombre}</span>
            {!marca.activo && ( // Solo mostrar el botón si la marca no está activa
              <button onClick={() => activarMarca(marca.id)} style={{ cursor: 'pointer', color: 'green' }}>
                Activar
              </button>
            )}
            {marca.activo && (
              <span style={{ color: 'green', marginLeft: '10px' }}>Activa</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarcaView;

