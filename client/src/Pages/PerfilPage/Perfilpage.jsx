import React, { useState, useEffect } from "react";
import "./Perfilpage.css";
// IMPORTANTE: Sumamos getPatientHistory a las importaciones
import { getPatientProfile, updatePatientProfile, getAppointmentsByPatientId, cancelAppointmentByPatient, getAllDoctors, getPatientHistory } from "../../services/api"; 

const PerfilPage = () => {
    const [pestañaActiva, setPestañaActiva] = useState("datosPersonales");
    const [isLoading, setIsLoading] = useState(false);
    const [cargandoTurnos, setCargandoTurnos] = useState(false);
    const [cargandoHistorial, setCargandoHistorial] = useState(false); // Nuevo estado
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [datosForm, setDatosForm] = useState({
        id: 0, name: "", surname: "", email: "", phoneNumber: "", dni: "", address: "", obraSocial: "", password: ""
    });

    const [misReservas, setMisReservas] = useState([]);
    const [historialMedico, setHistorialMedico] = useState([]); // Nuevo estado para el historial
    const [listaDoctores, setListaDoctores] = useState([]);

    // 1. Cargar datos del paciente
    useEffect(() => {
        const fetchDatos = async () => {
            setIsLoading(true);
            try {
                const userId = localStorage.getItem('userId'); 
                if (userId) {
                    const data = await getPatientProfile(userId);
                    setDatosForm(data);
                }
            } catch (err) {
                console.error(err);
                setError("No pudimos cargar tus datos. Reintentá más tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDatos();
    }, []); 

    // 2. Cargar Próximas Reservas
    useEffect(() => {
        if (pestañaActiva === "misReservas" && datosForm.id !== 0) {
            const fetchReservasYDoctores = async () => {
                setCargandoTurnos(true);
                setError(null);
                try {
                    const reservasData = await getAppointmentsByPatientId(datosForm.id);
                    const doctoresData = await getAllDoctors();
                    setListaDoctores(doctoresData);

                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);

                    // Solo futuras y Reservadas (3)
                    const reservasActivas = reservasData.filter(turno => {
                        const fechaTurno = new Date(turno.date);
                        return fechaTurno >= hoy && turno.status === 3; 
                    });

                    reservasActivas.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setMisReservas(reservasActivas);

                } catch (err) {
                    console.error(err);
                    setError("Error al cargar tus reservas.");
                } finally {
                    setCargandoTurnos(false);
                }
            };
            fetchReservasYDoctores();
        }
    }, [pestañaActiva, datosForm.id]);

    // 3. NUEVO: Cargar Historial Médico
    useEffect(() => {
        if (pestañaActiva === "miHistorial" && datosForm.id !== 0) {
            const fetchHistorial = async () => {
                setCargandoHistorial(true);
                setError(null);
                try {
                    const historialData = await getPatientHistory(datosForm.id);
                    setHistorialMedico(historialData);
                } catch (err) {
                    console.error(err);
                    setError("Error al cargar tu historial clínico.");
                } finally {
                    setCargandoHistorial(false);
                }
            };
            fetchHistorial();
        }
    }, [pestañaActiva, datosForm.id]);

    // Lógicas de guardado y cancelación...
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosForm({ ...datosForm, [name]: value });
    };

    const handleSave = async () => {
        if (datosForm.password && datosForm.password.length > 0 && datosForm.password.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await updatePatientProfile(datosForm.id, datosForm);
            alert("Perfil actualizado con éxito.");
            setIsEditing(false);
            setDatosForm({...datosForm, password: ""}); 
        } catch (err) {
            setError("Error al guardar los cambios.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelarTurno = async (turnoId) => {
        if (!window.confirm("¿Estás seguro de que querés cancelar este turno?")) return;
        setIsLoading(true);
        try {
            await cancelAppointmentByPatient(turnoId);
            setMisReservas(prev => prev.filter(t => t.id !== turnoId));
            alert("Turno cancelado correctamente.");
        } catch (err) {
            alert("No pudimos cancelar el turno. Por favor, llamá a la clínica.");
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerInfoDoctor = (doctorId) => {
        const doctor = listaDoctores.find(doc => doc.id === doctorId);
        if (doctor) return `Dr/a. ${doctor.surname}, ${doctor.name} - ${doctor.specialty}`;
        return `Médico Asignado (ID: ${doctorId})`; 
    };

    // AGRUPAR HISTORIAL POR ESPECIALIDAD
    const historialAgrupado = historialMedico.reduce((acc, turno) => {
        if (!acc[turno.specialty]) {
            acc[turno.specialty] = [];
        }
        acc[turno.specialty].push(turno);
        return acc;
    }, {});

    if (isLoading && datosForm.id === 0) return <div className="loading">Cargando perfil...</div>;

    return (
        <section className="perfil-wrapper">
            <section className="opciones-grid">
                <button className={`btn-tab ${pestañaActiva === "datosPersonales" ? "activo" : ""}`} onClick={() => setPestañaActiva("datosPersonales")}>
                    Mis Datos
                </button>
                <button className={`btn-tab ${pestañaActiva === "misReservas" ? "activo" : ""}`} onClick={() => setPestañaActiva("misReservas")}>
                    Mis Reservas
                </button>
                {/* NUEVO BOTÓN */}
                <button className={`btn-tab ${pestañaActiva === "miHistorial" ? "activo" : ""}`} onClick={() => setPestañaActiva("miHistorial")}>
                    Mi Historial
                </button>
            </section>

            {/* PESTAÑA: MIS DATOS PERSONALES */}
            {pestañaActiva === "datosPersonales" && (
                <div className="paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Tus datos personales</h3>
                        {!isEditing && <button className="btn-actualizar" onClick={() => setIsEditing(true)}>Actualizar datos</button>}
                    </div>
                    {error && <p className="error-text-alerta">{error}</p>}
                    
                    <div className="formulario-grid">
                        <div className="form-group"><label className="form-label">Nombre</label>{isEditing ? <input type="text" name="name" value={datosForm.name} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.name}</p>}</div>
                        <div className="form-group"><label className="form-label">Apellido</label>{isEditing ? <input type="text" name="surname" value={datosForm.surname} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.surname}</p>}</div>
                        <div className="form-group"><label className="form-label">Email</label><p className="dato-lectura">{datosForm.email}</p></div>
                        <div className="form-group"><label className="form-label">DNI</label><p className="dato-lectura">{datosForm.dni}</p></div>
                        <div className="form-group"><label className="form-label">Teléfono</label>{isEditing ? <input type="text" name="phoneNumber" value={datosForm.phoneNumber} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.phoneNumber}</p>}</div>
                        <div className="form-group"><label className="form-label">Dirección</label>{isEditing ? <input type="text" name="address" value={datosForm.address} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.address}</p>}</div>
                        <div className="form-group"><label className="form-label">Obra Social</label>{isEditing ? <input type="text" name="obraSocial" value={datosForm.obraSocial} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.obraSocial}</p>}</div>

                        {isEditing && (
                            <div className="acciones-edicion">
                                <button className="btn-tab activo btn-fijo" onClick={handleSave} disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar Cambios"}</button>
                                <button className="btn-tab btn-fijo" onClick={() => setIsEditing(false)}>Cancelar</button>
                            </div>
                        )}
                    </div>
                </div>
            )} 

            {/* PESTAÑA: MIS RESERVAS FUTURAS */}
            {pestañaActiva === "misReservas" && (
                <div className="paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Tus próximos turnos</h3>
                    </div>
                    {cargandoTurnos ? (
                        <div className="loading">Buscando tus turnos...</div>
                    ) : misReservas.length === 0 ? (
                        <div className="mensaje-vacio"><p>No tenés ningún turno reservado próximamente.</p></div>
                    ) : (
                        <div className="turnos-grid">
                            {misReservas.map(turno => {
                                const fecha = new Date(turno.date);
                                return (
                                    <div key={turno.id} className="turno-card">
                                        <div className="turno-card-header">
                                            <span className="turno-fecha">{fecha.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                            <span className="turno-hora">{fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs</span>
                                        </div>
                                        <div className="turno-card-body">
                                            <div className="turno-info"><strong>Doctor:</strong> {obtenerInfoDoctor(turno.doctorId)}</div>
                                            <button className="btn-cancelar-turno" onClick={() => handleCancelarTurno(turno.id)} disabled={isLoading}>
                                                {isLoading ? "Cancelando..." : "Cancelar Turno"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* PESTAÑA: MI HISTORIAL (NUEVA) */}
            {pestañaActiva === "miHistorial" && (
                <div className="paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Historial Clínico</h3>
                        <p style={{ color: '#6c757d' }}>Resumen de tus visitas anteriores, agrupadas por especialidad.</p>
                    </div>

                    {cargandoHistorial ? (
                        <div className="loading">Cargando tu historial...</div>
                    ) : Object.keys(historialAgrupado).length === 0 ? (
                        <div className="mensaje-vacio">
                            <p>Aún no tenés visitas médicas registradas en tu historial.</p>
                        </div>
                    ) : (
                        <div className="historial-container">
                            {Object.entries(historialAgrupado).map(([especialidad, turnos]) => (
                                <div key={especialidad} className="especialidad-grupo">
                                    <h4 className="especialidad-titulo">{especialidad}</h4>
                                    
                                    <div className="historial-grid">
                                        {turnos.map(turno => (
                                            <div key={turno.appointmentId} className="historial-card">
                                                <div className="historial-header">
                                                    <span className="historial-fecha">
                                                        {new Date(turno.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span className="historial-doctor">{turno.doctorFullName}</span>
                                                </div>
                                                
                                                <div className="historial-body">
                                                    {turno.reasonForVisit && (
                                                        <div className="historial-item">
                                                            <strong>Motivo:</strong> <p>{turno.reasonForVisit}</p>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="historial-item devolucion-medica">
                                                        <strong>Devolución Médica:</strong>
                                                        <p>{turno.diagnosis || "Sin observaciones registradas por el profesional."}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default PerfilPage;