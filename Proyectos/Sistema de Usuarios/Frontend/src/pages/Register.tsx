import React, { useState } from 'react';

export const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Realizar POST a backend
    console.log({ nombre, correo, password });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Nombre" className="w-full p-2 border" onChange={e => setNombre(e.target.value)} />
        <input type="email" placeholder="Correo" className="w-full p-2 border" onChange={e => setCorreo(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-2 border" onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Registrarse</button>
      </form>
    </div>
  );
};
