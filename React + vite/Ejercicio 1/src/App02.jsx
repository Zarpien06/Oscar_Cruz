import { useState } from "react";
import './App.css';  

function App() {
  const [numeros, setNumeros] = useState([0, 0, 0, 0, 0]);

  function generarAleatorios() {
    const vec = new Array(5);
    for (let x = 0; x < vec.length; x++) {
      vec[x] = Math.trunc(Math.random() * 10); 
    }
    setNumeros(vec);  
  }

  return (
    <div className="app-container">
      <h1>Generador de Números Aleatorios</h1>
      <div className="numeros-container">
        {numeros.map((num, index) => (
          <p key={index} className="numero">{num}</p>
        ))}
      </div>
      <button onClick={generarAleatorios} className="generar-btn">
        Generar Números Aleatorios
      </button>
    </div>
  );
}

export default App;
