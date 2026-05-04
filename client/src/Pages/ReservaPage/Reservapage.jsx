import React, { useState, useEffect } from "react";
import './ReservaPage.css';
import { getAllDoctors, getAppointmentsByDoctorId, bookAppointment, getPatientProfile } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ReservaPage = () => {
    const navigate = useNavigate();
    
    const [pasoActual, setPasoActual] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [pacienteId, setPacienteId] = useState(null);
    const [listaDoctores, setListaDoctores] = useState([]);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    
    const [turnosDisponibles, setTurnosDisponibles] = useState([]);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

    //  Buscamos el paciente que inicio sesion y los doctores
    useEffect(() => {
        const inicializarReserva = async () => {
            setIsLoading(true);
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const patientData = await getPatientProfile(userId);
                    setPacienteId(patientData.id);
                }

                const doctores = await getAllDoctors();
                setListaDoctores(doctores);
            } catch (err) {
                console.error(err);
                setError("Tuvimos un problema al cargar los datos iniciales.");
            } finally {
                setIsLoading(false);
            }
        };
        inicializarReserva();
    }, []);

    // Paso 1
    const handleSeleccionarDoctor = async (doctor) => {
        setDoctorSeleccionado(doctor);
        setIsLoading(true);
        setError(null);

        try {
            const turnosDelDoctor = await getAppointmentsByDoctorId(doctor.id);
            
            const hoy = new Date();
            const turnosLibres = turnosDelDoctor.filter(t => {
                const fechaTurno = new Date(t.date);
                return fechaTurno >= hoy && t.status === 0;
            });

            turnosLibres.sort((a, b) => new Date(a.date) - new Date(b.date));
            setTurnosDisponibles(turnosLibres);
            setPasoActual(2); 
        } catch (err) {
            setError("Error al cargar la agenda de este profesional.");
        } finally {
            setIsLoading(false);
        }
    };

    // Paso 2
    const handleSeleccionarTurno = (turno) => {
        setTurnoSeleccionado(turno);
        setPasoActual(3);
    };

    // Paso 3
    const handleConfirmarReserva = async () => {
        if (!pacienteId || !turnoSeleccionado) {
            setError("Faltan datos para confirmar tu reserva.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const dtoReserva = {
                appointmentId: turnoSeleccionado.id,
                patientId: pacienteId
            };

            await bookAppointment(dtoReserva);
            
            alert("¡Reserva confirmada con éxito! Podés verla en tu perfil.");
            navigate("/perfilpage");

        } catch (err) {
            console.error(err);
            setError("No pudimos confirmar tu reserva. Es posible que alguien más haya tomado el turno.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="reserva-wrapper">
            <div className="reserva-header">
                <h1 className="titulo-seccion">Reserva tu turno</h1>
                <p>Completá los 3 pasos para agendar tu consulta médica.</p>
            </div>

            <div className="stepper-container">
                <div className={`step ${pasoActual >= 1 ? 'active' : ''}`}>1. Profesional</div>
                <div className="step-line"></div>
                <div className={`step ${pasoActual >= 2 ? 'active' : ''}`}>2. Fecha y Hora</div>
                <div className="step-line"></div>
                <div className={`step ${pasoActual >= 3 ? 'active' : ''}`}>3. Confirmación</div>
            </div>

            {error && <p className="error-text-alerta">{error}</p>}

            <div className="paso-container animate-fade-in">
                
                {pasoActual === 1 && (
                    <div className="step-content">
                        <h3 className="step-title">Seleccioná un Profesional</h3>
                        {isLoading ? (
                            <p className="loading">Cargando profesionales...</p>
                        ) : (
                            <div className="cards-grid">
                                {listaDoctores.map(doc => (
                                    <div key={doc.id} className="doctor-card" onClick={() => handleSeleccionarDoctor(doc)}>
                                        <div className="doctor-avatar">👨‍⚕️</div>
                                        <div className="doctor-info">
                                            <h4>Dr/a. {doc.surname}, {doc.name}</h4>
                                            <span className="especialidad-tag">{doc.specialty}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {pasoActual === 2 && (
                    <div className="step-content animate-fade-in">
                        <div className="step-header-volver">
                            <button className="btn-volver" onClick={() => setPasoActual(1)}>← Volver a Profesionales</button>
                            <h3 className="step-title">Turnos con el Dr/a. {doctorSeleccionado?.surname}</h3>
                        </div>

                        {isLoading ? (
                            <p className="loading">Buscando turnos libres...</p>
                        ) : turnosDisponibles.length === 0 ? (
                            <p className="mensaje-vacio">Este profesional no tiene turnos libres por el momento.</p>
                        ) : (
                            <div className="turnos-disponibles-grid">
                                {turnosDisponibles.map(turno => {
                                    const fecha = new Date(turno.date);
                                    return (
                                        <div key={turno.id} className="turno-disponible-card" onClick={() => handleSeleccionarTurno(turno)}>
                                            <div className="dia-mes">
                                                <span className="dia">{fecha.getDate()}</span>
                                                <span className="mes">{fecha.toLocaleDateString('es-AR', { month: 'short' })}</span>
                                            </div>
                                            <div className="hora-exacta">
                                                {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {pasoActual === 3 && turnoSeleccionado && doctorSeleccionado && (
                    <div className="step-content animate-fade-in">
                        <button className="btn-volver" onClick={() => setPasoActual(2)}>← Volver a Horarios</button>
                        
                        <h3 className="step-title titulo-exito">Resumen de tu Reserva</h3>
                        
                        <div className="resumen-reserva">
                            <div className="resumen-item">
                                <span className="resumen-label">Especialidad:</span>
                                <span className="resumen-valor">{doctorSeleccionado.specialty}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="resumen-label">Profesional:</span>
                                <span className="resumen-valor">Dr/a. {doctorSeleccionado.surname}, {doctorSeleccionado.name}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="resumen-label">Día:</span>
                                <span className="resumen-valor">{new Date(turnoSeleccionado.date).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="resumen-label">Hora:</span>
                                <span className="resumen-valor">{new Date(turnoSeleccionado.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs</span>
                            </div>
                        </div>

                        <div className="acciones-edicion acciones-centradas">
                            <button 
                                className="btn-tab activo btn-confirmacion-final" 
                                onClick={handleConfirmarReserva} 
                                disabled={isLoading}
                            >
                                {isLoading ? "Procesando..." : "✅ Confirmar Reserva"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReservaPage;