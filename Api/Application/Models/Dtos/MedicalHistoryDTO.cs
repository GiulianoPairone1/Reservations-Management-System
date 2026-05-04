using System;

namespace Application.DTOs
{
    public class MedicalHistoryDTO
    {
        public int AppointmentId { get; set; }
        public DateTime Date { get; set; }

        public string DoctorFullName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;

        public string ReasonForVisit { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
    }
}