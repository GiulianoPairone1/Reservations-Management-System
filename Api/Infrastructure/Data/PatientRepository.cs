using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PatientRepository : EfRepository<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext context) : base(context) {}

        public Patient? GetByDni(int dni)
        {
            return _context.Patients
                .Include(p => p.User)
                .FirstOrDefault(p => p.DNI == dni);
        }

        public Patient? GetByUserId(int userId)
        {
            return _context.Patients
                .Include(p => p.User)
                .FirstOrDefault(p => p.UserId == userId);
        }
        /// <summary>
        /// Obtiene un paciente específico por su clave primaria (Id) y carga proactivamente (Eager Loading) 
        /// su entidad User asociada. 
        /// 
        /// Se diferencia del GetById genérico porque utiliza .Include() para realizar un JOIN con la tabla Users.
        /// Esto es fundamental para operaciones de Update (UpdateProfile), ya que evita que las propiedades 
        /// de navegación (Nombre, Apellido, Email) sean nulas al momento de mapear los cambios desde el DTO.
        /// </summary>
        public Patient? GetByIdWithUser(int id)
        {
            return _context.Patients
                .Include(p => p.User) 
                .FirstOrDefault(p => p.Id == id);
        }

    }
}