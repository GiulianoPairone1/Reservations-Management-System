import React, { useState } from 'react';
import { createDoctor } from '../../services/api';

const CreateDoctorForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' }); 

    const [doctorForm, setDoctorForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        phoneNumber: "",
        matricula: "",
        specialty: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorForm({ ...doctorForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (doctorForm.password.length < 6) {
            setMensaje({ tipo: 'error', texto: "La contraseña debe tener al menos 6 caracteres." });
            return;
        }

        setIsLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            await createDoctor(doctorForm);
            setMensaje({ tipo: 'exito', texto: "¡Doctor registrado correctamente!" });
            
            setDoctorForm({
                name: "", surname: "", email: "", password: "", phoneNumber: "", matricula: "", specialty: ""
            });
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: 'error', texto: error.message || "Error al registrar el profesional." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="header-seccion-perfil">
                <h3 className="titulo-seccion">Registrar Nuevo Profesional</h3>
            </div>

            {mensaje.texto && (
                <p className={mensaje.tipo === 'error' ? "error-text-alerta" : "dato-lectura"} 
                   style={mensaje.tipo === 'exito' ? { borderColor: '#28a745', color: '#155724', backgroundColor: '#d4edda', marginBottom: '15px' } : {}}>
                    {mensaje.texto}
                </p>
            )}

            <form onSubmit={handleSubmit} className="formulario-grid">
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="name" required value={doctorForm.name} onChange={handleInputChange} className="input-perfil" placeholder="Ej. Juan" />
                </div>

                <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input type="text" name="surname" required value={doctorForm.surname} onChange={handleInputChange} className="input-perfil" placeholder="Ej. Pérez" />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" required value={doctorForm.email} onChange={handleInputChange} className="input-perfil" placeholder="correo@clinica.com" />
                </div>

                <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input type="text" name="phoneNumber" required value={doctorForm.phoneNumber} onChange={handleInputChange} className="input-perfil" placeholder="Ej. 341..." />
                </div>

                <div className="form-group">
                    <label className="form-label">Matrícula</label>
                    <input type="text" name="matricula" required value={doctorForm.matricula} onChange={handleInputChange} className="input-perfil" placeholder="Ej. MP-12345" />
                </div>

                <div className="form-group">
                    <label className="form-label">Especialidad</label>
                    <input type="text" name="specialty" required value={doctorForm.specialty} onChange={handleInputChange} className="input-perfil" placeholder="Ej. Cardiología" />
                </div>

                <div className="form-group">
                    <label className="form-label">Contraseña de acceso</label>
                    <input type="password" name="password" required value={doctorForm.password} onChange={handleInputChange} className="input-perfil" placeholder="Mínimo 6 caracteres" />
                </div>

                <div className="acciones-edicion">
                    <button type="submit" className="btn-tab activo btn-fijo" disabled={isLoading}>
                        {isLoading ? "Creando perfil..." : "Crear Doctor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDoctorForm;