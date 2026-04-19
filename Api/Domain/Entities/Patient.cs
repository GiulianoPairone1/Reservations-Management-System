using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Patient
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int DNI { get; set; }
        public string Address { get; set; } = string.Empty;
        public string ObraSocial { get; set; } = string.Empty;
    }
}
