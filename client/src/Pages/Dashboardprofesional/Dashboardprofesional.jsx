import React, { useState, useEffect } from "react";
import './Dashboardprofesional.css';
import { getDoctorProfile, updateDoctorProfile } from "../../services/api"; 

const Dashboardprofesional = () => {
    const [pestañaActiva, setPestañaActiva] = useState("miPerfil");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [datosForm, setDatosForm] = useState({
        id: 0,
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        specialty: "",
        matricula: "",
        password: "" 
    });

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

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    if (isLoading && datosForm.id === 0) return <div className="loading-text">Cargando dashboard...</div>;

    return (
        <section className="perfil-wrapper">
            <div className="section1 opciones-grid">
                <button
                    className={`btn-tab ${pestañaActiva === "miPerfil" ? "activo" : ""}`}
                    onClick={() => { setPestañaActiva("miPerfil"); setIsEditing(false); }}
                >Mi Perfil</button>
                <button
                    className={`btn-tab ${pestañaActiva === "miAgenda" ? "activo" : ""}`}
                    onClick={() => setPestañaActiva("miAgenda")}
                >Mi Agenda</button>
            </div>

            {pestañaActiva === "miPerfil" &&
                <div className="section2 paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Mi Perfil Profesional</h3>
                        {!isEditing && (
                            <button className="btn-actualizar" onClick={() => setIsEditing(true)}>
                                Actualizar datos
                            </button>
                        )}
                    </div>

                    {error && <p className="error-text-alerta">{error}</p>}

                    <div className="formulario-grid">
                        <div className="form-group">
                            <label className="form-label">Nombre</label>
                            {isEditing ? (
                                <input type="text" name="name" value={datosForm.name} onChange={handleInputChange} className="input-perfil" />
                            ) : (
                                <p className="dato-lectura">{datosForm.name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Apellido</label>
                            {isEditing ? (
                                <input type="text" name="surname" value={datosForm.surname} onChange={handleInputChange} className="input-perfil" />
                            ) : (
                                <p className="dato-lectura">{datosForm.surname}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Correo Electrónico</label>
                            <p className="dato-lectura">{datosForm.email}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Teléfono</label>
                            {isEditing ? (
                                <input type="text" name="phoneNumber" value={datosForm.phoneNumber} onChange={handleInputChange} className="input-perfil" />
                            ) : (
                                <p className="dato-lectura">{datosForm.phoneNumber}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Especialidad</label>
                            {isEditing ? (
                                <input type="text" name="specialty" value={datosForm.specialty} onChange={handleInputChange} className="input-perfil" />
                            ) : (
                                <p className="dato-lectura">{datosForm.specialty}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Matrícula</label>
                            <p className="dato-lectura">{datosForm.matricula}</p>
                        </div>

                        {isEditing && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Nueva Contraseña</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Mínimo 6 caracteres"
                                        value={datosForm.password || ""} 
                                        onChange={handleInputChange}
                                        className="input-perfil" 
                                    />
                                </div>
                                <div className="acciones-edicion">
                                    <button className="btn-tab activo btn-fijo" onClick={handleSave} disabled={isLoading}>
                                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button className="btn-tab btn-fijo" onClick={handleCancel}>
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>}

            {pestañaActiva === "miAgenda" &&
                <div className="section2 paso-container animate-fade-in">
                    <h3 className="titulo-seccion">Turnos del Día</h3>
                    <p className="mensaje-vacio">Próximamente verás tus turnos programados aquí.</p>
                </div>}
        </section>
    );
};

export default Dashboardprofesional;