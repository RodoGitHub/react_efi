import React from 'react';

const Bienvenida = () => {
    const nombreUsuario = localStorage.getItem('username'); 

    return (
        <div>
            <h1>Bienvenido/a, {nombreUsuario}</h1>
            <h3>Has iniciado sesión exitosamente.</h3>
        </div>
        
    );
};

export default Bienvenida;
