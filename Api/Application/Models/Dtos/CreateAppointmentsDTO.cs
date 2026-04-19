using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Dtos
{
    public class CreateAppointmentsDTO
    {
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }

    }
}
