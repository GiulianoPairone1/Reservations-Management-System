
using Domain.Entities;

namespace Application.Models.Dtos
{
    public class BookAppointmentDTO
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }

        public void UpdateAppointment(Appointment appointment)
        {
            appointment.PatientId = this.PatientId;
            appointment.Status = Domain.Enums.AppointmentStatus.Reservado;
        }

        public static BookAppointmentDTO fromBook(Appointment appointment)
        {
            return new BookAppointmentDTO
            {
                AppointmentId = appointment.Id,
                PatientId = appointment.PatientId ?? 0
            };
        }

    }
}