import React, { useState } from 'react';
import { useNavigate, Link,useLocation } from 'react-router-dom';
import "./Login.css";
import { loginUser } from '../../services/api'; 

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const destinoDeseado = location.state?.destinoDeseado;
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError(null);
        setIsLoading(true);

        try {
            const data = await loginUser({ email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);

            switch (data.role) {
                case 'patient':
                    navigate(destinoDeseado || '/Perfilpage');
                    break;
                case 'doctor':
                    navigate('/Dashboardprofesional');
                    break;
                case 'manager':
                    navigate('/Dashboardmanager');
                    break;
                default:
                    setError("Rol de usuario no válido.");
            }

        } catch (err) {
            setError(err.message || "Error al iniciar sesión. Intente nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-wrapper animate-fade-in">
            <section className="login-card">
                <div className="login-header">
                    <h2>Bienvenido</h2>
                    <p className="login-subtitle">Ingresá tus credenciales para acceder al sistema.</p>
                </div>

                {error && <div className="error-text-alerta">{error}</div>}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="ejemplo@correo.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="••••••••" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta? <Link to="/createuserclient">Regístrate aquí</Link></p>
                    <Link to="/" className="back-link">← Volver al inicio</Link>
                </div>
            </section>
        </main>
    );
}

export default Login;