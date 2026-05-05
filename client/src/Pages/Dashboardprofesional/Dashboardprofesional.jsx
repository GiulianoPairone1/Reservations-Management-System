import React, { useState, useEffect } from "react";
import './Dashboardprofesional.css';
import { 
    getDoctorProfile, 
    updateDoctorProfile, 
    getAppointmentsByDoctorId, 
    updateAppointmentStatus, 
    getPatientProfile, 
    getPatientByDni, 
    getPatientHistory 
} from "../../services/api"; 

const Dashboardprofesional = () => {
    const [pestañaActiva, setPestañaActiva] = useState("miPerfil");
    const [isLoading, setIsLoading] = useState(false);
    const [cargandoTurnos, setCargandoTurnos] = useState(false); 
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Dejamos el estado inicial limpio
    const [datosForm, setDatosForm] = useState({
        id: 0, name: "", surname: "", email: "", phoneNumber: "", specialty: "", matricula: "", password: "" 
    });
    
    const [todosLosTurnos, setTodosLosTurnos] = useState([]); 
    const [misTurnos, setMisTurnos] = useState([]); 
    const [infoPacientes, setInfoPacientes] = useState({});
    const [filtroTiempo, setFiltroTiempo] = useState("proximos"); 
    const [filtroEstado, setFiltroEstado] = useState("todos");    
    
    const [turnoModal, setTurnoModal] = useState(null); 
    const [observacionTurno, setObservacionTurno] = useState("");
    const [estadoTurno, setEstadoTurno] = useState(5);
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [resultadoHistorial, setResultadoHistorial] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            setIsLoading(true);
            try {
                const userId = localStorage.getItem('userId'); 
                if (userId) {
                    const data = await getDoctorProfile(userId);
                    setDatosForm(data);
                }
            } catch (err) {
                console.error(err);
                setError("No pudimos cargar tus datos profesionales.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDatos();
    }, []);

    useEffect(() => {
        if (pestañaActiva === "miAgenda" && datosForm.id !== 0) {
            const fetchTurnosYPacientes = async () => {
                setCargandoTurnos(true);
                setError(null);
                try {
                    const data = await getAppointmentsByDoctorId(datosForm.id);
                    setTodosLosTurnos(data); 

                    const idsUnicos = [...new Set(data.map(t => t.patientId).filter(id => id != null))];
                    const pacientesBuscados = { ...infoPacientes };

                    for (const pid of idsUnicos) {
                        if (!pacientesBuscados[pid]) {
                            try {
                                const pacienteData = await getPatientProfile(pid);
                                pacientesBuscados[pid] = pacienteData;
                            } catch (e) {
                                console.warn(`No se pudo cargar la info del paciente ${pid}`);
                            }
                        }
                    }
                    setInfoPacientes(pacientesBuscados);
                } catch (err) {
                    console.error(err);
                    setError("Error al cargar tu agenda de turnos.");
                } finally {
                    setCargandoTurnos(false);
                }
            };
            fetchTurnosYPacientes();
        }
    }, [pestañaActiva, datosForm.id]);

    useEffect(() => {
        let resultado = [...todosLosTurnos];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); 

        if (filtroTiempo === "proximos") {
            resultado = resultado.filter(t => new Date(t.date) >= hoy);
            resultado.sort((a, b) => new Date(a.date) - new Date(b.date)); 
        } else if (filtroTiempo === "pasados") {
            resultado = resultado.filter(t => new Date(t.date) < hoy);
            resultado.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        } else {
            resultado.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        if (filtroEstado !== "todos") {
            resultado = resultado.filter(t => t.status.toString() === filtroEstado);
        }

        setMisTurnos(resultado);
    }, [todosLosTurnos, filtroTiempo, filtroEstado]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosForm({ ...datosForm, [name]: value });
    };

    const handleSave = async () => {
        if (datosForm.password && datosForm.password.length > 0 && datosForm.password.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await updateDoctorProfile(datosForm.id, datosForm);
            alert("Perfil profesional actualizado con éxito.");
            setIsEditing(false);
            setDatosForm(prev => ({ ...prev, password: "" }));
        } catch (err) {
            console.error(err);
            setError("Error al guardar los cambios profesionales.");
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalTurno = (turno) => {
        setTurnoModal(turno);
        setEstadoTurno(turno.status);
        setObservacionTurno(turno.observations || "");
        setMotivoConsulta(turno.reasonForVisit || "");
        setDiagnostico(turno.diagnosis || "");
    };

    const handleActualizarEstadoModal = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const statusData = {
                id: turnoModal.id,
                status: parseInt(estadoTurno, 10),
                observations: observacionTurno,
                reasonForVisit: motivoConsulta,
                diagnosis: diagnostico
            };

            await updateAppointmentStatus(turnoModal.id, statusData);
            
            setTodosLosTurnos(prevTurnos => prevTurnos.map(t => 
                t.id === turnoModal.id ? { 
                    ...t, 
                    status: parseInt(estadoTurno, 10), 
                    observations: observacionTurno,
                    reasonForVisit: motivoConsulta,
                    diagnosis: diagnostico
                } : t
            ));

            setTurnoModal(null); 
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el turno: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuscarHistorialPorDNI = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResultadoHistorial(null);

        try {
            const paciente = await getPatientByDni(dniBusqueda);
            const historial = await getPatientHistory(paciente.id);
            
            setResultadoHistorial({
                nombre: `${paciente.surname}, ${paciente.name}`,
                dni: paciente.dni,
                turnos: historial
            });
        } catch (err) {
            console.error(err);
            if (err.message.includes("404") || err.message.toLowerCase().includes("not found")) {
                setError("No existe ningún paciente registrado con ese DNI.");
            } else {
                setError("Ocurrió un error al consultar el historial. Verifique los datos.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderEstadoBadge = (estado) => {
        switch (estado) {
            case 0: return <span className="badge badge-pendiente">Pendiente</span>;
            case 1: return <span className="badge badge-atendido">Atendido</span>;
            case 2: return <span className="badge badge-ausente">Ausente</span>;
            case 3: return <span className="badge badge-reservado">Reservado</span>;
            case 4: return <span className="badge badge-reprogramado">Reprogramado</span>;
            case 5: return <span className="badge badge-cancelado">Cancelado</span>;
            default: return <span className="badge">Desconocido</span>;
        }
    };

    if (isLoading && datosForm.id === 0) return <div className="loading-text">Cargando dashboard...</div>;

    return (
        <section className="perfil-wrapper">
            <div className="section1 opciones-grid">
                <button className={`btn-tab ${pestañaActiva === "miPerfil" ? "activo" : ""}`} onClick={() => { setPestañaActiva("miPerfil"); setIsEditing(false); }}>Mi Perfil</button>
                <button className={`btn-tab ${pestañaActiva === "miAgenda" ? "activo" : ""}`} onClick={() => setPestañaActiva("miAgenda")}>Mi Agenda</button>
                <button className={`btn-tab ${pestañaActiva === "buscadorHistorial" ? "activo" : ""}`} onClick={() => setPestañaActiva("buscadorHistorial")}>Buscar Paciente</button>
            </div>

            {pestañaActiva === "miPerfil" && (
                <div className="section2 paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Mi Perfil Profesional</h3>
                        {!isEditing && <button className="btn-actualizar" onClick={() => setIsEditing(true)}>Actualizar datos</button>}
                    </div>
                    {error && <p className="error-text-alerta">{error}</p>}
                    <div className="formulario-grid">
                        <div className="form-group"><label className="form-label">Nombre</label>{isEditing ? <input type="text" name="name" value={datosForm.name} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.name}</p>}</div>
                        <div className="form-group"><label className="form-label">Apellido</label>{isEditing ? <input type="text" name="surname" value={datosForm.surname} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.surname}</p>}</div>
                        <div className="form-group"><label className="form-label">Correo Electrónico</label><p className="dato-lectura">{datosForm.email}</p></div>
                        <div className="form-group"><label className="form-label">Teléfono</label>{isEditing ? <input type="text" name="phoneNumber" value={datosForm.phoneNumber} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.phoneNumber}</p>}</div>
                        <div className="form-group"><label className="form-label">Especialidad</label>{isEditing ? <input type="text" name="specialty" value={datosForm.specialty} onChange={handleInputChange} className="input-perfil" /> : <p className="dato-lectura">{datosForm.specialty}</p>}</div>
                        <div className="form-group"><label className="form-label">Matrícula</label><p className="dato-lectura">{datosForm.matricula}</p></div>
                        {isEditing && (
                            <div className="acciones-edicion">
                                <button className="btn-tab activo btn-fijo" onClick={handleSave} disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar Cambios"}</button>
                                <button className="btn-tab btn-fijo" onClick={() => setIsEditing(false)}>Cancelar</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {pestañaActiva === "miAgenda" && (
                <div className="section2 paso-container animate-fade-in">
                    <div className="header-agenda">
                        <h3 className="titulo-seccion">Control de Agenda</h3>
                        <div className="filtros-container">
                            <select className="input-perfil select-filtro" value={filtroTiempo} onChange={(e) => setFiltroTiempo(e.target.value)}>
                                <option value="proximos">Próximos Turnos</option>
                                <option value="pasados">Historial (Pasados)</option>
                                <option value="todos">Todos los Turnos</option>
                            </select>
                            <select className="input-perfil select-filtro" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                <option value="todos">Todos los Estados</option>
                                <option value="0">Pendientes (Libres)</option>
                                <option value="3">Reservados por Paciente</option>
                                <option value="1">Atendidos</option>
                                <option value="2">Ausentes</option>
                                <option value="4">Reprogramados</option>
                                <option value="5">Cancelados</option>
                            </select>
                        </div>
                    </div>
                    {error && <p className="error-text-alerta">{error}</p>}
                    {cargandoTurnos ? <div className="loading-text">Cargando tu agenda...</div> : misTurnos.length === 0 ? <div className="mensaje-vacio"><p>No se encontraron turnos.</p></div> : (
                        <div className="turnos-grid">
                            {misTurnos.map(turno => {
                                const fecha = new Date(turno.date);
                                return (
                                    <div key={turno.id} className={`turno-card interactiva ${turno.status === 3 ? 'destacado' : ''}`} onClick={() => abrirModalTurno(turno)}>
                                        <div className="turno-card-header">
                                            <span className="turno-fecha">{fecha.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                            <span className="turno-hora">{fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs</span>
                                        </div>
                                        <div className="turno-card-body">
                                            <div className="turno-info"><strong>Estado:</strong> {renderEstadoBadge(turno.status)}</div>
                                            {turno.patientId && <div className="turno-info"><strong>Paciente:</strong> {infoPacientes[turno.patientId] ? `${infoPacientes[turno.patientId].surname}, ${infoPacientes[turno.patientId].name} (DNI: ${infoPacientes[turno.patientId].dni})` : `ID #${turno.patientId}`}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {pestañaActiva === "buscadorHistorial" && (
                <div className="section2 paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Buscador de Historias Clínicas</h3>
                    </div>

                    <form onSubmit={handleBuscarHistorialPorDNI} className="buscador-dni-form">
                        <input 
                            type="number" 
                            className="input-perfil input-busqueda" 
                            placeholder="DNI del paciente (ej: 35123456)" 
                            value={dniBusqueda}
                            onChange={(e) => setDniBusqueda(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-tab activo btn-accion-busqueda" disabled={isLoading}>{isLoading ? "Buscando..." : "🔍 Buscar"}</button>
                    </form>

                    {error && <p className="error-text-alerta error-busqueda-centrado">⚠️ {error}</p>}

                    {resultadoHistorial && (
                        <div className="resultado-busqueda-clinica animate-fade-in">
                            <h4 className="paciente-resultado-titulo">Paciente: {resultadoHistorial.nombre} (DNI: {resultadoHistorial.dni})</h4>
                            
                            {resultadoHistorial.turnos.length === 0 ? (
                                <div className="mensaje-vacio-alerta">
                                    <p>El paciente existe pero <strong>no registra historial clínico</strong> (aún no ha sido atendido).</p>
                                </div>
                            ) : (
                                <div className="historial-grid-resultado">
                                    {resultadoHistorial.turnos.map(item => (
                                        <div key={item.appointmentId} className="historial-card-profesional">
                                            <div className="historial-card-top">
                                                <strong>{new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                                                <span className="especialidad-tag">{item.specialty}</span>
                                            </div>
                                            <div className="historial-card-content">
                                                <p><strong>Profesional:</strong> {item.doctorFullName}</p>
                                                <p><strong>Motivo:</strong> {item.reasonForVisit || "No especificado"}</p>
                                                <div className="diagnostico-box-profesional">
                                                    <strong>Diagnóstico / Devolución:</strong>
                                                    <p>{item.diagnosis || "Sin diagnóstico registrado."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* MODAL GESTIONAR TURNO */}
            {turnoModal && (
                <div className="modal-overlay" onClick={() => setTurnoModal(null)}>
                    <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="header-seccion-perfil">
                            <h3 className="titulo-seccion titulo-modal">Gestionar Turno</h3>
                        </div>
                        <p className="modal-subtitulo">
                            <strong>Fecha:</strong> {new Date(turnoModal.date).toLocaleDateString('es-AR')} a las {new Date(turnoModal.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs
                        </p>
                        <form onSubmit={handleActualizarEstadoModal} className="formulario-grid">
                            <div className="form-group form-group-full">
                                <label className="form-label">Cambiar Estado</label>
                                <select className="input-perfil" value={estadoTurno} onChange={(e) => setEstadoTurno(e.target.value)}>
                                    <option value="0" disabled={turnoModal?.status !== 0}>Pendiente (Libre)</option>
                                    <option value="1">Atendido</option>
                                    <option value="2">Ausente</option>
                                    <option value="3" disabled={turnoModal?.status !== 3}>Reservado por Paciente</option>
                                    <option value="4">Reprogramados</option>
                                    <option value="5">Cancelado</option>
                                </select>
                            </div>
                            {turnoModal.patientId && (
                                <>
                                    <div className="form-group form-group-full clinical-header-divider">
                                        <h4 className="clinical-info-title">Información Clínica</h4>
                                        <label className="form-label">Motivo de la Consulta</label>
                                        <input type="text" className="input-perfil" value={motivoConsulta} onChange={(e) => setMotivoConsulta(e.target.value)} />
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label className="form-label">Diagnóstico / Devolución</label>
                                        <textarea className="input-perfil text-area-clinical" rows="4" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)}></textarea>
                                    </div>
                                </>
                            )}
                            <div className="form-group form-group-full">
                                <label className="form-label">Notas Administrativas (Internas)</label>
                                <input type="text" className="input-perfil" value={observacionTurno} onChange={(e) => setObservacionTurno(e.target.value)} />
                            </div>
                            <div className="acciones-edicion acciones-modal">
                                <button type="submit" className="btn-tab activo btn-fijo" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar Cambios"}</button>
                                <button type="button" className="btn-tab btn-fijo" onClick={() => setTurnoModal(null)}>Cerrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Dashboardprofesional;