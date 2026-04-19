import React, { useState, useEffect } from "react";
import './Dashboardmanager.css';
import { getManagerProfile, updateManagerProfile } from "../../services/api";

const Dashboardmanager = () => {
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
        password: "" 
    });

    useEffect(() => {
        const fetchDatos = async () => {
            setIsLoading(true);
            try {
                const userId = localStorage.getItem('userId'); 
                if (userId) {
                    const data = await getManagerProfile(userId);
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
            await updateManagerProfile(datosForm.id, datosForm);
            alert("Perfil de administración actualizado correctamente.");
            setIsEditing(false);
            setDatosForm(prev => ({ ...prev, password: "" }));
        } catch (err) {
            console.error(err);
            setError("Error al guardar los cambios.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && datosForm.id === 0) return <div className="loading-state">Cargando panel...</div>;

    return (
        <section className="perfil-wrapper">
            <div className="section1 opciones-grid">
                <button
                    className={`btn-tab ${pestañaActiva === "miPerfil" ? "activo" : ""}`}
                    onClick={() => { setPestañaActiva("miPerfil"); setIsEditing(false); }}
                >Mi Perfil</button>
                <button 
                    className={`btn-tab ${pestañaActiva === "opciones" ? "activo" : ""}`}
                    onClick={() => setPestañaActiva("opciones")}
                >Gestión Global</button>
            </div>

            {pestañaActiva === "miPerfil" && 
                <div className="section2 paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Datos de Administrador</h3>
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
                            <label className="form-label">Email</label>
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
                                    <button 
                                        className="btn-tab activo btn-fijo" 
                                        onClick={handleSave} 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button 
                                        className="btn-tab btn-fijo" 
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>}

            {pestañaActiva === "opciones" && (
                <div className="section2 paso-container animate-fade-in">
                    <h2 className="titulo-seccion">Panel de Control</h2>
                    <p className="mensaje-vacio">
                        Módulo de gestión de doctores, pacientes y auditoría de turnos.
                    </p>
                </div>
            )}
        </section>
    );
};

export default Dashboardmanager;