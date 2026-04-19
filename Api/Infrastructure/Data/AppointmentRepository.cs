using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class AppointmentRepository : EfRepository<Domain.Entities.Appointment>, Domain.Interfaces.IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        public AppointmentRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
            {
            }
        }
    }
}