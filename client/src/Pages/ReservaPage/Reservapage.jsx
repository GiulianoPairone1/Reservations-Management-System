import React, { useState } from 'react';
import { profesionalesData, especialidadesUnicas } from '../../data/mockData'; 
import './ReservaPage.css';

const ReservaPage = () => {
    const [especialidadElegida, setEspecialidadElegida] = useState(null);
    const [profesionalElegido, setProfesionalElegido] = useState(null);
    const [fechaElegida, setFechaElegida] = useState(null);
    const [horaElegida, setHoraElegida] = useState(null);
    const [turnoConfirmado, setTurnoConfirmado] = useState(false);

    return (
        <section className="reserva-wrapper">
            <div className="reserva-header-simple">
                <h2>Reserva de Turno</h2>
                <p>Completá los pasos para agendar tu visita.</p>
            </div>

            <div className="paso-container">
                <h3 className="paso-titulo">1. Elegí la especialidad</h3>
                <div className="opciones-grid">
                    {especialidadesUnicas.map((especialidad, index) => (
                        <button 
                            key={index} 
                            className={`btn-opcion ${especialidadElegida === especialidad ? 'activa' : ''}`}
                            onClick={() => {
                                setEspecialidadElegida(especialidad);
                                setProfesionalElegido(null); 
                                setFechaElegida(null); 
                                setHoraElegida(null);
                            }}
                        >
                            {especialidad}
                        </button>
                    ))}
                </div>
            </div>

            {especialidadElegida && (
                <div className="paso-container animate-fade-in">
                    <h3 className="paso-titulo">2. Elegí un Profesional</h3>
                    <div className="opciones-grid">
                        {profesionalesData
                            .filter(prof => prof.especialidad === especialidadElegida)
                            .map((prof) => (
                                <button 
                                    key={prof.id}
                                    className={`btn-opcion ${profesionalElegido?.id === prof.id ? 'activa' : ''}`}
                                    onClick={() => {
                                        setProfesionalElegido(prof);
                                        setFechaElegida(null); 
                                        setHoraElegida(null);
                                    }}
                                >
                                    <span className="prof-nombre">{prof.nombre}</span>
                                    <span className="prof-dias">Atiende: {prof.diasAtencion.join(', ')}</span>
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}

            {profesionalElegido && !turnoConfirmado && (
                <div className="paso-container animate-fade-in">
                    <h3 className="paso-titulo">3. Elegí el día</h3>
                    <div className="opciones-grid">
                        {profesionalElegido.turnosDisponibles?.map((turno, index) => (
                            <button 
                                key={index}
                                className={`btn-opcion ${fechaElegida === turno.fecha ? 'activa' : ''}`}
                                onClick={() => {
                                    setFechaElegida(turno.fecha);
                                    setHoraElegida(null);
                                }}
                            >
                                <strong>{turno.fecha}</strong>
                            </button>
                        ))}
                    </div>

                    {fechaElegida && (
                        <div className="horarios-seccion animate-fade-in">
                            <h4 className="subtitulo-paso">Horarios para el {fechaElegida}</h4>
                            <div className="opciones-grid">
                                {profesionalElegido.turnosDisponibles
                                    .find(t => t.fecha === fechaElegida)
                                    .horarios.map((horario, index) => (
                                        <button 
                                            key={index}
                                            className={`btn-opcion ${horaElegida === horario ? 'activa' : ''}`}
                                            onClick={() => setHoraElegida(horario)}
                                        >
                                            <strong>{horario}</strong>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}

            {horaElegida && !turnoConfirmado && (
                <div className="paso-container confirmacion-container animate-fade-in">
                    <h3 className="paso-titulo">4. Revisá y confirmá</h3>
                    <div className="resumen-tarjeta">
                        <p><strong>Especialidad:</strong> {especialidadElegida}</p>
                        <p><strong>Profesional:</strong> {profesionalElegido.nombre}</p>
                        <p><strong>Fecha:</strong> {fechaElegida}</p>
                        <p><strong>Hora:</strong> {horaElegida} hs</p>
                    </div>
                    <button 
                        className="btn-confirmar" 
                        onClick={() => setTurnoConfirmado(true)}
                    >
                        Confirmar Reserva
                    </button>
                </div>
            )}

            {turnoConfirmado && (
                <div className="mensaje-exito-final animate-fade-in">
                    <h2>¡Turno Confirmado!</h2>
                    <p style={{ marginTop: '10px', marginBottom: '20px' }}>
                        Te esperamos el <strong>{fechaElegida}</strong> a las <strong>{horaElegida} hs</strong>.
                    </p>
                    <button className="btn-opcion" onClick={() => window.location.reload()}>
                        Nueva Reserva
                    </button>
                </div>
            )}
        </section>
    );
};

export default ReservaPage;