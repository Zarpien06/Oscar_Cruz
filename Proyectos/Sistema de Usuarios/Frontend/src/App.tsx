import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/usuarios')
      .then(res => setUsuarios(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Usuarios Registrados</h1>
      <ul>
        {usuarios.map((u: any) => (
          <li key={u.id}>{u.nombre} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
