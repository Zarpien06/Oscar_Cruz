import { useState } from 'react';
import '../assets/css/FormAuth.css';

const Registro: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [form, setForm] = useState({
        nombre: '',
        celular: '',
        tipoId: '',
        numeroId: '',
        correo: '',
        contrasena: '',
        confirmar: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isRegistering) {
            if (form.contrasena !== form.confirmar) {
                alert('Las contraseñas no coinciden');
                return;
            }
            console.log('Registrando usuario:', form);
        } else {
            console.log('Iniciando sesión con:', {
                correo: form.correo,
                contrasena: form.contrasena,
            });
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setForm({
            nombre: '',
            celular: '',
            tipoId: '',
            numeroId: '',
            correo: '',
            contrasena: '',
            confirmar: '',
        });
    };

    return (
        <div className="form-container">
            <h2>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</h2>
            <form onSubmit={handleSubmit}>
                {isRegistering && (
                    <>
                        <input
                            name="nombre"
                            type="text"
                            placeholder="Nombre completo"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="celular"
                            type="tel"
                            placeholder="Número de celular"
                            value={form.celular}
                            onChange={handleChange}
                            required
                        />
                        <select name="tipoId" value={form.tipoId} onChange={handleChange} required>
                            <option value="">Tipo de identificación</option>
                            <option value="CC">Cédula</option>
                            <option value="TI">Tarjeta de Identidad</option>
                            <option value="CE">Cédula de Extranjería</option>
                        </select>
                        <input
                            name="numeroId"
                            type="text"
                            placeholder="Número de identificación"
                            value={form.numeroId}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}
                <input
                    name="correo"
                    type="email"
                    placeholder="Correo electrónico"
                    value={form.correo}
                    onChange={handleChange}
                    required
                />
                <input
                    name="contrasena"
                    type="password"
                    placeholder="Contraseña"
                    value={form.contrasena}
                    onChange={handleChange}
                    required
                />
                {isRegistering && (
                    <input
                        name="confirmar"
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={form.confirmar}
                        onChange={handleChange}
                        required
                    />
                )}
                <button type="submit">{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</button>
            </form>

            <div className="toggle-auth">
                {isRegistering ? (
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <button type="button" onClick={toggleMode}>
                            Inicia sesión
                        </button>
                    </p>
                ) : (
                    <p>
                        ¿No tienes una cuenta?{' '}
                        <button type="button" onClick={toggleMode}>
                            Regístrate
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Registro;
