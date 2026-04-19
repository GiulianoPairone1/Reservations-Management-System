import React, { useState, useEffect } from "react";
import "./Perfilpage.css";
import { getPatientProfile, updatePatientProfile } from "../../services/api"; 

const PerfilPage = () => {
    const [pestañaActiva, setPestañaActiva] = useState("datosPersonales");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [datosForm, setDatosForm] = useState({
        id: 0,
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        dni: "",
        address: "",
        obraSocial: "",
        password: ""
    });

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

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    if (isLoading && datosForm.id === 0) return <div className="loading">Cargando perfil...</div>;

    return (
        <section className="perfil-wrapper">
            <section className="opciones-grid">
                <button
                    className={`btn-tab ${pestañaActiva === "datosPersonales" ? "activo" : ""}`}
                    onClick={() => setPestañaActiva("datosPersonales")}
                >Mis Datos</button>
                <button
                    className={`btn-tab ${pestañaActiva === "misReservas" ? "activo" : ""}`}
                    onClick={() => setPestañaActiva("misReservas")}
                >Mis Reservas</button>
            </section>

            {pestañaActiva === "datosPersonales" && (
                <div className="paso-container animate-fade-in">
                    <div className="header-seccion-perfil">
                        <h3 className="titulo-seccion">Tus datos personales</h3>
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
                            <label className="form-label">DNI</label>
                            <p className="dato-lectura">{datosForm.dni}</p>
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
                            <label className="form-label">Dirección</label>
                            {isEditing ? (
                                <input type="text" name="address" value={datosForm.address} onChange={handleInputChange} className="input-perfil" />
                            ) : (
                                <p className="dato-lectura">{datosForm.address}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Obra Social</label>
                            {isEditing ? (
                                <input type="text" name="obraSocial" value={datosForm.obraSocial} onChange={handleInputChange} className="input-perfil" />
                            ) : (
                                <p className="dato-lectura">{datosForm.obraSocial}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="acciones-edicion">
                                <button className="btn-tab activo btn-fijo" onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                                <button className="btn-tab btn-fijo" onClick={handleCancel}>
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )} 

            {pestañaActiva === "misReservas" && (
                <div className="paso-container animate-fade-in">
                    <h3 className="titulo-seccion">Tus reservas</h3>
                    <p className="mensaje-vacio">Próximamente verás tus turnos reales aquí.</p>
                </div>
            )}
        </section>
    );
};

export default PerfilPage;