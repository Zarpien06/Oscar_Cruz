import React, { useState } from "react";

function App() {
  const [numero, setNumero] = useState(0);
  const [error, setError] = useState(false);

  function sumar() {
    const nuevoNumero = numero + 1;
    setNumero(nuevoNumero);
    if (nuevoNumero >= 0) {
      setError(false); 
    }
  }

  function restar() {
    const nuevoNumero = numero - 1;
    setNumero(nuevoNumero);
    if (nuevoNumero < 0) {
      setError(true);
    }
  }

  return (
    <div>
      <h1>Segundo Taller Incrementos</h1>
      <p>Utilizando useState</p>
      <p>Contador que no puede ser negativo</p>
      <p>Botones para sumar y restar</p>
      <p>El contador comienza en 0</p>
      <p>Si el contador es negativo, se muestra un mensaje de error</p>
      <p>El mensaje de error se oculta cuando el contador es 0 o positivo</p>
      <p>El contador se actualiza al hacer clic en los botones</p>
      <p>El contador se muestra en un encabezado</p>
      <p>El contador se actualiza en tiempo real</p>
      <p>El contador no puede ser negativo</p>
      <p>El contador se incrementa en 1 al hacer clic en el botón "Sumar"</p>
      <h2>Número: {numero}</h2>
      {error && <p style={{ color: "red" }}>Error: el número no puede ser negativo</p>}
      <button onClick={sumar}>Sumar</button>
      <button onClick={restar}>Restar</button>
    </div>
  );
}

export default App;

