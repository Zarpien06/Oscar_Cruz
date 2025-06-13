import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type User = {
  name: string
  email: string
  password: string
}

function App() {
  // Formulario de autenticación
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // Simulación de usuario registrado
  const [registeredUser, setRegisteredUser] = useState<User | null>(null)
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null)

  // Suma de números
  const [num1, setNum1] = useState<number>(0)
  const [num2, setNum2] = useState<number>(0)
  const [sum, setSum] = useState<number | null>(null)

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Iniciar sesión
      if (
        registeredUser &&
        registeredUser.email === email &&
        registeredUser.password === password
      ) {
        setLoginSuccess(true)
      } else {
        setLoginSuccess(false)
      }
    } else {
      // Registrar usuario
      const newUser: User = { name, email, password }
      setRegisteredUser(newUser)
      setIsLogin(true) // Redirige a login después del registro
      alert('Registro exitoso. Ahora inicia sesión.')
    }

    setEmail('')
    setPassword('')
    setName('')
  }

  const handleSum = (e: FormEvent) => {
    e.preventDefault()
    setSum(num1 + num2)
  }

  return (
    <div className="container">
      <h1>{isLogin ? 'Iniciar Sesión' : 'Registro de Usuario'}</h1>

      <form onSubmit={handleAuthSubmit} className="input-group">
        {!isLogin && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</button>
      </form>

      <p style={{ marginTop: '10px' }}>
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
        <a href="#" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
        </a>
      </p>

      {loginSuccess === false && (
        <p className="result" style={{ color: 'red' }}>Correo o contraseña incorrectos.</p>
      )}

      {loginSuccess && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <h1>Suma de Dos Números</h1>
          <form onSubmit={handleSum} className="input-group">
            <input
              type="number"
              placeholder="Número 1"
              value={num1}
              onChange={(e) => setNum1(Number(e.target.value))}
              required
            />
            <input
              type="number"
              placeholder="Número 2"
              value={num2}
              onChange={(e) => setNum2(Number(e.target.value))}
              required
            />
            <button type="submit">Sumar</button>
          </form>

          {sum !== null && (
            <p className="result">Resultado: {sum}</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
