import { useState } from 'react';
import './App.css';

function App() {
  const [nota1, setNota1] = useState<number>(0);
  const [nota2, setNota2] = useState<number>(0);
  const [nota3, setNota3] = useState<number>(0);
  const [resultado, setResultado] = useState<string | null>(null);

  const calcularNotaFinal = () => {
    const final = nota1 * 0.3 + nota2 * 0.3 + nota3 * 0.4;
    const estado = final >= 30 ? 'APROBÓ' : 'REPROBÓ';
    setResultado(`Nota final: ${final.toFixed(2)} - ${estado}`);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Universidad de los Andes</h1>
        <img
          src="./src/assets/Andes.png"
          alt="Logo Universidad de los Andes"
          className="logo"
        />
      </div>

      <h2>Sistema de Cálculo de Notas</h2>
      <p>
        Esta herramienta permite calcular la nota final de un estudiante en función de tres
        evaluaciones ponderadas.
      </p>

      <div className="input-group">
        <input
          type="number"
          placeholder="Nota 1 (30%)"
          value={nota1}
          onChange={(e) => setNota1(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Nota 2 (30%)"
          value={nota2}
          onChange={(e) => setNota2(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Nota 3 (40%)"
          value={nota3}
          onChange={(e) => setNota3(Number(e.target.value))}
        />
        <button onClick={calcularNotaFinal}>Calcular Nota Final</button>
      </div>

      {resultado && (
        <p className={`result ${resultado.includes('REPROBÓ') ? 'failed' : ''}`}>
          {resultado}
        </p>
      )}
    </div>
  );
}

export default App;
