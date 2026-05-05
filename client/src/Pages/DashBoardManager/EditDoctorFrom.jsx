import React, { useState } from 'react';
import { getDoctorByMatricula, updateDoctorProfile } from '../../services/api';

const EditDoctorForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    
    const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
    const [doctorActual, setDoctorActual] = useState(null);

    const handleBuscarDoctor = async (e) => {
        e.preventDefault();
        if (!matriculaBusqueda.trim()) return;

        setIsLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const data = await getDoctorByMatricula(matriculaBusqueda);
            setDoctorActual({
                id: data.id,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phoneNumber: data.phoneNumber,
                matricula: data.matricula,
                specialty: data.specialty,
                password: "" 
            });
        } catch (error) {
            setDoctorActual(null);
            setMensaje({ tipo: 'error', texto: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorActual({ ...doctorActual, [name]: value });
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const dtoParaEnviar = { ...doctorActual };
            if (!dtoParaEnviar.password) {
                delete dtoParaEnviar.password;
            }

            await updateDoctorProfile(doctorActual.id, dtoParaEnviar);            
            setMensaje({ tipo: 'exito', texto: "¡Perfil del profesional actualizado correctamente!" });
            setDoctorActual(null); 
            setMatriculaBusqueda(""); 

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
                <h3 className="titulo-seccion">Buscar y Editar Profesional</h3>
            </div>

            {mensaje.texto && (
                <p className={mensaje.tipo === 'error' ? "error-text-alerta" : "dato-lectura"} 
                   style={mensaje.tipo === 'exito' ? { borderColor: '#28a745', color: '#155724', backgroundColor: '#d4edda', marginBottom: '15px' } : {}}>
                    {mensaje.texto}
                </p>
            )}

            <form onSubmit={handleBuscarDoctor} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Ingrese la matrícula (Ej: MP-12345)" 
                    className="input-perfil" 
                    value={matriculaBusqueda}
                    onChange={(e) => setMatriculaBusqueda(e.target.value)}
                    required
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn-tab activo" disabled={isLoading} style={{ width: 'auto', padding: '10px 20px' }}>
                    {isLoading && !doctorActual ? "Buscando..." : "Buscar"}
                </button>
            </form>

            {doctorActual && (
                <form onSubmit={handleGuardarCambios} className="formulario-grid" style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px' }}>
                    
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <h4 style={{ color: '#0056b3', margin: '0 0 15px 0' }}>Editando al Dr/a. {doctorActual.surname}</h4>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input type="text" name="name" value={doctorActual.name} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Apellido</label>
                        <input type="text" name="surname" value={doctorActual.surname} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Matrícula</label>
                        <input type="text" name="matricula" value={doctorActual.matricula} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Especialidad</label>
                        <input type="text" name="specialty" value={doctorActual.specialty} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input type="tel" name="phoneNumber" value={doctorActual.phoneNumber} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" value={doctorActual.email} onChange={handleInputChange} className="input-perfil" required />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Nueva Contraseña (Dejar en blanco para no cambiarla)</label>
                        <input type="password" name="password" value={doctorActual.password} onChange={handleInputChange} className="input-perfil" placeholder="Mínimo 6 caracteres..." />
                    </div>

                    <div className="acciones-edicion">
                        <button type="submit" className="btn-tab activo btn-fijo" disabled={isLoading}>
                            {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button type="button" className="btn-tab btn-fijo" onClick={() => setDoctorActual(null)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditDoctorForm;