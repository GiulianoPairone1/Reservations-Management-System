import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const configPorRol = {
        patient: { ruta: '/PerfilPage', etiqueta: 'Mi Perfil' },
        doctor: { ruta: '/dashboardprofesional', etiqueta: 'Mi Perfil' },
        manager: { ruta: '/dashboardmanager', etiqueta: 'Mi Perfil' }
    };

    const miConfig = configPorRol[role] || { ruta: '/', etiqueta: 'Inicio' };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload(); 
    };

    return (
        <header className="header-container">
            <div className="header-logo">
                <Link to="/">Mi Estudio</Link>
            </div>

            <nav className="header-nav">
                {/* Link de Inicio siempre visible */}
                <Link to="/" className="nav-link">Inicio</Link>

                {token ? (
                    <>
                        <Link to={miConfig.ruta} className="nav-link">
                            {miConfig.etiqueta}
                        </Link>
                        
                        <button onClick={handleLogout} className="nav-link btn-outline" style={{ cursor: 'pointer', background: 'transparent' }}>
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="nav-link btn-solid">
                        Iniciar Sesion
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;