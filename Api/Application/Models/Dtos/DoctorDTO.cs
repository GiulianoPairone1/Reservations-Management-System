using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Dtos
{
    public class DoctorDTO
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Surname { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string? Password { get; set; }
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
        [Required]
        public string Matricula { get; set; } = string.Empty;
        [Required]
        public string Specialty { get; set; } = string.Empty;


        public Doctor ToDoctor()
        {
            return new Doctor
            {
                Matricula = this.Matricula,
                Specialty = this.Specialty,

                User = new User
                {
                    Name = this.Name,
                    Surname = this.Surname,
                    Email = this.Email,
                    Password = this.Password, 
                    PhoneNumber = this.PhoneNumber,
                    MainRole = Roles.Doctor
                }
            };
        }

        public void UpdateDoctor(Doctor doctor)
        {
            doctor.User.Name = this.Name;
            doctor.User.Surname = this.Surname;
            doctor.User.Email = this.Email;
            doctor.User.PhoneNumber = this.PhoneNumber;
            doctor.Matricula = this.Matricula;
            doctor.Specialty = this.Specialty;
            if (!string.IsNullOrWhiteSpace(this.Password))
            {
                doctor.User.Password = BCrypt.Net.BCrypt.HashPassword(this.Password);
            }
        }

        public static DoctorDTO FromDoctor(Doctor doctor)
        {
            return new DoctorDTO
            {
                Id = doctor.Id,
                Matricula = doctor.Matricula,
                Specialty = doctor.Specialty,
                Name = doctor.User?.Name,
                Surname = doctor.User?.Surname,
                Email = doctor.User?.Email,
                PhoneNumber = doctor.User?.PhoneNumber
            };
        }
    }
}
