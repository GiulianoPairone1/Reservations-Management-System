import React, { useState, useEffect } from 'react';
import { createAppointment, getAllDoctors } from '../../services/api'; 

const CrearTurnoForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [listaDoctores, setListaDoctores] = useState([]);

    const [turnoForm, setTurnoForm] = useState({
        doctorId: "", 
        date: ""
    });

    const getMinDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        const cargarDoctores = async () => {
            try {
                const data = await getAllDoctors();
                setListaDoctores(data);
            } catch (error) {
                console.error(error);
                setMensaje({ tipo: 'error', texto: "Error al cargar la lista de profesionales." });
            }
        };
        cargarDoctores();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTurnoForm({ ...turnoForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const selectedDate = new Date(turnoForm.date);
        const now = new Date();

        if (selectedDate < now) {
            setMensaje({ tipo: 'error', texto: 'No puedes habilitar turnos en fechas u horas que ya pasaron.' });
            return;
        }

        const minutes = selectedDate.getMinutes();
        if (minutes !== 0 && minutes !== 30) {
            setMensaje({ tipo: 'error', texto: 'Los turnos deben crearse en bloques exactos de 30 minutos (ej. 10:00 o 10:30).' });
            return;
        }

        setIsLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const dto = {
                doctorId: parseInt(turnoForm.doctorId, 10),
                date: turnoForm.date
            };

            await createAppointment(dto);
            setMensaje({ tipo: 'exito', texto: "¡Turno habilitado correctamente en la agenda!" });
            setTurnoForm({ doctorId: "", date: "" });
            
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: 'error', texto: error.message || "Error al abrir el turno en la agenda." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="header-seccion-perfil">
                <h3 className="titulo-seccion">Abrir Nuevo Turno</h3>
            </div>

            {mensaje.texto && (
                <p className={mensaje.tipo === 'error' ? "error-text-alerta" : "dato-lectura"} 
                   style={mensaje.tipo === 'exito' ? { borderColor: '#28a745', color: '#155724', backgroundColor: '#d4edda', marginBottom: '15px' } : {}}>
                    {mensaje.texto}
                </p>
            )}

            <form onSubmit={handleSubmit} className="formulario-grid">
                <div className="form-group">
                    <label className="form-label">Profesional</label>
                    <select 
                        name="doctorId" 
                        required 
                        value={turnoForm.doctorId} 
                        onChange={handleInputChange} 
                        className="input-perfil"
                    >
                        <option value="">-- Seleccioná un doctor --</option>
                        {listaDoctores.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                Dr/a. {doctor.surname}, {doctor.name} ({doctor.specialty})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Fecha y Hora</label>
                    <input 
                        type="datetime-local" 
                        name="date" 
                        required 
                        value={turnoForm.date} 
                        onChange={handleInputChange} 
                        className="input-perfil" 
                        min={getMinDateTime()} 
                    />
                </div>

                <div className="acciones-edicion">
                    <button type="submit" className="btn-tab activo btn-fijo" disabled={isLoading}>
                        {isLoading ? "Creando turno..." : "Habilitar Turno"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearTurnoForm;