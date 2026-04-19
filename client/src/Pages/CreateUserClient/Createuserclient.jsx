import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerPatient } from "../../services/api"; 
import "./Createuserclient.css";

const Createuserclient = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [datosForm, setDatosForm] = useState({
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        password: "",
        dni: "",
        obraSocial: "",
        address: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosForm({ ...datosForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        // Validación básica de seguridad
        if (datosForm.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await registerPatient(datosForm);
            alert("Cuenta creada con éxito. Ya puedes iniciar sesión.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Hubo un error al crear la cuenta. Verifica los datos o el correo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="registro-wrapper animate-fade-in">
            <div className="registro-container">
                <h2 className="titulo-registro">Crear Cuenta de Paciente</h2>
                <p className="subtitulo-registro">Completa tus datos para acceder al sistema de turnos.</p>

                {error && <p className="error-banner">{error}</p>}

                <form onSubmit={handleSubmit} className="formulario-grid">
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            name="name" 
                            required
                            value={datosForm.name} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Apellido</label>
                        <input 
                            type="text" 
                            name="surname" 
                            required
                            value={datosForm.surname} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">DNI</label>
                        <input 
                            type="text" 
                            name="dni" 
                            required
                            value={datosForm.dni} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required
                            value={datosForm.email} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            value={datosForm.phoneNumber} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Obra Social</label>
                        <input 
                            type="text" 
                            name="obraSocial" 
                            value={datosForm.obraSocial} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group-full">
                        <label className="form-label">Dirección</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={datosForm.address} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="form-group-full">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            required
                            placeholder="Mínimo 6 caracteres"
                            value={datosForm.password} 
                            onChange={handleInputChange} 
                            className="input-perfil" 
                        />
                    </div>

                    <div className="acciones-registro">
                        <button type="submit" className="btn-solid btn-fijo" disabled={isLoading}>
                            {isLoading ? "Procesando..." : "Registrarme"}
                        </button>
                        <Link to="/login" className="link-volver">
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Createuserclient;