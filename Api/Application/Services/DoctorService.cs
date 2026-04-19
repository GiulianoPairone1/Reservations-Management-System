using Application.Interfaces;
using Application.Models.Dtos;
using Application.Models.DTOs;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly  IDoctorRepository _idoctorrepository;
        public DoctorService(IDoctorRepository doctorRepository)
        {
            _idoctorrepository = doctorRepository;
        }

        public DoctorDTO GetByUserId(int userId)
        {
            var doctor = _idoctorrepository.GetByUserId(userId)
                ?? throw new KeyNotFoundException("Perfil de doctor no encontrado");

            return DoctorDTO.FromDoctor(doctor);
        }

        public List<DoctorDTO> GetAll()
        {
            var doctors = _idoctorrepository.GetAll();
            return doctors.Select(doctor => DoctorDTO.FromDoctor(doctor)).ToList();
        }
        public DoctorDTO GetDoctorByMatricula(string matricula)
        {
            if (string.IsNullOrEmpty(matricula))
                throw new ArgumentException("La matrícula no puede ser nula o vacía.", nameof(matricula));
            var doctor = _idoctorrepository.GetByMatricula(matricula)
                    ?? throw new KeyNotFoundException("Doctor no encontrado");
            return DoctorDTO.FromDoctor(doctor);
        }
        public DoctorDTO Create(DoctorDTO doctorDto)
        {
            //Se incripta la contraseña del DTO antes de convertirlo a entidad
            doctorDto.Password = BCrypt.Net.BCrypt.HashPassword(doctorDto.Password);

            // Se convierte en  entidad
            var doctor = doctorDto.ToDoctor();

            _idoctorrepository.Add(doctor);

            return DoctorDTO.FromDoctor(doctor);
        }
        public DoctorDTO UpdateProfile(int doctorId, DoctorDTO doctorDto)
        {
            var doctor = _idoctorrepository.GetByIdWithUser(doctorId)
                        ?? throw new KeyNotFoundException("Doctor no encontrado");
            doctorDto.UpdateDoctor(doctor);
            _idoctorrepository.Update(doctor);
            return DoctorDTO.FromDoctor(doctor);
        }


    }
}
