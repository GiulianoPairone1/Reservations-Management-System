const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7119/api"; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
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
        headers: getAuthHeaders(),
        body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar el perfil del doctor');
    }

    return await response.json();
};

//Managers
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

