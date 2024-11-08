import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserContainer from './components/users/UserContainer';
import { Menubar } from 'primereact/menubar';
import Home from './components/home';
import LoginUser from './components/users/LoginUser'; 
import CreateUser from './components/users/CreateUser';




function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(''); // Limpiar el estado de username
    navigate('/inicio-sesion'); // Redirigir al inicio de sesión
  };

  const items = [
    { label: 'Home', icon: 'pi pi-home', url: '/' },
    { label: 'Lista usuarios', icon: 'pi pi-users', url: '/usuarios' },
    { label: 'Nuevo Usuario', icon: 'pi pi-user-plus', url: '/nuevo-usuario' },
    { label: 'Login', icon: 'pi pi-user', url: '/inicio-sesion' }
  ];

  
  const end = username ? (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '10px' }}>Bienvenido, {username}</span>
      <button onClick={handleLogout} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: '#007ad9' }}>
        Cerrar sesión
      </button>
    </div>
  ) : null;
  
  return (
    <BrowserRouter>
      <Menubar model={items} className="menubar-custom" end={end} />
      
      <div className="content">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<UserContainer />} />
            <Route path="/nuevo-usuario" element={<CreateUser />} />
            <Route path="/inicio-sesion" element={<LoginUser />} />
          </Routes>
        </div>
      </div>
      <h2>EFI Desplat-Palacios</h2>
    </BrowserRouter>
  );
}

export default App;
