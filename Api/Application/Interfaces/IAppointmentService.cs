
using Application.DTOs;
using Application.Models.Dtos;

namespace Application.Interfaces
{
    public interface IAppointmentService
    {
        CreateAppointmentDTO Create(CreateAppointmentDTO dto);
        AppointmentResponseDTO UpdateNotesAndStatus(UpdateAppointmentNotesDTO dto);
        AppointmentResponseDTO GetById(int appointmentId);
        CreateAppointmentDTO UpdateAppointment(CreateAppointmentDTO dto);
        BookAppointmentDTO BookAppointment(BookAppointmentDTO dto);
        List<AppointmentResponseDTO> GetByDoctorId(int doctorId);
        List<AppointmentResponseDTO> GetByPatientId(int patientId);
        void CancelAppointmentByPatient(int appointmentId);
        List<MedicalHistoryDTO> GetPatientHistory(int patientId);
    }
}
