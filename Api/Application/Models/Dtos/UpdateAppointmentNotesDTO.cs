using Domain.Enums;
using Domain.Entities;

namespace Application.Models.Dtos
{
    public class UpdateAppointmentNotesDTO
    {
        public int Id { get; set; }
        public string Observations { get; set; } = string.Empty;
        public AppointmentStatus Status { get; set; }

        public string ReasonForVisit { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;

        public void UpdateAppointmentNote(Appointment appointment)
        {
            appointment.Observations = this.Observations;
            appointment.Status = this.Status;

            appointment.ReasonForVisit = this.ReasonForVisit;
            appointment.Diagnosis = this.Diagnosis;
        }
    }
}