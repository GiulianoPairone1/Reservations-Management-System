import {Link} from "react-router-dom"
import "./LandingPage.css"

const Landingpage = () => {
    return (
        <main className="Landing-container">
            <section className="hero-container">
                <h1>Tu salud y la de tu familia, aun click de distancia</h1>
                <h3>Accedé a nuestra red de más de 50 profesionales.
                    Reservá tu turno médico o gestioná el uso de consultorios de manera 100% digital y centralizada.
                </h3>
                <div className="hero-buttons">
                    <Link to="/login?rol=paciente" >Reservar turno</Link>
                    <Link to="/login?rol=profesional" >Acceso Profesionales</Link>
                </div>
            </section>

            <section className="trust-indicators">
                <article>Mas de 20 Especialidades Medicas</article>
                <article>Mas de 50 Profesionales</article>
                <article>Guardia 24 horas</article>
            </section>

            <section className="how-it-works-section">
                <h2>¿Como solicito un turno?</h2>
                <div className="steps-container">
                    <article className="step">
                        <h4>1. Buscá</h4>
                        <p>Elegi la especialidad o el profesional que necesitas</p>
                    </article>
                    <article className="step">
                        <h4>2.Elegi tu horario</h4>
                        <p>Selecciona el día y la hora que mejor te convenga</p>
                    </article>
                    <article className="step">
                        <h4>3. Gestiona</h4>
                        <p>ingresa a tu cuenta para confirmar tu reserva,cancelar o reprogramar tu visita</p>
                    </article>
                </div>
            </section>

            <section className="specialities-section">
                <h2>Especialidades</h2>
                <div className="cards-container">
                    <article className="card">
                        <h4>Cardiología</h4>
                        <p>Chequeos preventivos y estudios de alta complejidad</p>
                    </article>
                    <article className="card">
                        <h4>Odontologia</h4>
                        <p>Atención integral para tu salud bucal</p>
                    </article>
                    <article className="card">
                        <h4>Diagnostico por imagenes</h4>
                        <p>Reserva de salas de Rayos X y ecografías con disponibilidad inmediata.</p>
                    </article>
                </div>
            </section>
        </main>
    )
}

export default Landingpage