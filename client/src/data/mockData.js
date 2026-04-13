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
    apellido: "Rossi",
    dni: "35123456",
    fechaNacimiento: "1995-08-14",
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