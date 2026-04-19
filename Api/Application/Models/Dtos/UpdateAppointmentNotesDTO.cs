using Domain.Enums;


namespace Application.Models.Dtos
{
    public class UpdateAppointmentNotesDTO
    {
        public int AppointmentId { get; set; }
        public string Observations { get; set; } = string.Empty;
        public AppointmentStatus Status { get; set; }
    }
}
