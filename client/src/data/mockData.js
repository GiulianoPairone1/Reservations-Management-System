export const profesionalesData = [
    {
        id: 1,
        nombre: "Dr. Juan Pérez",
        especialidad: "Cardiología",
        diasAtencion: ["Lunes", "Miércoles", "Viernes"],
        turnosDisponibles: [
            { fecha: "2026-04-15", horarios: ["09:00", "09:30", "10:30"] },
            { fecha: "2026-04-17", horarios: ["14:00", "14:30", "15:00", "15:30"] }
        ]
    },
    {
        id: 2,
        nombre: "Dra. Ana Gómez",
        especialidad: "Odontología",
        diasAtencion: ["Martes", "Jueves"],
        turnosDisponibles: [
            { fecha: "2026-04-14", horarios: ["10:00", "11:00", "11:30"] },
            { fecha: "2026-04-16", horarios: ["16:00", "16:30"] }
        ]
    },
    {
        id: 3,
        nombre: "Dr. Carlos Ruiz",
        especialidad: "Diagnóstico por Imágenes",
        diasAtencion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
        turnosDisponibles: [
            { fecha: "2026-04-14", horarios: ["08:00", "08:30", "09:00"] },
            { fecha: "2026-04-15", horarios: ["17:00", "17:30", "18:00"] }
        ]
    }
];

// Extraemos las especialidades únicas para armar los botones del primer paso
export const especialidadesUnicas = [...new Set(profesionalesData.map(p => p.especialidad))];



export const pacienteLogueado = {
    id: 101,
    nombre: "Giuliano",
    apellido: "Pairone",
    dni: "41863651",
    fechaNacimiento: "1999-05-22",
    direccion: "Av. Pellegrini 1234",
    email: "giuliano@email.com",
    // Simulamos que ya tiene un turno sacado previamente
    turnosProximos: [
        {
            idTurno: 501,
            especialidad: "Cardiología",
            profesional: "Dr. Juan Pérez",
            fecha: "2026-04-20",
            hora: "10:00"
        }
    ]
};

export const profesionalLogueado = {
    id: 1,
    nombre: "Dr. Juan Pérez",
    especialidad: "Cardiología",
    matricula: "MP-45678",
    email: "jperez@clinica.com",
    // Esta vez los turnos tienen los datos del paciente
    turnosAgendados: [
        { idTurno: 1001, fecha: "2026-04-20", hora: "10:00", paciente: "Giuliano Rossi", dni: "35123456" },
        { idTurno: 1002, fecha: "2026-04-20", hora: "10:30", paciente: "María Gómez", dni: "28111222" },
        { idTurno: 1003, fecha: "2026-04-21", hora: "16:00", paciente: "Carlos Tevez", dni: "20333444" }
    ]
};


export const usuariosRegistrados = [
    {
        email: "giuliano@email.com",
        password: "123",
        rol: "paciente"
    },
    {
        email: "jperez@clinica.com",
        password: "123",
        rol: "profesional"
    }
];