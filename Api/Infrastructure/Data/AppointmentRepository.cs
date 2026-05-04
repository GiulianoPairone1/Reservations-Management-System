using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class AppointmentRepository : EfRepository<Domain.Entities.Appointment>, Domain.Interfaces.IAppointmentRepository
    {
        private readonly ApplicationDbContext _applicationcontext;
        public AppointmentRepository(ApplicationDbContext context) : base(context)
        {
            _applicationcontext = context;
            {
            }
        }

        public bool CheckOverlap(int doctorId, DateTime timeWindowStart, DateTime timeWindowEnd)
        {
            return _context.Appointments.Any(a =>
                a.DoctorId == doctorId &&
                a.Date > timeWindowStart &&
                a.Date < timeWindowEnd);
        }
        public Appointment Add(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            _context.SaveChanges();
            return appointment;
        }
        //Para el historial del cliente
        public List<Appointment> GetHistoryWithDetailsByPatientId(int patientId)
        {
            return _applicationcontext.Appointments
                .Include(a => a.Professional)        
                    .ThenInclude(d => d.User)        
                .Where(a => a.PatientId == patientId && a.Status == Domain.Enums.AppointmentStatus.Atendido)
                .OrderByDescending(a => a.Date)
                .ToList(); 
        }
    }
}