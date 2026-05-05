import React, { useState } from "react";
import { getPatientByDni, getPatientHistory } from "../../services/api"; 


const SearchPatientHistory = () => {
    const [dniBusqueda, setDniBusqueda] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultadoHistorial, setResultadoHistorial] = useState(null);

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

    return (
        <div className="animate-fade-in">
            <h3 className="titulo-seccion mb-20">Buscador de Historias Clínicas</h3>
            
            <form onSubmit={handleBuscarHistorialPorDNI} className="buscador-dni-form">
                <input 
                    type="number" 
                    className="input-perfil input-busqueda" 
                    placeholder="DNI del paciente (ej: 35123456)" 
                    value={dniBusqueda}
                    onChange={(e) => setDniBusqueda(e.target.value)}
                    required
                />
                <button type="submit" className="btn-tab activo btn-accion-busqueda" disabled={isLoading}>
                    {isLoading ? "Buscando..." : "Buscar"}
                </button>
            </form>

            {error && <p className="error-text-alerta error-busqueda-centrado">{error}</p>}

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
    );
};

export default SearchPatientHistory;