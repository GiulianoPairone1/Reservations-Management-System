using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Dtos
{
    public class BookAppointmentDTO
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
    }
}