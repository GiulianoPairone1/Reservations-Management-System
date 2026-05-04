const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7119/api"; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};


// AUTENTICACIÓN
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/Authentication/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error('Error en el login');
    }

    return await response.json();
};



//Pacientes
export const registerPatient = async (patientData) => {
    const response = await fetch(`${API_URL}/Patient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear la cuenta del paciente');
    }

    return await response.json();
};
export const getPatientProfile = async (userId) => {
    const response = await fetch(`${API_URL}/Patient/GetProfile/${userId}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('No se pudo obtener el perfil del paciente');
    
    return await response.json();
};
export const updatePatientProfile = async (patientId, patientData) => {
    const response = await fetch(`${API_URL}/Patient/UpdateProfile/${patientId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(patientData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar el perfil del paciente');
    }

    return await response.json();
};
export const getPatientByDni = async (dni) => {
    const response = await fetch(`${API_URL}/Patient/GetByDni/${dni}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se encontró el paciente.');
    }
    
    return await response.json();
};



// Doctores 
export const getDoctorProfile = async (userId) => {
    const response = await fetch(`${API_URL}/Doctor/GetProfile/${userId}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('No se pudo obtener el perfil del doctor');
    
    return await response.json();
};

export const updateDoctorProfile = async (doctorId, doctorData) => {
    const response = await fetch(`${API_URL}/Doctor/UpdateProfile/${doctorId}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json' // <-- CRÍTICO: Agregado para que .NET lea el body
        },
        body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar el perfil del doctor');
    }

    return await response.json();
};

export const createDoctor = async (doctorData) => {
    const response = await fetch(`${API_URL}/Doctor`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json' // <-- CRÍTICO: Agregado para que .NET lea el body
        },
        body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar al doctor');
    }

    return await response.json();
};

export const getDoctorByMatricula = async (matricula) => {
    const response = await fetch(`${API_URL}/Doctor/GetDoctorByMatricula/${matricula}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('No se encontró ningún doctor con esa matrícula');
    }
    
    return await response.json();
};

export const getAllDoctors = async () => {
    const response = await fetch(`${API_URL}/Doctor`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('No se pudo obtener la lista de profesionales');
    
    return await response.json();
};



//Managers
export const createManager = async (managerData)=>{
    const response = await fetch(`${API_URL}/Manager`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(managerData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar al manager');
    }
    return await response.json();
}

export const getManagerProfile = async (userId) => {
    const response = await fetch(`${API_URL}/Manager/GetProfile/${userId}`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('No se pudo obtener el perfil del manager');
    
    return await response.json();
};

export const updateManagerProfile = async (managerId, managerData) => {
    const response = await fetch(`${API_URL}/Manager/UpdateProfile/${managerId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(managerData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar el perfil del manager');
    }

    return await response.json();
};



//Appointments
export const createAppointment = async (appointmentData) => {
    const response = await fetch(`${API_URL}/Appointment`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json' // Nos aseguramos de que .NET sepa que es un JSON
        },
        body: JSON.stringify(appointmentData) 
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al abrir el turno');
    }

    return await response.json();
};

export const getAppointmentById = async (id) => {
    const response = await fetch(`${API_URL}/Appointment/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('No se encontró ningún turno con ese ID.');
    return await response.json();
};

export const updateAppointmentCore = async (id, appointmentData) => {
    const response = await fetch(`${API_URL}/Appointment/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData) 
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al reprogramar el turno.');
    }
    
    return await response.json(); 
};

export const updateAppointmentStatus = async (id, statusData) => {
    const response = await fetch(`${API_URL}/Appointment/${id}/notes`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el estado del turno.');
    }
    return await response.json();
};

export const getAppointmentsByDoctorId = async (doctorId) => {
    const response = await fetch(`${API_URL}/Doctor/${doctorId}/appointments`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Error al cargar la agenda del profesional.');
    
    return await response.json();
};

export const bookAppointment = async (appointmentData) => {
    const response = await fetch(`${API_URL}/Appointment/book`, { 
        method: 'POST', 
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al reservar el turno.');
    }
    return await response.json();
};

export const getAppointmentsByPatientId = async (patientId) => {
    // CRÍTICO: La ruta cambia a /Patient/{id}/appointments
    const response = await fetch(`${API_URL}/Patient/${patientId}/appointments`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al cargar las reservas del paciente.');
    return await response.json();
};

export const cancelAppointmentByPatient = async (turnoId) => {
    const response = await fetch(`${API_URL}/Appointment/cancel/${turnoId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al cancelar el turno.');
    }
    
    return await response.json();
};

export const getPatientHistory = async (patientId) => {
    const response = await fetch(`${API_URL}/Patient/${patientId}/history`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Error al cargar el historial clínico.');
    }
    
    return await response.json();
};