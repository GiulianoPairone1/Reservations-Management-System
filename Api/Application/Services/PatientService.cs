using Application.Interfaces;
using Application.Models.DTOs;
using BCrypt.Net;
using Domain.Interfaces;

namespace Application.Services
{
    public class PatientService:IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }


        public PatientDTO GetByUserId(int userId)
        {
            var patient = _patientRepository.GetByUserId(userId)
                ?? throw new KeyNotFoundException("Perfil de paciente no encontrado");

            return PatientDTO.FromPatient(patient);
        }

        public PatientDTO GetByDni(int dni)
        {
            if (dni <= 0)
                throw new ArgumentException("El DNI debe ser un número positivo.", nameof(dni));
            var patient = _patientRepository.GetByDni(dni)
                        ?? throw new KeyNotFoundException("Paciente no encontrado");
            return PatientDTO.FromPatient(patient);
        }

        public PatientDTO Create(PatientDTO patientDto)
        {
            patientDto.Password = BCrypt.Net.BCrypt.HashPassword(patientDto.Password);
            var patient = patientDto.ToPatient();
            _patientRepository.Add(patient);
            return PatientDTO.FromPatient(patient);
        }

        public PatientDTO UpdateProfile(int patientId, PatientDTO patientDto)
        {
            var patient = _patientRepository.GetByIdWithUser(patientId)
                        ?? throw new KeyNotFoundException("Paciente no encontrado");
            patientDto.UpdatePatient(patient);
            _patientRepository.Update(patient);
            return PatientDTO.FromPatient(patient);
        }
    }
}
