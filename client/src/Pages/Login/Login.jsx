import { useSearchParams, Link } from 'react-router-dom';
import "./Login.css"

const Login = () => {
    // Inicializamos
    const [searchParams] = useSearchParams();
    
    //  Valor del  parámetro rol
    const rol = searchParams.get('rol');

    
    const titulo = rol === 'profesional' 
        ? 'Portal Médico - Ingreso de personal' 
        : 'Ingresá a tu portal para reservar';

    return (
        <main className="login-wrapper">
            <section className="login-card">
                
                <h2>{titulo}</h2>
                <p className="login-subtitle">Por favor, ingresá tus credenciales para continuar.</p>

                <form className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="ejemplo@correo.com" 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        Ingresar
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/" className="back-link">← Volver al inicio</Link>
                </div>

            </section>
        </main>
    );
}

export default Login;