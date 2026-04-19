using Domain.Enums;


namespace Domain.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public int? PatientId { get; set; }
        public Patient? Patient { get; set; }

        public int DoctorId { get; set; }
        public Doctor? Professional { get; set; }
        public DateTime Date { get; set; }
        public AppointmentStatus Status { get; set; }=AppointmentStatus.Pendiente;
        public string Observations { get; set; } = string.Empty;
    }
}