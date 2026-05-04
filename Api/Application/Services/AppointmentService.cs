using Application.DTOs;
using Application.Interfaces;
using Application.Models.Dtos;
using Domain.Entities;
using Domain.Interfaces;


namespace Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public AppointmentService(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public AppointmentResponseDTO GetById(int appointmentId)
        {
            var appointment = _appointmentRepository.GetById(appointmentId)
                ?? throw new KeyNotFoundException("Cita no encontrada");

            return AppointmentResponseDTO.fromAppointmentResponse(appointment);
        }
        public CreateAppointmentDTO Create(CreateAppointmentDTO dto)
        {
            if (dto.Date.Minute != 0 && dto.Date.Minute != 30)
            {
                throw new InvalidOperationException("Los turnos deben crearse en bloques exactos de 30 minutos (ej. 10:00, 10:30).");
            }

            // Eliminamos  segundos / milisegundos para no tener problemas
            var cleanDate = new DateTime(dto.Date.Year, dto.Date.Month, dto.Date.Day, dto.Date.Hour, dto.Date.Minute, 0);
            dto.Date = cleanDate;
            var timeWindowStart = dto.Date.AddMinutes(-30);
            var timeWindowEnd = dto.Date.AddMinutes(30);

            // Se consulta con el repository para verificar que no haya superposicion con los turnos de los doctores
            bool existsOverlap = _appointmentRepository.CheckOverlap(dto.DoctorId, timeWindowStart, timeWindowEnd);
            if (existsOverlap)
            {
                throw new InvalidOperationException("El profesional ya tiene un turno habilitado en este rango horario.");
            }

            var appointment = dto.toAppointment();
            var savedAppointment = _appointmentRepository.Add(appointment);

            return CreateAppointmentDTO.fromAppointment(savedAppointment);
        }
        public AppointmentResponseDTO UpdateNotesAndStatus(UpdateAppointmentNotesDTO dto)
        {
            var appointment = _appointmentRepository.GetById(dto.Id);
            if (appointment == null) throw new KeyNotFoundException("Turno no encontrado.");

            dto.UpdateAppointmentNote(appointment);

            if (appointment.Status == Domain.Enums.AppointmentStatus.Pendiente)
            {
                appointment.PatientId = null;
            }

            _appointmentRepository.Update(appointment);

            return AppointmentResponseDTO.fromAppointmentResponse(appointment);
        }
        public CreateAppointmentDTO UpdateAppointment(CreateAppointmentDTO dto)
        {
            var existentAppointment = _appointmentRepository.GetById(dto.Id)
                ?? throw new KeyNotFoundException("No se encontró el turno que se intenta modificar.");

            if (dto.Date.Minute != 0 && dto.Date.Minute != 30)
            {
                throw new InvalidOperationException("Los turnos reprogramados deben ser en bloques de 30 minutos.");
            }

            var cleanDate = new DateTime(dto.Date.Year, dto.Date.Month, dto.Date.Day, dto.Date.Hour, dto.Date.Minute, 0);
            dto.Date = cleanDate;

            var timeWindowStart = dto.Date.AddMinutes(-30);
            var timeWindowEnd = dto.Date.AddMinutes(30);

            bool existsOverlap = _appointmentRepository.CheckOverlap(dto.DoctorId, timeWindowStart, timeWindowEnd);
            if (existsOverlap && existentAppointment.Date != dto.Date)
            {
                throw new InvalidOperationException("El profesional ya tiene un turno habilitado en el nuevo horario.");
            }

            dto.UpdateAppointment(existentAppointment);
            var updatedAppointment = _appointmentRepository.Update(existentAppointment);

            return CreateAppointmentDTO.fromAppointment(updatedAppointment);
        }
        public BookAppointmentDTO BookAppointment(BookAppointmentDTO dto)
        {
            var appointment = _appointmentRepository.GetById(dto.AppointmentId)
                ?? throw new KeyNotFoundException("El turno seleccionado no existe.");

            if (appointment.PatientId.HasValue)
            {
                throw new InvalidOperationException("Lo sentimos, este turno acaba de ser reservado por otro paciente.");
            }

            if (appointment.Status != Domain.Enums.AppointmentStatus.Pendiente)
            {
                throw new InvalidOperationException("Este turno ya no se encuentra disponible.");
            }

            appointment.PatientId = dto.PatientId;
            appointment.Status = Domain.Enums.AppointmentStatus.Reservado;
            var updatedAppointment = _appointmentRepository.Update(appointment);

            return BookAppointmentDTO.fromBook(updatedAppointment);
        }
        public List<AppointmentResponseDTO> GetByDoctorId(int doctorId)
        {
            var appointments = _appointmentRepository.GetAll()
                                                     .Where(a => a.DoctorId == doctorId)
                                                     .ToList();

            return appointments.Select(a => AppointmentResponseDTO.fromAppointmentResponse(a)).ToList();
        }
        public List<AppointmentResponseDTO> GetByPatientId(int patientId)
        {
            var appointments = _appointmentRepository.GetAll()
                                                     .Where(a => a.PatientId == patientId)
                                                     .ToList();

            return appointments.Select(a => AppointmentResponseDTO.fromAppointmentResponse(a)).ToList();
        }
        public void CancelAppointmentByPatient(int appointmentId)
        {
            var appointment = _appointmentRepository.GetById(appointmentId);

            if (appointment == null)
            {
                throw new KeyNotFoundException("El turno no existe.");
            }

            if (appointment.Status != Domain.Enums.AppointmentStatus.Reservado)
            {
                throw new InvalidOperationException("Solo se pueden cancelar turnos que estén reservados.");
            }

            appointment.Status = Domain.Enums.AppointmentStatus.Pendiente; 
            appointment.PatientId = null; 
            appointment.Observations = "Cancelado por el paciente desde su panel web.";

            _appointmentRepository.Update(appointment);
        }
        public List<MedicalHistoryDTO> GetPatientHistory(int patientId)
        {
            var historyAppointments = _appointmentRepository.GetHistoryWithDetailsByPatientId(patientId);

            var historyList = historyAppointments.Select(a => new MedicalHistoryDTO
            {
                AppointmentId = a.Id,
                Date = a.Date,

                DoctorFullName = (a.Professional != null && a.Professional.User != null)
                    ? $"Dr/a. {a.Professional.User.Surname}, {a.Professional.User.Name}"
                    : "Profesional no asignado",

                Specialty = a.Professional != null ? a.Professional.Specialty : "General",
                ReasonForVisit = a.ReasonForVisit ?? string.Empty,
                Diagnosis = a.Diagnosis ?? string.Empty
            }).ToList();

            return historyList;
        }
    }
}
