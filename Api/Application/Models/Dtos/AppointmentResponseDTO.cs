using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Dtos
{
    public class AppointmentResponseDTO
    {
        public int Id { get; set; } 
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }
        public AppointmentStatus Status { get; set; }
        public int? PatientId { get; set; }
        public string Observations { get; set; }

        public static AppointmentResponseDTO fromAppointmentResponse(Appointment appointment)
        {
            return new AppointmentResponseDTO 
            {
                Id = appointment.Id,
                DoctorId = appointment.DoctorId,
                Date = appointment.Date,
                Status = appointment.Status,
                PatientId = appointment.PatientId,
                Observations = appointment.Observations,

            };
        }
    }
}
