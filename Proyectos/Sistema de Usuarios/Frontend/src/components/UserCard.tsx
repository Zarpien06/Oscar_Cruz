import React from 'react';

interface Props {
  id: number;
  nombre: string;
  correo: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export const UserCard: React.FC<Props> = ({ id, nombre, correo, onDelete, onEdit }) => {
  return (
    <div className="border rounded p-4 shadow-md bg-white mb-2">
      <p><strong>Nombre:</strong> {nombre}</p>
      <p><strong>Correo:</strong> {correo}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => onEdit(id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
        <button onClick={() => onDelete(id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
      </div>
    </div>
  );
};