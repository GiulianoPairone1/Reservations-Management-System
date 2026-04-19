using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPatientRepository : IRepositoryBase<Patient>
    {
        Patient? GetByIdWithUser(int id);
        Patient? GetByDni(int dni);
        Patient? GetByUserId(int userId);
    }
}
