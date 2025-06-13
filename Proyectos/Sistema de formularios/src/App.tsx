import { useState } from 'react'
import './App.css'

function App() {
  const [num1, setNum1] = useState<number>(0)
  const [num2, setNum2] = useState<number>(0)
  const [sum, setSum] = useState<number | null>(null)

  const handleSum = () => {
    setSum(num1 + num2)
  }

  return (
    <div className="container">
      <h1>Suma de Dos Números</h1>

      <div className="input-group">
        <input
          type="number"
          placeholder="Número 1"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Número 2"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
        />
        <button onClick={handleSum}>Sumar</button>
      </div>

      {sum !== null && (
        <p className="result">Resultado: {sum}</p>
      )}
    </div>
  )
}

export default App
