import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
    return (
        <header className="header-container">
            <div className="header-logo">
                {/* Corregido: Usamos Link en lugar de la etiqueta <a> */}
                <Link to="/">Mi Estudio</Link>
            </div>

            <nav className="header-nav">
                <Link to="/" className="nav-link">Inicio</Link>
                <Link to="/login?rol=paciente" className="nav-link btn-outline">Reservar turno</Link>
                <Link to="/login?rol=profesional" className="nav-link btn-solid">Acceso Profesionales</Link>
            </nav>
        </header>
    )
}

export default Header