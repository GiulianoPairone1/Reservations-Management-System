import React, { useState, useEffect } from 'react';
import { getAllDoctors, getAppointmentsByDoctorId, updateAppointmentCore, updateAppointmentStatus } from '../../services/api';

const EditAppointmentForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    
    const [listaDoctores, setListaDoctores] = useState([]);
    const [doctorBusquedaId, setDoctorBusquedaId] = useState("");
    const [turnosDelDoctor, setTurnosDelDoctor] = useState([]);
    const [turnoActual, setTurnoActual] = useState(null); 

    useEffect(() => {
        const cargarDoctores = async () => {
            try {
                const data = await getAllDoctors();
                setListaDoctores(data);
            } catch (error) {
                console.error("Error al cargar profesionales", error);
            }
        };
        cargarDoctores();
    }, []);

    const handleBuscarTurnosDelDoctor = async (doctorId) => {
        setDoctorBusquedaId(doctorId);
        setTurnoActual(null); 
        
        if (!doctorId) {
            setTurnosDelDoctor([]);
            return;
        }

        setIsLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const data = await getAppointmentsByDoctorId(doctorId);
            setTurnosDelDoctor(data);
            if (data.length === 0) {
                setMensaje({ tipo: 'error', texto: 'Este profesional no tiene turnos en su agenda.' });
            }
        } catch (error) {
            setTurnosDelDoctor([]);
            setMensaje({ tipo: 'error', texto: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const traducirEstado = (estadoNum) => {
        const estados = ["Pendiente", "Atendido", "Ausente", "Reservado", "Reprogramado", "Cancelado"];
        return estados[estadoNum] || "Desconocido";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTurnoActual({ ...turnoActual, [name]: value });
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();
        
        const selectedDate = new Date(turnoActual.date);
        if (selectedDate.getMinutes() !== 0 && selectedDate.getMinutes() !== 30) {
            setMensaje({ tipo: 'error', texto: 'Los turnos deben estar en bloques exactos de 30 minutos.' });
            return;
        }

        setIsLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const coreDto = {
                id: turnoActual.id,
                doctorId: parseInt(turnoActual.doctorId, 10),
                date: turnoActual.date
            };

            const statusDto = {
                id: turnoActual.id,
                status: parseInt(turnoActual.status, 10),
                observations: turnoActual.observations || ""
            };

            await updateAppointmentCore(turnoActual.id, coreDto);
            await updateAppointmentStatus(turnoActual.id, statusDto);

            setMensaje({ tipo: 'exito', texto: "¡Turno actualizado y reprogramado correctamente!" });
            setTurnoActual(null); 
            handleBuscarTurnosDelDoctor(doctorBusquedaId); // Refresca la lista

        } catch (error) {
            console.error(error);
            setMensaje({ tipo: 'error', texto: error.message || "Error al guardar los cambios." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="header-seccion-perfil">
                <h3 className="titulo-seccion">Agenda y Edición de Turnos</h3>
            </div>

            {mensaje.texto && (
                <p className={mensaje.tipo === 'error' ? "error-text-alerta" : "dato-lectura"} 
                   style={mensaje.tipo === 'exito' ? { borderColor: '#28a745', color: '#155724', backgroundColor: '#d4edda', marginBottom: '15px' } : {}}>
                    {mensaje.texto}
                </p>
            )}

            <div className="form-group" style={{ marginBottom: '30px' }}>
                <label className="form-label">Seleccionar Profesional</label>
                <select 
                    className="input-perfil" 
                    value={doctorBusquedaId}
                    onChange={(e) => handleBuscarTurnosDelDoctor(e.target.value)}
                >
                    <option value="">-- Elegir Doctor --</option>
                    {listaDoctores.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                            Dr/a. {doc.surname}, {doc.name} ({doc.specialty})
                        </option>
                    ))}
                </select>
            </div>

            {turnosDelDoctor.length > 0 && !turnoActual && (
                <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px' }}>
                    <h4 style={{ color: '#0056b3', marginBottom: '15px' }}>Turnos Encontrados</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {turnosDelDoctor.map((turno) => (
                            <div key={turno.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #0056b3' }}>
                                <div>
                                    <strong>Fecha:</strong> {new Date(turno.date).toLocaleString()} <br/>
                                    <strong>Estado:</strong> <span style={{ fontWeight: 'bold', color: turno.status === 0 ? '#17a2b8' : turno.status === 5 ? '#dc3545' : '#28a745' }}>{traducirEstado(turno.status)}</span>
                                </div>
                                <button 
                                    className="btn-actualizar" 
                                    onClick={() => setTurnoActual({
                                        id: turno.id,
                                        doctorId: turno.doctorId,
                                        date: turno.date,
                                        status: turno.status,
                                        observations: turno.observations || ""
                                    })}
                                >
                                    Editar Turno
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {turnoActual && (
                <form onSubmit={handleGuardarCambios} className="formulario-grid animate-fade-in" style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px' }}>
                    
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <h4 style={{ color: '#dc3545', margin: '0 0 15px 0' }}>Editando Turno #{turnoActual.id}</h4>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Reasignar a otro Doctor (Opcional)</label>
                        <select name="doctorId" value={turnoActual.doctorId} onChange={handleInputChange} className="input-perfil" required>
                            {listaDoctores.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    Dr/a. {doc.surname}, {doc.name} ({doc.specialty})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Reprogramar Fecha y Hora</label>
                        <input type="datetime-local" name="date" value={turnoActual.date} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cambiar Estado</label>
                        <select name="status" value={turnoActual.status} onChange={handleInputChange} className="input-perfil">
                            <option value="0">Pendiente</option>
                            <option value="1">Atendido</option>
                            <option value="2">Ausente</option>
                            <option value="3">Reservado</option>
                            <option value="4">Reprogramado</option>
                            <option value="5">Cancelado</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Observaciones</label>
                        <input type="text" name="observations" value={turnoActual.observations} onChange={handleInputChange} className="input-perfil" placeholder="Ej: El paciente avisó que llega tarde" />
                    </div>

                    <div className="acciones-edicion">
                        <button type="submit" className="btn-tab activo btn-fijo" disabled={isLoading}>
                            {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button type="button" className="btn-tab btn-fijo" onClick={() => setTurnoActual(null)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditAppointmentForm;