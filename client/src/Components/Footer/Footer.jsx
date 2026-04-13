import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-contenido">
                
                <div className="footer-columna">
                    <h2>Clínica Integral</h2>
                    <p className="footer-subtitle">Cuidando tu salud los 365 días del año.</p>
                </div>
                
                <div className="footer-columna">
                    <h3>Contacto</h3>
                    <ul>
                        <li>📍 Av. Pellegrini 1234, Rosario</li>
                        <li>📞 0800-123-4567</li>
                        <li>✉️ info@clinicaintegral.com</li>
                    </ul>
                </div>
                
                <div className="footer-columna tech-stack">
                    <h3>Sobre este proyecto</h3>
                    <p>Sistema desarrollado profesionalmente utilizando:</p>
                    <div className="tech-tags">
                        <span>React</span>
                        <span>.NET 8</span>
                        <span>MySQL</span>
                    </div>
                </div>

            </div>
            
            <div className="footer-copyright">
                <p>&copy; 2026 Clínica Médica Integral. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;