using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Models.DTOs;

namespace Application.Interfaces
{
    public interface IPatientService
    {
        PatientDTO GetByDni(int dni);
        PatientDTO GetByUserId(int userId);
        PatientDTO Create(PatientDTO patientDto);
        PatientDTO UpdateProfile(int patientId, PatientDTO patientDto);
    }
}
