import { useEffect, useState } from 'react';
import axios from 'axios';
import './app.css';


interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const fetchUsuarios = () => {
    axios.get('http://localhost:3001/api/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email) return;

    if (editId) {
      // Editar
      await axios.put(`http://localhost:3001/api/usuarios/${editId}`, {
        nombre,
        email
      });
      setEditId(null);
    } else {
      // Registrar
      await axios.post('http://localhost:3001/api/register', {
        nombre,
        email,
        password
      });
    }

    setNombre('');
    setEmail('');
    setPassword('');
    fetchUsuarios();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
    fetchUsuarios();
  };

  const handleEdit = (usuario: Usuario) => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setEditId(usuario.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Usuarios</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {!editId && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">{editId ? 'Actualizar' : 'Registrar'}</button>
      </form>

      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            {u.nombre} - {u.email}
            <button onClick={() => handleEdit(u)}>Editar</button>
            <button onClick={() => handleDelete(u.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
