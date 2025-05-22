import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si usas react-router
import '../assets/css/FormAuth.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Redirección después de login

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Simulación de autenticación (reemplazar por llamada a backend)
        console.log('Login con:', { email, password });

        // Ejemplo de redirección
        // navigate('/dashboard');
    };

    return (
        <>
        <Navbar scrolled={false} />
            <div className="form-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Entrar</button>
                </form>

                <div className="toggle-auth">
                    <p>
                        ¿No tienes una cuenta?{' '}
                        <button type="button" onClick={() => navigate('/registro')}>
                            Regístrate
                        </button>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Login;
