using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{ 
    public class DoctorRepository:EfRepository<Domain.Entities.Doctor>, Domain.Interfaces.IDoctorRepository
    {
        private readonly ApplicationDbContext _context;
        public DoctorRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        } 

        public Doctor? GetByUserId(int userId)
        {
            return _context.Doctors
                .Include(d => d.User)
                .FirstOrDefault(d => d.UserId == userId);
        }
        public Doctor? GetByIdWithUser(int id)
        {
            return _context.Doctors
                .Include(p => p.User)
                .FirstOrDefault(p => p.Id == id);
        }
        public Doctor? GetByMatricula(string matricula)
        {
            return _context.Doctors
                .Include(d => d.User)
                .FirstOrDefault(d => d.Matricula == matricula);
        }
        public override List<Doctor> GetAll()
        {
            return _context.Set<Doctor>()
                           .Include(d => d.User) 
                           .ToList();
        }
    }
}
