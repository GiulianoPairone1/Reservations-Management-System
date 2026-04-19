import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const Landingpage = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const normalizedRole = role ? role.toLowerCase() : '';
    const rutaReserva = (token && normalizedRole === 'patient') ? '/reservapage' : '/login';
    const rutaProfesional = (token && normalizedRole === 'doctor') ? '/Dashboardprofesional' : '/login';

    return (
        <main className="Landing-container">
            <section className="hero-container">
                <h1>Tu salud y la de tu familia, a un click de distancia</h1>
                <h3>
                    Accedé a nuestra red de más de 50 profesionales.
                    Reservá tu turno médico o gestioná el uso de consultorios de manera 100% digital y centralizada.
                </h3>
                <div className="hero-buttons">
                    <Link 
                        to={rutaReserva} 
                        state={{ destinoDeseado: '/reservapage' }}
                    >
                        Reservar turno
                    </Link>
                    <Link to={rutaProfesional}>Acceso Profesionales</Link>
                </div>
            </section>

            <section className="trust-indicators">
                <article>Más de 20 Especialidades Médicas</article>
                <article>Más de 50 Profesionales</article>
                <article>Guardia 24 horas</article>
            </section>

            <section className="how-it-works-section">
                <h2>¿Cómo solicito un turno?</h2>
                <div className="steps-container">
                    <article className="step">
                        <h4>1. Buscá</h4>
                        <p>Elegí la especialidad o el profesional que necesitás.</p>
                    </article>
                    <article className="step">
                        <h4>2. Elegí tu horario</h4>
                        <p>Seleccioná el día y la hora que mejor te convenga.</p>
                    </article>
                    <article className="step">
                        <h4>3. Gestioná</h4>
                        <p>Ingresá a tu cuenta para confirmar tu reserva, cancelar o reprogramar tu visita.</p>
                    </article>
                </div>
            </section>

            <section className="specialities-section">
                <h2>Especialidades</h2>
                <div className="cards-container">
                    <article className="card">
                        <h4>Cardiología</h4>
                        <p>Chequeos preventivos y estudios de alta complejidad.</p>
                    </article>
                    <article className="card">
                        <h4>Odontología</h4>
                        <p>Atención integral para tu salud bucal.</p>
                    </article>
                    <article className="card">
                        <h4>Diagnóstico por imágenes</h4>
                        <p>Reserva de salas de Rayos X y ecografías con disponibilidad inmediata.</p>
                    </article>
                </div>
            </section>
        </main>
    );
}

export default Landingpage;