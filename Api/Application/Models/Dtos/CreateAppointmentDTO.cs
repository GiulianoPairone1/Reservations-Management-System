
using Domain.Entities;
using System.Security.Cryptography;

namespace Application.Models.Dtos
{
    public class CreateAppointmentDTO
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }


        public Appointment toAppointment()
        {
            return new Appointment
            {
                DoctorId = this.DoctorId,
                Date = this.Date,
                Status = Domain.Enums.AppointmentStatus.Pendiente
            };
        }


        public void UpdateAppointment(Appointment appointment)
        {
            appointment.DoctorId = this.DoctorId;
            appointment.Date = this.Date;
        }

        public static CreateAppointmentDTO fromAppointment(Appointment appointment)
        {
            return new CreateAppointmentDTO
            {
                Id = appointment.Id,
                DoctorId = appointment.DoctorId,
                Date = appointment.Date
            };
        }

    }
}