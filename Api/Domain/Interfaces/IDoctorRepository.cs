using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IDoctorRepository:IRepositoryBase<Doctor>
    {
        Doctor? GetByUserId(int userId);
        Doctor? GetByMatricula(string matricula);
        Doctor? GetByIdWithUser(int id);
    }
}
