using Application.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IDoctorService
    {
        DoctorDTO GetByUserId(int userId);
        List<DoctorDTO> GetAll();
        DoctorDTO GetDoctorByMatricula(string matricula);
        DoctorDTO Create(DoctorDTO doctorDto);
        DoctorDTO UpdateProfile(int doctorId, DoctorDTO doctorDto);
    }
}
